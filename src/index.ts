/// <reference types="@webgpu/types" />

import computeShader from "bundle-text:./compute-shader.wgsl";
import imgSrc from "./maps/IMG_0481.png";
import ParticlesRenderable from "./ParticlesRenderable";
import SimulationComputable from "./SimulationComputable";
import { requestWebGPU } from "./utils";
import TextureLoader from "./utils/TextureLoader";
import WebGPUCompute from "./WebGPUCompute";
import WebGPURenderer from "./WebGPURenderer";

// TODO — Uniforms and texture on different bind group!

// SECTION ON ALIGNMENT...
// https://surma.dev/things/webgpu/

// you have to pad a vec3 because of alignment
const ENTITIES_COUNT = window.innerWidth * window.innerHeight;
// const ENTITIES_COUNT = 2_000_000;
const STRIDE = 4 + 4 + 2 + 2; // vec3 position + padding, vec3 velocity + padding, vec3 color, float mass + padding
const BUFFER_SIZE = STRIDE * Float32Array.BYTES_PER_ELEMENT * ENTITIES_COUNT;

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
canvas.width = window.innerWidth * window.devicePixelRatio;
canvas.height = window.innerHeight * window.devicePixelRatio;

let renderer: WebGPURenderer;
let particlesRenderable: ParticlesRenderable;

let computer: WebGPUCompute;
let simulationComputable: SimulationComputable;

let device: GPUDevice;
let simulationBufferA, simulationBufferB;

let simulationBindGroupLayout, simulationBindGroupA, simulationBindGroupB;
let uniformBuffer,
  uniformsBindGroupLayout,
  uniformsBindGroup,
  texture: GPUTexture;

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
        resource: texture.createView(),
      },
    ],
  });
};

const animate = () => {
  const uniformsArray = new Float32Array([
    window.innerWidth,
    window.innerHeight,
    mouse.x,
    mouse.y,
  ]);
  device.queue.writeBuffer(uniformBuffer, 0, uniformsArray);

  simulationComputable.simulationSrcBindGroup =
    loops % 2 === 0 ? simulationBindGroupA : simulationBindGroupB;
  computer.compute();

  particlesRenderable.simulationSrcBindGroup =
    loops % 2 === 0 ? simulationBindGroupB : simulationBindGroupA;
  renderer.render();

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

  device = (await requestWebGPU()) as GPUDevice;
  renderer = new WebGPURenderer(device, canvas);
  computer = new WebGPUCompute(device);
  texture = await new TextureLoader(device).loadTextureFromImageSrc(imgSrc);
  createBuffers();
  createBindGroups();
  simulationComputable = new SimulationComputable(
    device,
    ENTITIES_COUNT,
    uniformsBindGroupLayout,
    uniformsBindGroup,
    simulationBindGroupLayout
  );
  computer.addComputable(simulationComputable);

  particlesRenderable = new ParticlesRenderable(
    device,
    renderer,
    ENTITIES_COUNT,
    uniformsBindGroupLayout,
    uniformsBindGroup,
    simulationBindGroupLayout
  );
  renderer.addRenderable(particlesRenderable);

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
