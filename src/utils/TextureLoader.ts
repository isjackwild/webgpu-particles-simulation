class TextureLoader {
  constructor(private device: GPUDevice) {}

  public createTextureFromImageBitmapOrCanvas(
    src: ImageBitmap | HTMLCanvasElement
  ): GPUTexture {
    const texture = this.device.createTexture({
      size: [src.width, src.height, 1],
      format: "rgba8unorm",
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
    });
    this.device.queue.copyExternalImageToTexture(
      { source: src },
      { texture: texture },
      [src.width, src.height]
    );

    return texture;
  }

  public async loadTextureFromImageSrc(src: string): Promise<GPUTexture> {
    const response = await fetch(src);
    const blob = await response.blob();
    const imageBitmap = await createImageBitmap(blob);

    return this.createTextureFromImageBitmapOrCanvas(imageBitmap);
  }
}

export default TextureLoader;
