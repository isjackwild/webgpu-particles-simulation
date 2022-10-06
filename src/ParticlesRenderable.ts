import WebGPURenderer, { RenderableInterface } from "./WebGPURenderer";

import drawShader from "bundle-text:./draw-shader.wgsl";

const VERTEX_COUNT = 6;

class ParticlesRenderable implements RenderableInterface {
  private pipeline: GPURenderPipeline;
  private simulationBindGroup?: GPUBindGroup;
  private vertexBuffer: GPUBuffer;

  constructor(
    private device: GPUDevice,
    private renderer: WebGPURenderer,
    private particlesCount: number,
    private uniformsBindGroupLayout: GPUBindGroupLayout,
    private uniformsBindGroup: GPUBindGroup,
    private simulationBindGroupLayout: GPUBindGroupLayout
  ) {
    this.createVertexBuffer();
    this.createPipeline();
  }

  private createVertexBuffer() {
    this.vertexBuffer = this.device.createBuffer({
      size: VERTEX_COUNT * 2 * 2 * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.VERTEX,
      mappedAtCreation: true,
    });
    new Float32Array(this.vertexBuffer.getMappedRange()).set([
      1,
      1,
      1,
      0, //position, uv
      1,
      -1,
      1,
      1,
      -1,
      -1,
      0,
      1,

      1,
      1,
      1,
      0,
      -1,
      -1,
      0,
      1,
      -1,
      1,
      0,
      0,
    ]);
    this.vertexBuffer.unmap();
  }

  private createPipeline() {
    const shaderModule = this.device.createShaderModule({ code: drawShader });

    const vertexState: GPUVertexState = {
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
          format: this.renderer.presentationFormat,
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

    const bindGroupLayout = this.device.createPipelineLayout({
      bindGroupLayouts: [
        this.simulationBindGroupLayout,
        this.uniformsBindGroupLayout,
      ],
    });

    this.pipeline = this.device.createRenderPipeline({
      layout: bindGroupLayout,
      vertex: vertexState,
      fragment: fragmentState,
      depthStencil: {
        format: this.renderer.depthFormat,
        depthWriteEnabled: true,
        depthCompare: "less",
      },
    });
  }

  public set simulationSrcBindGroup(group: GPUBindGroup | undefined) {
    this.simulationBindGroup = group;
  }

  public get simulationSrcBindGroup(): GPUBindGroup | undefined {
    return this.simulationBindGroup;
  }

  public getCommands(
    renderPassDescriptor: GPURenderPassDescriptor
  ): GPUCommandBuffer | void {
    if (!this.simulationSrcBindGroup) return;

    const commandEncoder = this.device.createCommandEncoder();
    const renderPass = commandEncoder.beginRenderPass(renderPassDescriptor);
    renderPass.setPipeline(this.pipeline);
    renderPass.setBindGroup(0, this.simulationSrcBindGroup);
    renderPass.setBindGroup(1, this.uniformsBindGroup);
    renderPass.setVertexBuffer(0, this.vertexBuffer);
    renderPass.draw(VERTEX_COUNT, this.particlesCount, 0, 0);
    renderPass.end();

    return commandEncoder.finish();
  }
}

export default ParticlesRenderable;
