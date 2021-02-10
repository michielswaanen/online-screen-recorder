import mimeTypes from "./mimetype/MimeTypes";
import MimeTypeGenerator from "./mimetype/MimeTypeGenerator";

abstract class Recorder {

  private stream: MediaStream | null;
  private permission: "granted" | "denied" | "unasked";
  private recorder: MediaRecorder | null;

  private onPermissionChangeCallback: (status: "granted" | "denied") => Promise<void>;
  private onStreamAvailableCallback: (stream: MediaStream) => void;
  private onRecordingAvailableCallback: (recording: Blob) => void;
  private onStartCallback: (stream: MediaStream) => void;
  private onStopCallback: () => void;

  public constructor() {
    this.stream = null;
    this.permission = "unasked";
    this.recorder = null;
    this.onPermissionChangeCallback = async () => {};
    this.onStreamAvailableCallback = (stream: MediaStream) => {};
    this.onRecordingAvailableCallback = (recording: Blob) => {};
    this.onStartCallback = (stream: MediaStream) => {};
    this.onStopCallback = () => {};
  }

  // Functions
  public abstract start(): void;

  public abstract stop(): void;

  public abstract askPermission(): void;

  public abstract switchDevice(audioDeviceId: MediaDeviceInfo["deviceId"], videoDeviceId: MediaDeviceInfo["deviceId"]): Promise<void>;

  public abstract getDeviceOptions(): Promise<{video: MediaDeviceInfo[], audio: MediaDeviceInfo[]}>;

  // Events
  public onPermissionChange(cb: (status: "granted" | "denied") => Promise<void>) {
    this.onPermissionChangeCallback = cb;
  }

  public onStreamTrackAvailable(cb: (stream: MediaStream) => void) {
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
      console.log(event.data)
      this.onRecordingAvailableCallback(event.data);
    };
  }

  protected async setPermission(status: "granted" | "denied"): Promise<void> {
    this.permission = status;
    await this.onPermissionChangeCallback(status);
  }

  protected stopAllTracks() {
    const audioTrack: MediaStreamTrack = this.getMediaStreamTracks().audio;
    const videoTrack: MediaStreamTrack = this.getMediaStreamTracks().video;

    if (audioTrack !== undefined)
      audioTrack.stop();

    if (videoTrack !== undefined)
      videoTrack.stop();
  }

  // Getters
  protected isRecording(): boolean {
    return this.recorder !== null && this.recorder.state !== "inactive";
  }

  protected getPermission(): "granted" | "denied" | "unasked" {
    return this.permission;
  }

  protected getMediaRecorder(): MediaRecorder {
    if (!this.recorder)
      throw new Error("Recorder is not initialized");

    return this.recorder
  }

  public getMediaStream(): MediaStream {
    if (!this.stream)
      throw new Error("Stream is not initialized");

    return this.stream
  }

  public getMediaStreamTracks(): { video: MediaStreamTrack, audio: MediaStreamTrack } {
    if (!this.stream)
      throw new Error("Track are not initialized");

    return { audio: this.stream.getAudioTracks()[0], video: this.stream.getVideoTracks()[0] };
  }

  protected getMimeType(query: { audio: boolean, video: boolean }): { audio: string, video: string } {
    const result = { audio: "", video: "" };
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

  public getCurrentDevice(devices: MediaDeviceInfo[]): { video: MediaDeviceInfo | undefined, audio: MediaDeviceInfo | undefined } {
    const videoTrack: MediaStreamTrack = this.getMediaStream().getVideoTracks()[0];
    const currentVideoDeviceId: string | undefined = videoTrack.getSettings().deviceId;

    const audioTrack: MediaStreamTrack = this.getMediaStream().getAudioTracks()[0];
    const currentAudioDeviceId: string | undefined = audioTrack.getSettings().deviceId;

    let videoDevice = undefined;
    let audioDevice = undefined;

    for (let device of devices) {
      if (currentVideoDeviceId === device.deviceId) {
        videoDevice = device;
      } else if (currentAudioDeviceId === device.deviceId) {
        audioDevice = device;
      }
    }

    return { video: videoDevice, audio: audioDevice };
  }

}

export default Recorder;