import { ComputableInterface } from "./WebGPUCompute";
import computeShader from "bundle-text:./compute-shader.wgsl";

const createEntityData: (count: number) => Float32Array = (count) => {
  const stride = 4 + 4 + 2 + 2; // vec3 position + padding, vec3 velocity + padding, vec3 color, float mass + padding
  const size = stride * Float32Array.BYTES_PER_ELEMENT * count;

  const entityData = new Float32Array(new ArrayBuffer(size));
  for (let i = 0; i < count; i++) {
    const x = i % window.innerWidth;
    const y = Math.floor(i / window.innerWidth);

    entityData[i * stride + 0] = x; // position.x
    entityData[i * stride + 1] = y; // position.y
    entityData[i * stride + 2] = 0; // position.z

    entityData[i * stride + 4] = 0; // velocity.x
    entityData[i * stride + 5] = 0; // velocity.y
    entityData[i * stride + 6] = 0; // velocity.z

    entityData[i * stride + 8] = x / window.innerWidth; // uv.u
    entityData[i * stride + 9] = y / window.innerHeight; // uv.v
    entityData[i * stride + 10] = 0.5 + Math.random(); // mass
  }

  return entityData;
};

class SimulationComputable implements ComputableInterface {
  private pipeline: GPUComputePipeline;

  private simulationBufferA: GPUBuffer;
  private simulationBufferB: GPUBuffer;

  public simulationBindGroupA: GPUBindGroup;
  public simulationBindGroupB: GPUBindGroup;

  private entityData: Float32Array;
  private simulationBindGroupLayout: GPUBindGroupLayout;

  private bindGroupSwapIndex = 0;

  constructor(
    private device: GPUDevice,
    private particlesCount: number,
    private uniformsBindGroupLayout: GPUBindGroupLayout,
    private uniformsBindGroup: GPUBindGroup
  ) {
    this.entityData = createEntityData(this.particlesCount);
    this.createSimulationBuffersAndBindGroups();
    this.createPipeline();
  }

  private createSimulationBuffersAndBindGroups() {
    this.simulationBindGroupLayout = this.device.createBindGroupLayout({
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

    const size = this.entityData.byteLength;
    this.simulationBufferA = this.device.createBuffer({
      size,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });
    new Float32Array(this.simulationBufferA.getMappedRange()).set([
      ...this.entityData,
    ]);
    this.simulationBufferA.unmap();

    this.simulationBufferB = this.device.createBuffer({
      size,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    this.simulationBindGroupA = this.device.createBindGroup({
      layout: this.simulationBindGroupLayout,
      entries: [
        { binding: 0, resource: { buffer: this.simulationBufferA } },
        { binding: 1, resource: { buffer: this.simulationBufferB } },
      ],
    });

    this.simulationBindGroupB = this.device.createBindGroup({
      layout: this.simulationBindGroupLayout,
      entries: [
        { binding: 0, resource: { buffer: this.simulationBufferB } },
        { binding: 1, resource: { buffer: this.simulationBufferA } },
      ],
    });
  }

  private createPipeline() {
    const shaderModule = this.device.createShaderModule({
      code: computeShader,
    });

    const bindGroupLayout = this.device.createPipelineLayout({
      bindGroupLayouts: [
        this.simulationBindGroupLayout,
        this.uniformsBindGroupLayout,
      ],
    });

    this.pipeline = this.device.createComputePipeline({
      layout: bindGroupLayout,
      compute: {
        module: shaderModule,
        entryPoint: "main",
      },
    });
  }

  public getBindGroupLayout(): GPUBindGroupLayout {
    return this.simulationBindGroupLayout;
  }

  public getActiveBindGroup(): GPUBindGroup {
    return this.bindGroupSwapIndex % 2 === 0
      ? this.simulationBindGroupA
      : this.simulationBindGroupB;
  }

  public swapBindGroups(): void {
    this.bindGroupSwapIndex++;
  }

  public getCommands(): GPUCommandBuffer | undefined {
    if (!this.getActiveBindGroup()) return;

    const commandEncoder = this.device.createCommandEncoder();
    const computePass = commandEncoder.beginComputePass();
    computePass.setPipeline(this.pipeline);
    computePass.setBindGroup(0, this.getActiveBindGroup());
    computePass.setBindGroup(1, this.uniformsBindGroup);

    computePass.dispatchWorkgroups(Math.ceil(this.particlesCount / 64));
    computePass.end();

    return commandEncoder.finish();
  }
}

export default SimulationComputable;
