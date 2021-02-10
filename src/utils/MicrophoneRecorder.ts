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
        const track: MediaStreamTrack = this.getMediaStreamTrack();
        const mimeType: string = this.getMimeType({ video: false, audio: true }).audio;

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
      console.log("Not recording microphone...")
    } else {
      this.getMediaStreamTrack().stop();
      this.getMediaRecorder().stop();
    }
  }

  public async askPermission(): Promise<void> {
    try {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const track = stream.getAudioTracks()[0];

      await this.setPermission("granted");
      this.setMediaStreamTrack(track);
    } catch (e) {
      await this.setPermission("denied");
    }
  }

  public async getDeviceOptions(): Promise<MediaDeviceInfo[]> {
    const options: MediaDeviceInfo[] = []

    const devices: MediaDeviceInfo[] = await navigator.mediaDevices.enumerateDevices();

    for (let device of devices) {
      if (device.kind == "audioinput") {
        options.push(device);
      }
    }

    return options;
  }

  public async switchDevice(deviceId: MediaDeviceInfo["deviceId"]): Promise<void> {
    try {
      this.getMediaStreamTrack().stop();

      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: { exact: deviceId },
        }
      });
      const track: MediaStreamTrack = stream.getAudioTracks()[0];
      console.log("New Audio Stream", stream);
      this.setMediaStreamTrack(track);
    } catch (e) {
      console.log(e)
      throw new Error("Couldn't fetch selected microphone device!");
    }
  }
}

export default MicrophoneRecorder;