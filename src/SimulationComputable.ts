import { ComputableInterface } from "./WebGPUCompute";
import computeShader from "bundle-text:./compute-shader.wgsl";

class SimulationComputable implements ComputableInterface {
  private pipeline: GPUComputePipeline;
  private simulationBindGroup?: GPUBindGroup;

  constructor(
    private device: GPUDevice,
    private particlesCount: number,
    private uniformsBindGroupLayout: GPUBindGroupLayout,
    private uniformsBindGroup: GPUBindGroup,
    private simulationBindGroupLayout: GPUBindGroupLayout
  ) {
    this.createPipeline();
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

  public set simulationSrcBindGroup(group: GPUBindGroup | undefined) {
    this.simulationBindGroup = group;
  }

  public get simulationSrcBindGroup(): GPUBindGroup | undefined {
    return this.simulationBindGroup;
  }

  public getCommands(): GPUCommandBuffer | undefined {
    if (!this.simulationSrcBindGroup) return;

    const commandEncoder = this.device.createCommandEncoder();
    const computePass = commandEncoder.beginComputePass();
    computePass.setPipeline(this.pipeline);
    computePass.setBindGroup(0, this.simulationSrcBindGroup);
    computePass.setBindGroup(1, this.uniformsBindGroup);

    computePass.dispatchWorkgroups(Math.ceil(this.particlesCount / 64));
    computePass.end();

    return commandEncoder.finish();
  }
}

export default SimulationComputable;
