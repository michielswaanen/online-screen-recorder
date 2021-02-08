import mimeTypes from "./MimeTypes";
import MimeTypeGenerator from "./MimeTypeGenerator";

abstract class Recorder {

  private stream: MediaStream | null;
  private permission: "granted" | "denied" | "unasked";
  private recorder: MediaRecorder | null;

  // private recording: MediaSource | null;

  private onPermissionChangeCallback: (status: "granted" | "denied") => void;
  private onStreamAvailableCallback: (stream: MediaStream) => void;
  private onRecordingAvailableCallback: (recording: Blob) => void;
  private onStartCallback: (stream: MediaStream) => void;
  private onStopCallback: () => void;

  public constructor() {
    this.stream = null;
    this.permission = "unasked";
    this.recorder = null;
    // this.recording = null;
    this.onPermissionChangeCallback = () => {};
    this.onStreamAvailableCallback = (stream: MediaStream) => {};
    this.onRecordingAvailableCallback = (recording: Blob) => {};
    this.onStartCallback = (stream: MediaStream) => {};
    this.onStopCallback = () => {};
  }

  // Functions
  public abstract start(): void;
  public abstract stop(): void;
  public abstract askPermission(): void;
  public abstract switchDevice(deviceId: MediaDeviceInfo["deviceId"]): void;
  public abstract getDeviceOptions(): Promise<MediaDeviceInfo[]>;

  // Events
  public onPermissionChange(cb: (status: "granted" | "denied") => void) {
    this.onPermissionChangeCallback = cb;
  }

  public onStreamAvailable(cb: (stream: MediaStream) => void) {
    this.onStreamAvailableCallback = cb;
  }

  public onRecordingAvailable(cb: (recording: Blob) => void) {
    this.onRecordingAvailableCallback = cb
  }

  public onStart(cb: (stream: MediaStream) => void) {
    this.onStartCallback = cb;
  }

  public onStop(cb: () => void) {
    this.onStopCallback = cb;
  }

  // Setters
  protected setMediaStream(stream: MediaStream) {
    this.stream = stream;
    this.onStreamAvailableCallback(stream);
  }

  protected setMediaRecorder(recorder: MediaRecorder) {
    this.recorder = recorder;

    recorder.onstart = this.onStartCallback.bind(this, recorder.stream);
    recorder.onstop = this.onStopCallback;
    recorder.ondataavailable = (event: BlobEvent) => {
      this.onRecordingAvailableCallback(event.data);
    };
  }

  protected setPermission(status: "granted" | "denied") {
    this.permission = status;
    this.onPermissionChangeCallback(status);
  }

  // protected addRecording(recording: Blob) {
  //   if(!this.recording) {
  //     throw new Error('Recording buffer not initialized!');
  //   } else {
  //     this.recording.addSourceBuffer(URL.createObjectURL(recording));
  //   }
  // }

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

  protected getMediaStream(): MediaStream {
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