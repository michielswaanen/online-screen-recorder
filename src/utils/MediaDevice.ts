abstract class MediaDevice {

  private stream: MediaStream | null;
  private permission: "granted" | "denied" | "unasked";

  private onPermissionChangeCallback: (status: "granted" | "denied") => Promise<void>;
  private onAvailableCallback: {(stream: MediaStream): void}[];
  private onUnavailableCallback: () => void;
  private onCloseCallback: () => void;

  public constructor() {
    this.stream = null;
    this.permission = "unasked";
    this.onPermissionChangeCallback = async () => {};
    this.onAvailableCallback = [];
    this.onUnavailableCallback = () => {};
    this.onCloseCallback = () => {};
  }

  // Functions
  // public abstract preview(): void;

  // public abstract close(): void;

  public abstract select(deviceId: string | undefined): void;

  public abstract options(): Promise<MediaDeviceInfo[]>;

  // Events
  public onPermissionChange(cb: (status: "granted" | "denied") => Promise<void>) {
    this.onPermissionChangeCallback = cb;
  }

  public onAvailable(cb: (stream: MediaStream) => void) {
    this.onAvailableCallback.push(cb);
  }

  public onClose(cb: () => void) {
    this.onCloseCallback = cb;
  }

  public onUnavailable(cb: () => void) {
    this.onUnavailableCallback = cb;
  }

  // Util
  private static emitEvent(callbacks: {(stream: MediaStream): void}[], stream: MediaStream) {
    console.log("REGISTERED CALLBACKS", callbacks);
    for (let callback of callbacks) {
      callback(stream);
    }
  }

  // Setters
  protected async prompt(constraints: MediaStreamConstraints): Promise<MediaStream> {
    this.resetTracks();
    return await navigator.mediaDevices.getUserMedia(constraints);
  }

  protected setMediaStream(stream: MediaStream) {
    this.stream = stream;
    console.log("SET", stream)
    MediaDevice.emitEvent(this.onAvailableCallback, stream);
    console.log("CALLED")
  }

  protected async setPermission(status: "granted" | "denied"): Promise<void> {
    this.permission = status;
    await this.onPermissionChangeCallback(status);
  }

  /**
   * Multiple microphone access not allowed
   */
  protected resetTracks() {
    if(this.stream) {
      this.stream.getTracks().map(track => {
        track.stop();
      });
      this.onUnavailableCallback();
    }
  }

  // Getters
  public getPermission(): "granted" | "denied" | "unasked" {
    return this.permission;
  }

  public getMediaStream(): MediaStream {
    console.log(this.stream)
    if (!this.stream)
      throw new Error("Stream is not initialized");

    return this.stream
  }

  public getTrack(): MediaStreamTrack {
    return this.getMediaStream().getTracks()[0];
  }

  public getSelected(): string | undefined {
    return this.getMediaStream().getTracks()[0].getSettings().deviceId;
  }
}

export default MediaDevice;