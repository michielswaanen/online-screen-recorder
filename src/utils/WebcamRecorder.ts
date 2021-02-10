import Recorder from "./Recorder";

class WebcamRecorder extends Recorder {

  private readonly audioEnabled: boolean;

  constructor(audioEnabled: boolean = true) {
    super();
    this.audioEnabled = audioEnabled;
  }

  public start() {
    const permission: string = this.getPermission();

    if (permission === "denied") {
      console.log("Permission denied for webcam")
    } else if (permission === "unasked") {
      console.log("No webcam permission yet")
    } else {
      if (this.isRecording()) {
        console.log("Already recording webcam...")
      } else {
        const mimeType: string = this.getMimeType({ video: true, audio: this.audioEnabled }).video;

        const recorder: MediaRecorder = new MediaRecorder(this.getMediaStream(), {
          videoBitsPerSecond: 2500000,
          mimeType: mimeType
        });

        this.setMediaRecorder(recorder);
        recorder.start();
      }
    }
  }

  public stop() {
    if (!this.isRecording()) {
      console.log("Not recording webcam...")
    } else {
      this.stopAllTracks();
      this.getMediaRecorder().stop();
    }
  }

  public async askPermission(): Promise<void> {
    try {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: this.audioEnabled });

      await this.setPermission("granted");
      this.setMediaStream(stream);
    } catch (e) {
      await this.setPermission("denied");
    }
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
      this.stopAllTracks();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: deviceId },
        }, audio: this.audioEnabled
      });
      this.setMediaStream(stream);
    } catch (e) {
      console.log(e)
      throw new Error("Couldn't fetch selected webcam device!");
    }
  }
}

export default WebcamRecorder;