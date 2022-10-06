let device: GPUDevice;

export const requestWebGPU = async () => {
  if (!navigator.gpu) {
    alert(
      "WebGPU not available! — Use Chrome Canary and enable-unsafe-gpu in flags."
    );
    return;
  }

  if (device) return device;

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    console.warn("Could not access Adapter");
    return;
  }
  return await adapter.requestDevice();
};
