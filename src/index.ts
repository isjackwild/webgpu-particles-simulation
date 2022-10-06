/// <reference types="@webgpu/types" />

console.log("Hello world!");
import computeShader from "bundle-text:./compute-shader.wgsl";
import drawShader from "bundle-text:./draw-shader.wgsl";
import { vec3 } from "gl-matrix";
import imgSrc from "./IMG_0481.png";

// TODO — Uniforms and texture on different bind group!

// SECTION ON ALIGNMENT...
// https://surma.dev/things/webgpu/

// you have to pad a vec3 because of alignment
const VERTEX_COUNT = 6;
const ENTITIES_COUNT = window.innerWidth * window.innerHeight;
// const ENTITIES_COUNT = 2_000_000;
const STRIDE = 4 + 4 + 2 + 2; // vec3 position + padding, vec3 velocity + padding, vec3 color, float mass + padding
const BUFFER_SIZE = STRIDE * Float32Array.BYTES_PER_ELEMENT * ENTITIES_COUNT;

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
canvas.width = window.innerWidth * window.devicePixelRatio;
canvas.height = window.innerHeight * window.devicePixelRatio;
let ctx: GPUCanvasContext;
let presentationFormat;

let device: GPUDevice;
let simulationBufferA, simulationBufferB, vertexDataBuffer;

let simulationBindGroupLayout, simulationBindGroupA, simulationBindGroupB;
let uniformBuffer,
  uniformsBindGroupLayout,
  uniformsBindGroup,
  cubeTexture: GPUTexture;

let shaderModule, computePipeline;
let renderPipeline;
let renderPassDesc: GPURenderPassDescriptor;

let loops = 0;

const mouse = { x: -9999, y: -9999 };
let isMouseDown = false;

let entityData = new Float32Array(new ArrayBuffer(BUFFER_SIZE));
for (let entity = 0; entity < ENTITIES_COUNT; entity++) {
  const x = entity % window.innerWidth;
  const y = Math.floor(entity / window.innerWidth);

  entityData[entity * STRIDE + 0] = x; // position.x
  entityData[entity * STRIDE + 1] = y; // position.y
  entityData[entity * STRIDE + 2] = 0; // position.z

  entityData[entity * STRIDE + 4] = 0; // velocity.x
  entityData[entity * STRIDE + 5] = 0; // velocity.y
  entityData[entity * STRIDE + 6] = 0; // velocity.z

  entityData[entity * STRIDE + 8] = x / window.innerWidth; // uv.u
  entityData[entity * STRIDE + 9] = y / window.innerHeight; // uv.v
  entityData[entity * STRIDE + 10] = 0.5 + Math.random(); // mass
}

const requestWebGPU = async () => {
  if (device) return device;

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    console.warn("Could not access Adapter");
    return;
  }
  device = await adapter.requestDevice();
  return device;
};

const setupCanvasCtx = () => {
  ctx = canvas.getContext("webgpu") as GPUCanvasContext;
  presentationFormat = navigator.gpu.getPreferredCanvasFormat();

  ctx.configure({
    device,
    format: presentationFormat,
    alphaMode: "opaque",
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });
};

