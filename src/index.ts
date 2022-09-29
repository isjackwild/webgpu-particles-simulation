console.log("Hello world!");
import computeShader from "bundle-text:./compute-shader.wgsl";

// SECTION ON ALIGNMENT...
// https://surma.dev/things/webgpu/

// you have to pad a vec3 because of alignment
const ENTITIES_COUNT = 100;
const STRIDE = 4 + 4; // vec3 position + padding, vec3 velocity + padding
const BUFFER_SIZE = STRIDE * Float32Array.BYTES_PER_ELEMENT * ENTITIES_COUNT;

let device: GPUDevice;
let inputBuffer, outputBuffer, gpuReadBuffer;

let bindGroupLayout, bindGroup;
let shaderModule, computePipeline;

let renderables: HTMLElement[] = [];

let entityData = new Float32Array(new ArrayBuffer(BUFFER_SIZE));
for (let entity = 0; entity < ENTITIES_COUNT; entity++) {
  entityData[entity * STRIDE + 0] = Math.random() * window.innerWidth; // position.x
  entityData[entity * STRIDE + 1] = Math.random() * window.innerHeight; // position.y
  entityData[entity * STRIDE + 2] = Math.random(); // position.z

  entityData[entity * STRIDE + 4] = (Math.random() - 0.5) * 2 * 0.1; // velocity.x
  entityData[entity * STRIDE + 5] = (Math.random() - 0.5) * 2 * 0.1; // velocity.y
  entityData[entity * STRIDE + 6] = (Math.random() - 0.5) * 2 * 0.1; // velocity.z
}

const setupRenderer = () => {
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

const createCommands = () => {
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

  device.queue.submit([createCommands()]);

  // Read buffer.
  await gpuReadBuffer.mapAsync(GPUMapMode.READ, 0, BUFFER_SIZE);
  const arrayBuffer = gpuReadBuffer.getMappedRange(0, BUFFER_SIZE).slice();
  const outputData = new Float32Array(arrayBuffer);
  gpuReadBuffer.unmap();
  entityData = outputData;

  performance.mark("compute.end");
  performance.measure("compute.duration", "compute.start", "compute.end")
    .duration;

  // console.log(performance.getEntriesByName("compute.duration")[0].duration);

  // Finally, clean up the entries.
  performance.clearMarks();
  performance.clearMeasures();
  // console.log("OUTPUT", outputData);
  requestAnimationFrame(compute);
};

const render = () => {
  for (let entity = 0; entity < ENTITIES_COUNT; entity++) {
    const x = entityData[entity * STRIDE + 0]; // position.x
    const y = entityData[entity * STRIDE + 1]; // position.y
    const z = entityData[entity * STRIDE + 2]; // position.z

    const transform = `translate3d(${x}px, ${y}px, ${z}px)`;

    renderables[entity].style.transform = transform;
  }

  requestAnimationFrame(render);
};

(async () => {
  if (!navigator.gpu) {
    alert(
      "WebGPU not available! — Use Chrome Canary and enable-unsafe-gpu in flags."
    );
    return;
  }

  setupRenderer();
  await requestWebGPU();
  createBuffers();
  createBindGroups();
  createComputePipeline();
  createCommands();
  requestAnimationFrame(compute);
  requestAnimationFrame(render);
})();
