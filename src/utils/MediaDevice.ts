abstract class MediaDevice {

  private stream: MediaStream | null;
  private permission: "granted" | "denied" | "unasked";

  private onPermissionChangeCallback: { (status: "granted" | "denied"): Promise<void> }[];
  private onAvailableCallback: { (stream: MediaStream): void }[];
  private onUnavailableCallback: { (): void }[];

  public constructor() {
    this.stream = null;
    this.permission = "unasked";
    this.onPermissionChangeCallback = [];
    this.onAvailableCallback = [];
    this.onUnavailableCallback = [];
  }

  // Functions
  public abstract select(deviceId: string | undefined): void;

  public abstract options(): Promise<MediaDeviceInfo[]>;

  // Events
  public onPermissionChange(cb: (status: "granted" | "denied") => Promise<void>) {
    this.onPermissionChangeCallback.push(cb);
  }

  public onAvailable(cb: (stream: MediaStream) => void) {
    this.onAvailableCallback.push(cb);
  }

  public onUnavailable(cb: () => void) {
    this.onUnavailableCallback.push(cb);
  }

  // Setters
  protected async prompt(constraints: MediaStreamConstraints): Promise<MediaStream> {
    this.resetTracks();
    return await navigator.mediaDevices.getUserMedia(constraints);
  }

  protected setMediaStream(stream: MediaStream) {
    this.stream = stream;

    for (let callback of this.onAvailableCallback) {
      callback(stream);
    }
  }

  protected async setPermission(status: "granted" | "denied"): Promise<void> {
    this.permission = status;

    for (let callback of this.onPermissionChangeCallback) {
      await callback(status);
    }
  }

  /**
   * Multiple microphone access not allowed
   */
  protected resetTracks() {
    if (this.stream) {
      this.stream.getTracks().map(track => {
        track.stop();
      });

      for (let callback of this.onUnavailableCallback) {
        callback();
      }
    }
  }

  // Getters
  public getPermission(): "granted" | "denied" | "unasked" {
    return this.permission;
  }

  public getMediaStream(): MediaStream {
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