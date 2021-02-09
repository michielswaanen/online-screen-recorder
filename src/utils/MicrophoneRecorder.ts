import Recorder from "./Recorder";

class MicrophoneRecorder extends Recorder {

  start(): void {
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
        const mimeType: string = this.getMimeType({ video: false, audio: true }).audio;

        const recorder: MediaRecorder = new MediaRecorder(stream, {
          audioBitsPerSecond: 2500000,
          mimeType: mimeType
        });

        this.setMediaRecorder(recorder);
        recorder.start();
      }
    }
  }

  stop(): void {
    if (!this.isRecording()) {
      console.log("Not recording...")
    } else {
      this.getMediaStream().getTracks()[0].stop();
      this.getMediaRecorder().stop();
    }
  }

  askPermission(): Promise<void> {
    const stream: Promise<MediaStream> = navigator.mediaDevices.getUserMedia({ audio: true });

    return stream.then((stream: MediaStream) => {
      this.setPermission("granted");
      this.setMediaStream(stream);
    }).catch(() => {
      this.setPermission("denied");
    });
  }

  getCurrentDevice(devices: MediaDeviceInfo[]): MediaDeviceInfo | undefined {
    const track: MediaStreamTrack = this.getMediaStream().getTracks()[0];
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

  async getDeviceOptions(): Promise<MediaDeviceInfo[]> {
    const options: MediaDeviceInfo[] = []

    const devices: MediaDeviceInfo[] = await navigator.mediaDevices.enumerateDevices();

    for (let device of devices) {
      if (device.kind == "audioinput") {
        options.push(device);
      }
    }

    return options;
  }

  switchDevice(deviceId: MediaDeviceInfo["deviceId"]): void {
    const stream = navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: { exact: deviceId },
      }
    });

    stream.then((stream: MediaStream) => {
      console.log("New Audio Stream", stream);
      this.setMediaStream(stream);
    });
  }
}

export default MicrophoneRecorder;