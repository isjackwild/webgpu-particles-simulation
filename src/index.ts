import imgSrc from "./maps/George-McNeil.png";
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

  particlesRenderable.simulationSrcBindGroup =
    simulationComputable.getActiveBindGroup();
  renderer.render();

  requestAnimationFrame(animate);
};

const onMouseDown = ({ clientX, clientY }) => {
  isMouseDown = true;
  mouse.x = clientX;
  mouse.y = clientY;
};

const onMouseUp = () => {
  isMouseDown = false;
  mouse.x = -999999;
  mouse.y = -999999;
};

const onMouseMove = ({ clientX, clientY }) => {
  if (!isMouseDown) return;
  mouse.x = clientX;
  mouse.y = clientY;
};

const init = async () => {
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
  window.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mouseup", onMouseUp);
  window.addEventListener("mousemove", onMouseMove);
};

init();
