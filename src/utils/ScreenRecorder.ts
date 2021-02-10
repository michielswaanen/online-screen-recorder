import Recorder from "./Recorder";

class ScreenRecorder extends Recorder {

  public start(): void {
    const permission: string = this.getPermission();

    if (permission === "denied") {
      console.log("Permission denied for screen")
    } else if (permission === "unasked") {
      console.log("No screen permission yet")
    } else {
      if (this.isRecording()) {
        console.log("Already recording screen...")
      } else {
        const track: MediaStreamTrack = this.getMediaStreamTrack();
        const mimeType: string = this.getMimeType({ video: true, audio: false }).video;

        const stream: MediaStream = new MediaStream([track]);
        const recorder: MediaRecorder = new MediaRecorder(stream, {
          audioBitsPerSecond: 2500000,
          mimeType: mimeType
        });

        this.setMediaRecorder(recorder);
        recorder.start();
      }
    }
  }

  public stop(): void {
    if (!this.isRecording()) {
      console.log("Not recording screen...")
    } else {
      this.getMediaStreamTrack().stop();
      this.getMediaRecorder().stop();
    }
  }

  public async askPermission(): Promise<void> {
    try {
      // @ts-ignore
      const stream: MediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true});
      const track = stream.getVideoTracks()[0];

      await this.setPermission("granted");
      this.setMediaStreamTrack(track);
    } catch (e) {
      await this.setPermission("denied");
    }
  }

  public getCurrentDevice(devices: MediaDeviceInfo[]): MediaDeviceInfo | undefined {
    const track: MediaStreamTrack = this.getMediaStreamTrack();
    const currentDeviceId: string | undefined = track.getSettings().deviceId;

    if (!currentDeviceId)
      return undefined;

    for (let device of devices) {
      if (currentDeviceId === device.deviceId) {
        return device;
      }
    }

    return undefined;
  }

  public async getDeviceOptions(): Promise<MediaDeviceInfo[]> {
    const options: MediaDeviceInfo[] = []

    const devices: MediaDeviceInfo[] = await navigator.mediaDevices.enumerateDevices();

    for (let device of devices) {
      if (device.kind == "videoinput") {
        options.push(device);
      }
    }

    return options;
  }

  public async switchDevice(deviceId: MediaDeviceInfo["deviceId"]): Promise<void> {
    try {
      this.getMediaStreamTrack().stop();

      //@ts-ignore
      const stream: MediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          deviceId: { exact: deviceId },
        }
      });
      const track: MediaStreamTrack = stream.getAudioTracks()[0];

      console.log("New Screen Stream", stream);
      this.setMediaStreamTrack(track);
    } catch (e) {
      console.log(e)
      throw new Error("Couldn't fetch selected screen device!");
    }
  }
}

export default ScreenRecorder;