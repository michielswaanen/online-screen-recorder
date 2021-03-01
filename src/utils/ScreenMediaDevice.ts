import MediaDevice, { MediaDeviceType } from "./MediaDevice";

class ScreenMediaDevice extends MediaDevice {

  public async options(): Promise<MediaDeviceInfo[]> {
    return [];
  }

  public async select(deviceId: string | undefined = undefined) {
    try {
      const constraints: MediaStreamConstraints = { video: true, audio: true };
      const stream = await this.prompt(constraints, MediaDeviceType.SCREEN);

      await this.setPermission("granted");
      this.setMediaStream(stream);
    } catch (e) {
      await this.setPermission("denied");
    }
  }
}

export default ScreenMediaDevice;