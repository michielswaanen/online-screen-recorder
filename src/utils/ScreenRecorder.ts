import Recorder from "./Recorder";

class ScreenRecorder extends Recorder {

  private readonly audioEnabled: boolean;

  constructor(audioEnabled: boolean = true) {
    super();
    this.audioEnabled = audioEnabled;
  }

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
        const mimeType: string = this.getMimeType({ video: true, audio: this.audioEnabled }).video;

        const recorder: MediaRecorder = new MediaRecorder(this.getMediaStream(), {
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
      this.stopAllTracks();
      this.getMediaRecorder().stop();
    }
  }

  public async askPermission(): Promise<void> {
    try {
      // @ts-ignore
      const stream: MediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: this.audioEnabled});

      await this.setPermission("granted");
      this.setMediaStream(stream);
    } catch (e) {
      await this.setPermission("denied");
    }
  }

  public async getDeviceOptions(): Promise<{video: MediaDeviceInfo[], audio: MediaDeviceInfo[]}> {
    return {video: [], audio: []};
  }

  public async switchDevice(deviceId: MediaDeviceInfo["deviceId"]): Promise<void> {
    try {
      this.stopAllTracks();

      //@ts-ignore
      const stream: MediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          deviceId: { exact: deviceId },
        }, audio: this.audioEnabled
      });

      console.log("New Screen Stream", stream);
      this.setMediaStream(stream);
    } catch (e) {
      console.log(e)
      throw new Error("Couldn't fetch selected screen device!");
    }
  }
}

export default ScreenRecorder;