const createBuffers = () => {
  simulationBufferA = device.createBuffer({
    size: BUFFER_SIZE,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true,
  });
  new Float32Array(simulationBufferA.getMappedRange()).set([...entityData]);
  simulationBufferA.unmap();

  simulationBufferB = device.createBuffer({
    size: BUFFER_SIZE,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });

  vertexDataBuffer = device.createBuffer({
    size: VERTEX_COUNT * 2 * 2 * Float32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  });
  // prettier-ignore
  new Float32Array(vertexDataBuffer.getMappedRange()).set([
    1, 1,     1, 0, //position, uv
    1, -1,    1, 1, 
    -1, -1,   0, 1, 

    1, 1,     1, 0, 
    -1, -1,   0, 1, 
    -1, 1,    0, 0,
  ]);
  vertexDataBuffer.unmap();

  const uniformBufferSize =
    1 * 2 * Float32Array.BYTES_PER_ELEMENT +
    1 * 2 * Float32Array.BYTES_PER_ELEMENT; // resolution, mouse

  uniformBuffer = device.createBuffer({
    size: uniformBufferSize,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
};

const createBindGroups = () => {
  // A bind group layout defines the input/output interface expected by a shader
  const sampler = device.createSampler({
    magFilter: "linear",
    minFilter: "linear",
  });

  simulationBindGroupLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility:
          GPUShaderStage.COMPUTE |
          GPUShaderStage.FRAGMENT |
          GPUShaderStage.VERTEX,
        buffer: { type: "read-only-storage" },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.COMPUTE,
        buffer: { type: "storage" },
      },
    ],
  });

  // A bind group represents the actual input/output data for a shader.
  simulationBindGroupA = device.createBindGroup({
    layout: simulationBindGroupLayout,
    entries: [
      { binding: 0, resource: { buffer: simulationBufferA } },
      { binding: 1, resource: { buffer: simulationBufferB } },
    ],
  });

  simulationBindGroupB = device.createBindGroup({
    layout: simulationBindGroupLayout,
    entries: [
      { binding: 0, resource: { buffer: simulationBufferB } },
      { binding: 1, resource: { buffer: simulationBufferA } },
    ],
  });

  uniformsBindGroupLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility:
          GPUShaderStage.VERTEX |
          GPUShaderStage.FRAGMENT |
          GPUShaderStage.COMPUTE,
        buffer: { type: "uniform" },
      },
      {
        binding: 1,
        visibility:
          GPUShaderStage.VERTEX |
          GPUShaderStage.FRAGMENT |
          GPUShaderStage.COMPUTE,
        sampler: { type: "filtering" },
      },
      {
        binding: 2,
        visibility:
          GPUShaderStage.VERTEX |
          GPUShaderStage.FRAGMENT |
          GPUShaderStage.COMPUTE,
        texture: {
          sampleType: "float",
          multisampled: false,
          viewDimension: "2d",
        },
      },
    ],
  });

  uniformsBindGroup = device.createBindGroup({
    layout: uniformsBindGroupLayout,
    entries: [
      {
        binding: 0,
        resource: {
          buffer: uniformBuffer,
        },
      },
      {
        binding: 1,
        resource: sampler,
      },
      {
        binding: 2,
        resource: cubeTexture.createView(),
      },
    ],
  });
};

const createComputePipeline = () => {
  shaderModule = device.createShaderModule({
    code: computeShader,
  });

  computePipeline = device.createComputePipeline({
    layout: device.createPipelineLayout({
      bindGroupLayouts: [simulationBindGroupLayout, uniformsBindGroupLayout],
    }),
    compute: {
      module: shaderModule,
      entryPoint: "main",
    },
  });
};

const createComputeCommands = (activeSimulationBindGroup) => {
  const commandEncoder = device.createCommandEncoder();
  const computePass = commandEncoder.beginComputePass();
  computePass.setPipeline(computePipeline);
  computePass.setBindGroup(0, activeSimulationBindGroup);
  computePass.setBindGroup(1, uniformsBindGroup);

  computePass.dispatchWorkgroups(Math.ceil(ENTITIES_COUNT / 64));
  computePass.end();

  return commandEncoder.finish();
};

const compute = () => {
  performance.mark("compute.start");

  device.queue.submit([
    createComputeCommands(
      loops % 2 === 0 ? simulationBindGroupA : simulationBindGroupB
    ),
  ]);

  performance.mark("compute.end");
  // console.log(
  //   "COMPUTE",
  //   performance.measure("compute.duration", "compute.start", "compute.end")
  //     .duration
  // );
};

