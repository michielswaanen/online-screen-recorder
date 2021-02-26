import MediaDevice from "./MediaDevice";

class MicrophoneMediaDevice extends MediaDevice {

  public preview(): void {
  }

  public close(): void {
  }

  public async options(): Promise<MediaDeviceInfo[]> {
    const result: MediaDeviceInfo[] = []

    const devices: MediaDeviceInfo[] = await navigator.mediaDevices.enumerateDevices();

    for (let device of devices)
      if (device.kind == "audioinput")
        result.push(device);

    return result;
  }

  public async select(deviceId: string | undefined = undefined) {
    try {
      const constraints: MediaStreamConstraints = !deviceId ? { audio: true } : { audio: { deviceId: { exact: deviceId } } };
      const stream = await this.prompt(constraints);

      await this.setPermission("granted");
      this.setMediaStream(stream);
    } catch (e) {
      await this.setPermission("denied");
    }
  }
}

export default MicrophoneMediaDevice;