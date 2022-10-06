export interface RenderableInterface {
  getCommands(
    renderPassDescriptor: GPURenderPassDescriptor
  ): GPUCommandBuffer | void;
}

class WebGPURenderer {
  public ctx: GPUCanvasContext;
  public presentationFormat: GPUTextureFormat;
  private renderables: Set<RenderableInterface> = new Set();
  public depthFormat: GPUTextureFormat = "depth24plus-stencil8";
  private renderPassDescriptor: GPURenderPassDescriptor;

  constructor(
    private device: GPUDevice,
    private canvas: HTMLCanvasElement,
    options: { alphaMode?: GPUCanvasAlphaMode } = {}
  ) {
    this.ctx = this.canvas.getContext("webgpu") as GPUCanvasContext;
    this.presentationFormat = navigator.gpu.getPreferredCanvasFormat();

    this.ctx.configure({
      device: this.device,
      format: this.presentationFormat,
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
      alphaMode: "opaque",
      ...options,
    });

    const depthTexture = device.createTexture({
      size: {
        width: canvas.width,
        height: canvas.height,
        depthOrArrayLayers: 1,
      },
      format: this.depthFormat,
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });

    this.renderPassDescriptor = {
      colorAttachments: [
        {
          view: this.ctx.getCurrentTexture().createView(),
          clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
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
  }

  public addRenderable(renderable: RenderableInterface): void {
    this.renderables.add(renderable);
  }

  public removeRenderable(renderable: RenderableInterface): void {
    this.renderables.delete(renderable);
  }

  public render() {
    this.renderPassDescriptor.colorAttachments[0].view = this.ctx
      .getCurrentTexture()
      .createView();

    for (const renderable of this.renderables) {
      const commands = renderable.getCommands(this.renderPassDescriptor);
      if (commands) {
        this.device.queue.submit([commands]);
      }
    }
  }
}

export default WebGPURenderer;
