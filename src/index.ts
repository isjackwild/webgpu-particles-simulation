/// <reference types="@webgpu/types" />

import imgSrc from "./maps/IMG_0481.png";
import ParticlesRenderable from "./ParticlesRenderable";
import SimulationComputable from "./SimulationComputable";
import { requestWebGPU } from "./utils";
import TextureLoader from "./utils/TextureLoader";
import WebGPUCompute from "./WebGPUCompute";
import WebGPURenderer from "./WebGPURenderer";

const ENTITIES_COUNT = window.innerWidth * window.innerHeight;

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
canvas.width = window.innerWidth * window.devicePixelRatio;
canvas.height = window.innerHeight * window.devicePixelRatio;

let renderer: WebGPURenderer;
let particlesRenderable: ParticlesRenderable;

let computer: WebGPUCompute;
let simulationComputable: SimulationComputable;

let device: GPUDevice;

let uniformBuffer;

const mouse = { x: -9999, y: -9999 };
let isMouseDown = false;

const createSharedUniformBuffersAndBindGroups: () => [
  GPUBindGroupLayout,
  GPUBindGroup,
  GPUBuffer
] = () => {
  const uniformBufferSize =
    1 * 2 * Float32Array.BYTES_PER_ELEMENT +
    1 * 2 * Float32Array.BYTES_PER_ELEMENT; // resolution, mouse

  const uniformBuffer = device.createBuffer({
    size: uniformBufferSize,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const sharedUniformsBindGroupLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility:
          GPUShaderStage.VERTEX |
          GPUShaderStage.FRAGMENT |
          GPUShaderStage.COMPUTE,
        buffer: { type: "uniform" },
      },
    ],
  });

  const sharedUniformsBindGroup = device.createBindGroup({
    layout: sharedUniformsBindGroupLayout,
    entries: [
      {
        binding: 0,
        resource: {
          buffer: uniformBuffer,
        },
      },
    ],
  });

  return [
    sharedUniformsBindGroupLayout,
    sharedUniformsBindGroup,
    uniformBuffer,
  ];
};

const animate = () => {
  const uniformsArray = new Float32Array([
    window.innerWidth,
    window.innerHeight,
    mouse.x,
    mouse.y,
  ]);
  device.queue.writeBuffer(uniformBuffer, 0, uniformsArray);

  computer.compute();
  simulationComputable.swapBindGroups();

  particlesRenderable.simulationBindGroup =
    simulationComputable.getActiveBindGroup();
  renderer.render();

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
  const texture = await new TextureLoader(device).loadTextureFromImageSrc(
    imgSrc
  );

  renderer = new WebGPURenderer(device, canvas);
  computer = new WebGPUCompute(device);

  const [sharedUniformsBindGroupLayout, sharedUniformsBindGroup, buffer] =
    createSharedUniformBuffersAndBindGroups();
  uniformBuffer = buffer;

  simulationComputable = new SimulationComputable(
    device,
    ENTITIES_COUNT,
    sharedUniformsBindGroupLayout,
    sharedUniformsBindGroup
  );
  computer.addComputable(simulationComputable);

  particlesRenderable = new ParticlesRenderable(
    device,
    renderer,
    ENTITIES_COUNT,
    sharedUniformsBindGroupLayout,
    sharedUniformsBindGroup,
    simulationComputable.getBindGroupLayout(),
    texture
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
