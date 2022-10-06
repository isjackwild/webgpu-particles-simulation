import WebGPURenderer, { RenderableInterface } from "./WebGPURenderer";
import drawShader from "bundle-text:./draw-shader.wgsl";

type TGeometry = {
  vertexCount: number;
  bufferSize: number;
  bufferData: number[];
};
const createQuad: () => TGeometry = () => {
  return {
    vertexCount: 6,
    bufferSize: 6 * 2 * 2 * Float32Array.BYTES_PER_ELEMENT,
    bufferData: [
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
    ],
  };
};

class ParticlesRenderable implements RenderableInterface {
  private pipeline: GPURenderPipeline;
  private simulationBindGroup?: GPUBindGroup;
  private vertexBuffer: GPUBuffer;
  private vertexCount: number;
  private uniformsBindGroupLayout: GPUBindGroupLayout;
  private uniformsBindGroup: GPUBindGroup;

  constructor(
    private device: GPUDevice,
    private renderer: WebGPURenderer,
    private particlesCount: number,
    private sharedUniformsBindGroupLayout: GPUBindGroupLayout,
    private sharedUniformsBindGroup: GPUBindGroup,
    private simulationBindGroupLayout: GPUBindGroupLayout,
    private texture: GPUTexture
  ) {
    this.createVertexBuffer();
    this.createUniformsBuffersAndBindGroups();
    this.createPipeline();
  }

  private createVertexBuffer() {
    const { vertexCount, bufferSize, bufferData } = createQuad();
    this.vertexCount = vertexCount;
    this.vertexBuffer = this.device.createBuffer({
      size: bufferSize,
      usage: GPUBufferUsage.VERTEX,
      mappedAtCreation: true,
    });
    new Float32Array(this.vertexBuffer.getMappedRange()).set(bufferData);
    this.vertexBuffer.unmap();
  }

  private createUniformsBuffersAndBindGroups() {
    this.uniformsBindGroupLayout = this.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility:
            GPUShaderStage.VERTEX |
            GPUShaderStage.FRAGMENT |
            GPUShaderStage.COMPUTE,
          sampler: { type: "filtering" },
        },
        {
          binding: 1,
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

    this.uniformsBindGroup = this.device.createBindGroup({
      layout: this.uniformsBindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: this.device.createSampler({
            magFilter: "linear",
            minFilter: "linear",
          }),
        },
        {
          binding: 1,
          resource: this.texture.createView(),
        },
      ],
    });
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

    const pipelineLayout = this.device.createPipelineLayout({
      bindGroupLayouts: [
        this.simulationBindGroupLayout,
        this.sharedUniformsBindGroupLayout,
        this.uniformsBindGroupLayout,
      ],
    });

    this.pipeline = this.device.createRenderPipeline({
      layout: pipelineLayout,
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
  ): GPUCommandBuffer | undefined {
    if (!this.simulationSrcBindGroup) return;

    const commandEncoder = this.device.createCommandEncoder();
    const renderPass = commandEncoder.beginRenderPass(renderPassDescriptor);
    renderPass.setPipeline(this.pipeline);
    renderPass.setBindGroup(0, this.simulationSrcBindGroup);
    renderPass.setBindGroup(1, this.sharedUniformsBindGroup);
    renderPass.setBindGroup(2, this.uniformsBindGroup);
    renderPass.setVertexBuffer(0, this.vertexBuffer);
    renderPass.draw(this.vertexCount, this.particlesCount, 0, 0);
    renderPass.end();

    return commandEncoder.finish();
  }
}

export default ParticlesRenderable;
