/// <reference types="@webgpu/types" />

console.log("Hello world!");
import computeShader from "bundle-text:./compute-shader.wgsl";
import drawShader from "bundle-text:./draw-shader.wgsl";
import { vec3 } from "gl-matrix";

// SECTION ON ALIGNMENT...
// https://surma.dev/things/webgpu/

// you have to pad a vec3 because of alignment
const VERTEX_COUNT = 6;
const ENTITIES_COUNT = 500_000;
// const ENTITIES_COUNT = 2_000_000;
const STRIDE = 4 + 4; // vec3 position + padding, vec3 velocity, float mass
const BUFFER_SIZE = STRIDE * Float32Array.BYTES_PER_ELEMENT * ENTITIES_COUNT;

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx: GPUCanvasContext;
let presentationFormat;

let device: GPUDevice;
let bufferA, bufferB, vertexDataBuffer;

let bindGroupLayout, bindGroupA, bindGroupB;
let uniformBuffer, uniformBindGroup;

let shaderModule, computePipeline;
let renderPipeline;
let renderPassDesc: GPURenderPassDescriptor;

let loops = 0;

const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

let entityData = new Float32Array(new ArrayBuffer(BUFFER_SIZE));
for (let entity = 0; entity < ENTITIES_COUNT; entity++) {
  const position = vec3.fromValues(
    Math.random() * window.innerWidth,
    Math.random() * window.innerHeight,
    0
  );

  const velocity = vec3.fromValues(
    Math.random() * 2 - 1,
    Math.random() * 2 - 1,
    0
  );
  vec3.normalize(velocity, velocity);
  vec3.scale(velocity, velocity, 0.1 + Math.random() * 0.5);

  entityData[entity * STRIDE + 0] = position[0]; // position.x
  entityData[entity * STRIDE + 1] = position[1]; // position.y
  entityData[entity * STRIDE + 2] = position[2]; // position.z

  entityData[entity * STRIDE + 4] = velocity[0]; // velocity.x
  entityData[entity * STRIDE + 5] = velocity[1]; // velocity.y
  entityData[entity * STRIDE + 6] = velocity[2]; // velocity.z

  entityData[entity * STRIDE + 7] = 0.5 + Math.random(); // mass
}

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

const createBuffers = () => {
  bufferA = device.createBuffer({
    size: BUFFER_SIZE,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true,
  });
  new Float32Array(bufferA.getMappedRange()).set([...entityData]);
  bufferA.unmap();

  bufferB = device.createBuffer({
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
  bindGroupLayout = device.createBindGroupLayout({
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
      {
        binding: 2,
        visibility:
          GPUShaderStage.VERTEX |
          GPUShaderStage.FRAGMENT |
          GPUShaderStage.COMPUTE,
        buffer: { type: "uniform" },
      },
    ],
  });

  // A bind group represents the actual input/output data for a shader.
  bindGroupA = device.createBindGroup({
    layout: bindGroupLayout,
    entries: [
      { binding: 0, resource: { buffer: bufferA } },
      { binding: 1, resource: { buffer: bufferB } },
      {
        binding: 2,
        resource: {
          buffer: uniformBuffer,
        },
      },
    ],
  });

  bindGroupB = device.createBindGroup({
    layout: bindGroupLayout,
    entries: [
      { binding: 0, resource: { buffer: bufferB } },
      { binding: 1, resource: { buffer: bufferA } },
      {
        binding: 2,
        resource: {
          buffer: uniformBuffer,
        },
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
      bindGroupLayouts: [bindGroupLayout],
    }),
    compute: {
      module: shaderModule,
      entryPoint: "main",
    },
  });
};

const createComputeCommands = (bindGroup) => {
  const commandEncoder = device.createCommandEncoder();
  const computePass = commandEncoder.beginComputePass();
  computePass.setPipeline(computePipeline);
  computePass.setBindGroup(0, bindGroup);

  computePass.dispatchWorkgroups(Math.ceil(ENTITIES_COUNT / 64));
  computePass.end();

  return commandEncoder.finish();
};

const compute = () => {
  performance.mark("compute.start");

  device.queue.submit([
    createComputeCommands(loops % 2 === 0 ? bindGroupA : bindGroupB),
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

  const fragmentState = {
    module: shaderModule,
    entryPoint: "fragment_main",
    targets: [{ format: presentationFormat }],
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
      bindGroupLayouts: [bindGroupLayout],
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
        clearValue: { r: 0.5, g: 0.5, b: 0.5, a: 1.0 },
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
  renderPass.setBindGroup(0, loops % 2 === 0 ? bindGroupB : bindGroupA);
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

(async () => {
  if (!navigator.gpu) {
    alert(
      "WebGPU not available! — Use Chrome Canary and enable-unsafe-gpu in flags."
    );
    return;
  }

  // setupDOMRenderer();
  await requestWebGPU();
  setupCanvasCtx();
  createBuffers();
  createBindGroups();
  createComputePipeline();
  await createRenderPipeline();

  requestAnimationFrame(animate);
  window.addEventListener("mousemove", ({ clientX, clientY }) => {
    mouse.x = clientX;
    mouse.y = clientY;
  });
})();
