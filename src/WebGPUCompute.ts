export interface ComputableInterface {
  getCommands(): GPUCommandBuffer | void;
}

class WebGPUCompute {
  private computables: Set<ComputableInterface> = new Set();

  constructor(private device: GPUDevice) {}

  public addComputable(renderable: ComputableInterface): void {
    this.computables.add(renderable);
  }

  public removeRenderable(renderable: ComputableInterface): void {
    this.computables.delete(renderable);
  }

  public compute() {
    for (const computable of this.computables) {
      const commands = computable.getCommands();
      if (commands) {
        this.device.queue.submit([commands]);
      }
    }
  }
}

export default WebGPUCompute;
