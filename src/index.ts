/// <reference types="@webgpu/types" />

console.log("Hello world!");
import computeShader from "bundle-text:./compute-shader.wgsl";
import drawShader from "bundle-text:./draw-shader.wgsl";
import { vec3 } from "gl-matrix";

// SECTION ON ALIGNMENT...
// https://surma.dev/things/webgpu/

// you have to pad a vec3 because of alignment
const VERTEX_COUNT = 6;
const ENTITIES_COUNT = 200;
const STRIDE = 4 + 4; // vec3 position + padding, vec3 velocity, float mass
const BUFFER_SIZE = STRIDE * Float32Array.BYTES_PER_ELEMENT * ENTITIES_COUNT;

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
let ctx: GPUCanvasContext;
let presentationFormat;

let device: GPUDevice;
let inputBuffer, outputBuffer, gpuReadBuffer, vertexDataBuffer;

let bindGroupLayout, bindGroup;
let shaderModule, computePipeline;

let renderPipeline;
let renderPassDesc: GPURenderPassDescriptor;

let renderables: HTMLElement[] = [];

let entityData = new Float32Array(new ArrayBuffer(BUFFER_SIZE));
for (let entity = 0; entity < ENTITIES_COUNT; entity++) {
  const position = vec3.fromValues(
    Math.random() * window.innerWidth,
    Math.random() * window.innerHeight,
    0
  );

  entityData[entity * STRIDE + 0] = position[0]; // position.x
  entityData[entity * STRIDE + 1] = position[1]; // position.y
  entityData[entity * STRIDE + 2] = position[2]; // position.z

  entityData[entity * STRIDE + 4] = 0; // velocity.x
  entityData[entity * STRIDE + 5] = 0; // velocity.y
  entityData[entity * STRIDE + 6] = 0; // velocity.z

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

const setupDOMRenderer = () => {
  for (let i = 0; i < ENTITIES_COUNT; i++) {
    const div = document.createElement("div");
    div.innerHTML = `💩`;
    div.style.position = "fixed";
    div.style.top = "-1ch";
    div.style.left = "-1ch";
    renderables.push(div);
  }
  document.body.append(...renderables);
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
  // we don't need it mapped or filled because we do this at the start of each compute loop;
  inputBuffer = device.createBuffer({
    size: BUFFER_SIZE,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST, // DST because we copy the result back into this after computation
  });

  outputBuffer = device.createBuffer({
    size: BUFFER_SIZE,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC, // SRC because we copy from this into the gpu read staging buffer
  });

  gpuReadBuffer = device.createBuffer({
    size: BUFFER_SIZE,
    usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
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
};

const createBindGroups = () => {
  // A bind group layout defines the input/output interface expected by a shader
  bindGroupLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.COMPUTE,
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
  bindGroup = device.createBindGroup({
    layout: bindGroupLayout,
    entries: [
      { binding: 0, resource: { buffer: inputBuffer } },
      { binding: 1, resource: { buffer: outputBuffer } },
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

const createComputeCommands = () => {
  const commandEncoder = device.createCommandEncoder();
  const computePass = commandEncoder.beginComputePass();
  computePass.setPipeline(computePipeline);
  computePass.setBindGroup(0, bindGroup);

  computePass.dispatchWorkgroups(Math.ceil(ENTITIES_COUNT / 256));
  computePass.end();

  commandEncoder.copyBufferToBuffer(
    outputBuffer,
    0,
    gpuReadBuffer,
    0,
    BUFFER_SIZE
  );

  return commandEncoder.finish();
};

const compute = async () => {
  performance.mark("compute.start");
  device.queue.writeBuffer(inputBuffer, 0, entityData);

  device.queue.submit([createComputeCommands()]);

  // Read buffer.
  await gpuReadBuffer.mapAsync(GPUMapMode.READ, 0, BUFFER_SIZE);
  const arrayBuffer = gpuReadBuffer.getMappedRange(0, BUFFER_SIZE).slice();
  const outputData = new Float32Array(arrayBuffer);
  gpuReadBuffer.unmap();
  entityData = outputData;

  performance.mark("compute.end");
  // console.log(
  //   performance.measure("compute.duration", "compute.start", "compute.end")
  //     .duration
  // );
  performance.clearMarks();
  performance.clearMeasures();

  requestAnimationFrame(compute);
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

  const bindGroupLayout = device.createBindGroupLayout({
    entries: [],
  });

  const layout = device.createPipelineLayout({
    bindGroupLayouts: [],
  });
  renderPipeline = device.createRenderPipeline({
    layout,
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
        view: undefined, // Assigned later
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

const renderDOM = () => {
  for (let entity = 0; entity < ENTITIES_COUNT; entity++) {
    const x = entityData[entity * STRIDE + 0]; // position.x
    const y = entityData[entity * STRIDE + 1]; // position.y
    const z = entityData[entity * STRIDE + 2]; // position.z

    const transform = `translate3d(${x}px, ${y}px, ${z}px)`;

    renderables[entity].style.transform = transform;
  }

  requestAnimationFrame(renderDOM);
};

const render = () => {
  renderPassDesc.colorAttachments[0].view = ctx
    .getCurrentTexture()
    .createView();

  const commandEncoder = device.createCommandEncoder();
  const renderPass = commandEncoder.beginRenderPass(renderPassDesc);

  renderPass.setPipeline(renderPipeline);
  renderPass.setVertexBuffer(0, vertexDataBuffer);
  renderPass.draw(VERTEX_COUNT, 1, 0, 0);
  renderPass.end();

  device.queue.submit([commandEncoder.finish()]);
  requestAnimationFrame(render);
};

(async () => {
  if (!navigator.gpu) {
    alert(
      "WebGPU not available! — Use Chrome Canary and enable-unsafe-gpu in flags."
    );
    return;
  }

  setupDOMRenderer();
  await requestWebGPU();
  setupCanvasCtx();
  createBuffers();
  createBindGroups();
  createComputePipeline();
  await createRenderPipeline();
  requestAnimationFrame(compute);
  requestAnimationFrame(renderDOM);
  requestAnimationFrame(render);
})();
