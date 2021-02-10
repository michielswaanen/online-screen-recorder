import Recorder from "./Recorder";

class WebcamRecorder extends Recorder {

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
        const track: MediaStreamTrack = this.getMediaStreamTrack();
        const mimeType: string = this.getMimeType({ video: true, audio: false }).video;

        const stream: MediaStream = new MediaStream([track])
        const recorder: MediaRecorder = new MediaRecorder(stream, {
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
      this.getMediaStreamTrack().stop();
      this.getMediaRecorder().stop();
    }
  }

  public async askPermission(): Promise<void> {
    try {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const track = stream.getVideoTracks()[0];

      await this.setPermission("granted");
      this.setMediaStreamTrack(track);
    }catch (e) {
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
      this.getMediaStreamTrack().stop();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: {exact: deviceId},
        }
      });
      const track: MediaStreamTrack = stream.getVideoTracks()[0];
      this.setMediaStreamTrack(track);
    } catch (e) {
      console.log(e)
      throw new Error("Couldn't fetch selected webcam device!");
    }
  }
}

export default WebcamRecorder;