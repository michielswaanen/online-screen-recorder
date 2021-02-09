import Recorder from "./Recorder";

class WebcamRecorder extends Recorder {

  public start = () => {
    const permission: string = this.getPermission();

    if (permission === "denied") {
      console.log("Permission denied")
    } else if (permission === "unasked") {
      console.log("No permission yet")
    } else {
      if (this.isRecording()) {
        console.log("Already recording...")
      } else {
        const stream: MediaStream = this.getMediaStream();
        const mimeType: string = this.getMimeType({ video: true, audio: false }).video;

        const recorder: MediaRecorder = new MediaRecorder(stream, {
          videoBitsPerSecond: 2500000,
          mimeType: mimeType
        });

        this.setMediaRecorder(recorder);
        recorder.start();
      }
    }
  }

  public stop = () => {
    if (!this.isRecording()) {
      console.log("Not recording...")
    } else {
      this.getMediaStream().getTracks()[0].stop();
      this.getMediaRecorder().stop();
    }
  }

  protected getMimeType(query: { audio: boolean; video: boolean }): { audio: string; video: string } {
    return { audio: "", video: "" };
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

  /**
   * Prompt the user with webcam access
   *
   * Allows access:
   *  - Set permission to granted
   *  - Initialize media stream for webcam
   *
   * Reason of denial:
   *  - Webcam already in use
   *  - Client disallowed access
   */
  public askPermission(): Promise<void> {
    const stream: Promise<MediaStream> = navigator.mediaDevices.getUserMedia({ video: true });

    return stream.then((stream: MediaStream) => {
      this.setPermission("granted");
      this.setMediaStream(stream);
    }).catch(() => {
      this.setPermission("denied");
    });
  }

  public switchDevice(deviceId: MediaDeviceInfo["deviceId"]): void {
    const stream = navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: {exact: deviceId},
      }
    });

    stream.then((stream: MediaStream) => {
      console.log("New Stream", stream);
      this.setMediaStream(stream);
    });
  }

  public getCurrentDevice(devices: MediaDeviceInfo[]): MediaDeviceInfo | undefined {
    const track: MediaStreamTrack = this.getMediaStream().getTracks()[0];
    const currentDeviceId: string | undefined = track.getSettings().deviceId;

    if(!currentDeviceId)
      return undefined;

    for (let device of devices) {
      if(currentDeviceId === device.deviceId) {
        return device;
      }
    }

    return undefined;
  }
}

export default WebcamRecorder;