const createRenderPipeline = async () => {
  // Setup shader modules
  const shaderModule = device.createShaderModule({ code: drawShader });
  await shaderModule.compilationInfo();

  const vertexState: GPURenderPipelineDescriptor["vertex"] = {
    module: shaderModule,
    entryPoint: "vertex_main",
    buffers: [
      {
        arrayStride: 2 * 2 * 4, // 2 attributes of 2 elements, each float32 (takes up 4 bytes)
        attributes: [
          {
            format: "float32x2" as GPUVertexFormat,
            offset: 0,
            shaderLocation: 0,
          },
          {
            format: "float32x2" as GPUVertexFormat,
            offset: 2 * 4,
            shaderLocation: 1,
          },
        ],
      },
    ],
  };

  const fragmentState: GPUFragmentState = {
    module: shaderModule,
    entryPoint: "fragment_main",
    targets: [
      {
        format: presentationFormat,
        blend: {
          color: {
            operation: "add",
            srcFactor: "one",
            dstFactor: "one",
          },
          alpha: {
            operation: "add",
            srcFactor: "one",
            dstFactor: "one",
          },
        },
      },
    ],
  };

  const depthFormat = "depth24plus-stencil8";
  const depthTexture = device.createTexture({
    size: {
      width: canvas.width,
      height: canvas.height,
      depthOrArrayLayers: 1,
    },
    format: depthFormat,
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });

  renderPipeline = device.createRenderPipeline({
    layout: device.createPipelineLayout({
      bindGroupLayouts: [simulationBindGroupLayout, uniformsBindGroupLayout],
    }),
    vertex: vertexState,
    fragment: fragmentState,
    depthStencil: {
      format: depthFormat,
      depthWriteEnabled: true,
      depthCompare: "less",
    },
  });

  renderPassDesc = {
    colorAttachments: [
      {
        view: ctx.getCurrentTexture().createView(), // Assigned later
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
        loadOp: "clear",
        storeOp: "store",
      },
    ],
    depthStencilAttachment: {
      view: depthTexture.createView(),
      depthClearValue: 1.0,
      depthLoadOp: "clear",
      depthStoreOp: "store",
      stencilLoadOp: "clear",
      stencilStoreOp: "store",
    },
  };
};

const render = () => {
  performance.mark("render.start");
  renderPassDesc.colorAttachments[0].view = ctx
    .getCurrentTexture()
    .createView();

  const commandEncoder = device.createCommandEncoder();
  const renderPass = commandEncoder.beginRenderPass(renderPassDesc);

  renderPass.setPipeline(renderPipeline);
  renderPass.setBindGroup(
    0,
    loops % 2 === 0 ? simulationBindGroupB : simulationBindGroupA
  );
  renderPass.setBindGroup(1, uniformsBindGroup);
  renderPass.setVertexBuffer(0, vertexDataBuffer);
  renderPass.draw(VERTEX_COUNT, ENTITIES_COUNT, 0, 0);
  renderPass.end();

  device.queue.submit([commandEncoder.finish()]);
  performance.mark("render.end");
  // console.log(
  //   "RENDER",
  //   performance.measure("render.duration", "render.start", "render.end")
  //     .duration
  // );
};

const animate = () => {
  const uniformsArray = new Float32Array([
    window.innerWidth,
    window.innerHeight,
    mouse.x,
    mouse.y,
  ]);
  device.queue.writeBuffer(uniformBuffer, 0, uniformsArray);

  compute();
  render();
  loops++;
  performance.clearMarks();
  performance.clearMeasures();
  requestAnimationFrame(animate);
};

const loadTexture = async () => {
  const img = document.createElement("img");
  img.src = imgSrc;
  await img.decode();
  const imageBitmap = await createImageBitmap(img);

  cubeTexture = device.createTexture({
    size: [imageBitmap.width, imageBitmap.height, 1],
    format: "rgba8unorm",
    usage:
      GPUTextureUsage.TEXTURE_BINDING |
      GPUTextureUsage.COPY_DST |
      GPUTextureUsage.RENDER_ATTACHMENT,
  });
  device.queue.copyExternalImageToTexture(
    { source: imageBitmap },
    { texture: cubeTexture },
    [imageBitmap.width, imageBitmap.height]
  );
};

(async () => {
  if (!navigator.gpu) {
    alert(
      "WebGPU not available! — Use Chrome Canary and enable-unsafe-gpu in flags."
    );
    return;
  }

  // setupDOMRenderer();
  await requestWebGPU();
  await loadTexture();
  setupCanvasCtx();
  createBuffers();
  createBindGroups();
  createComputePipeline();
  await createRenderPipeline();

  requestAnimationFrame(animate);
  window.addEventListener("mousedown", ({ clientX, clientY }) => {
    mouse.x = clientX;
    mouse.y = clientY;
    isMouseDown = true;
  });
  window.addEventListener("mouseup", () => {
    isMouseDown = false;
  });
  window.addEventListener("mousemove", ({ clientX, clientY }) => {
    if (isMouseDown) {
      mouse.x = clientX;
      mouse.y = clientY;
    } else {
      mouse.x = -9999;
      mouse.y = -9999;
    }
  });
})();
