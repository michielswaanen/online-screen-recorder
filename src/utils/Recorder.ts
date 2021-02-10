import mimeTypes from "./MimeTypes";
import MimeTypeGenerator from "./MimeTypeGenerator";

abstract class Recorder {

  private stream: MediaStreamTrack | null;
  private permission: "granted" | "denied" | "unasked";
  private recorder: MediaRecorder | null;

  private onPermissionChangeCallback: (status: "granted" | "denied") => Promise<void>;
  private onStreamAvailableCallback: (stream: MediaStreamTrack) => void;
  private onRecordingAvailableCallback: (recording: Blob) => void;
  private onStartCallback: (stream: MediaStreamTrack) => void;
  private onStopCallback: () => void;

  public constructor() {
    this.stream = null;
    this.permission = "unasked";
    this.recorder = null;
    this.onPermissionChangeCallback = async () => {};
    this.onStreamAvailableCallback = (stream: MediaStreamTrack) => {};
    this.onRecordingAvailableCallback = (recording: Blob) => {};
    this.onStartCallback = (stream: MediaStreamTrack) => {};
    this.onStopCallback = () => {};
  }

  // Functions
  public abstract start(): void;
  public abstract stop(): void;
  public abstract askPermission(): void;
  public abstract switchDevice(deviceId: MediaDeviceInfo["deviceId"]): Promise<void>;
  public abstract getDeviceOptions(): Promise<MediaDeviceInfo[]>;
  public abstract getCurrentDevice(devices: MediaDeviceInfo[]): MediaDeviceInfo | undefined;

  // Events
  public onPermissionChange(cb: (status: "granted" | "denied") => Promise<void>) {
    this.onPermissionChangeCallback = cb;
  }

  public onStreamTrackAvailable(cb: (track: MediaStreamTrack) => void) {
    this.onStreamAvailableCallback = cb;
  }

  public onRecordingAvailable(cb: (recording: Blob) => void) {
    this.onRecordingAvailableCallback = cb
  }

  public onStart(cb: (stream: MediaStreamTrack) => void) {
    this.onStartCallback = cb;
  }

  public onStop(cb: () => void) {
    this.onStopCallback = cb;
  }

  // Setters
  protected setMediaStreamTrack(stream: MediaStreamTrack) {
    this.stream = stream;
    this.onStreamAvailableCallback(stream);
  }

  protected setMediaRecorder(recorder: MediaRecorder) {
    this.recorder = recorder;
    const track: MediaStreamTrack = recorder.stream.getTracks()[0];

    recorder.onstart = this.onStartCallback.bind(this, track);
    recorder.onstop = this.onStopCallback;
    recorder.ondataavailable = (event: BlobEvent) => {
      console.log(event.data)
      this.onRecordingAvailableCallback(event.data);
    };
  }

  protected async setPermission(status: "granted" | "denied"): Promise<void> {
    this.permission = status;
    await this.onPermissionChangeCallback(status);
  }

  // Getters
  protected isRecording(): boolean {
    return this.recorder !== null && this.recorder.state !== "inactive";
  }

  protected getPermission(): "granted" | "denied" | "unasked" {
    return this.permission;
  }

  protected getMediaRecorder(): MediaRecorder {
    if(!this.recorder)
      throw new Error("Recorder is not initialized");

    return this.recorder
  }

  public getMediaStreamTrack(): MediaStreamTrack {
    if(!this.stream)
      throw new Error("Stream is not initialized");

    return this.stream
  }

  protected getMimeType(query: {audio: boolean, video: boolean}): {audio: string, video: string} {
    const result = {audio: "", video: ""};
    const generator = new MimeTypeGenerator();


    if (query.video) {
      const types: string[] = mimeTypes.video.types;
      const codecs: string[] = mimeTypes.video.types;

      result.video = generator.findOptimalMimeType(types, codecs);
    }

    if (query.audio) {
      const types: string[] = mimeTypes.audio.types;
      const codecs: string[] = mimeTypes.audio.types;

      result.audio = generator.findOptimalMimeType(types, codecs);
    }

    return result;
  }

}

export default Recorder;