import Recorder from "./Recorder";

class MicrophoneRecorder extends Recorder {

  public start(): void {
    const permission: string = this.getPermission();

    if (permission === "denied") {
      console.log("Permission denied for microphone")
    } else if (permission === "unasked") {
      console.log("No microphone permission yet")
    } else {
      if (this.isRecording()) {
        console.log("Already recording microphone...")
      } else {
        const mimeType: string = this.getMimeType({ video: false, audio: true }).audio;

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
      console.log("Not recording microphone...")
    } else {
      this.stopAllTracks();
      this.getMediaRecorder().stop();
    }
  }

  public async askPermission(): Promise<void> {
    try {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      await this.setPermission("granted");
      this.setMediaStream(stream);
    } catch (e) {
      await this.setPermission("denied");
    }
  }

  public async getDeviceOptions(): Promise<{ video: MediaDeviceInfo[], audio: MediaDeviceInfo[] }> {
    const audioDevices: MediaDeviceInfo[] = []

    const devices: MediaDeviceInfo[] = await navigator.mediaDevices.enumerateDevices();

    for (let device of devices) {
      if (device.kind == "audioinput") {
        audioDevices.push(device);
      }
    }

    return { video: [], audio: audioDevices };
  }

  public async switchDevice(deviceId: MediaDeviceInfo["deviceId"]): Promise<void> {
    try {
      this.stopAllTracks();

      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: { exact: deviceId },
        }
      });
      console.log("New Audio Stream", stream);
      this.setMediaStream(stream);
    } catch (e) {
      console.log(e)
      throw new Error("Couldn't fetch selected microphone device!");
    }
  }
}

export default MicrophoneRecorder;