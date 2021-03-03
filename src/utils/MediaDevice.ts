import MediaDeviceEventHandler from "./MediaDeviceEventHandler";

enum MediaDeviceType {
  SCREEN,
  WEBCAM,
  MICROPHONE
}

abstract class MediaDevice {

  private stream: MediaStream | null;
  private permission: "granted" | "denied" | "unasked";

  private eventHandler: MediaDeviceEventHandler;

  public constructor() {
    this.stream = null;
    this.permission = "unasked";
    this.eventHandler = new MediaDeviceEventHandler();
  }

  // Functions
  public abstract select(deviceId: string | undefined): void;

  public abstract options(): Promise<MediaDeviceInfo[]>;

  // Events
  public onPermissionEvent(cb: (status: "granted" | "denied") => Promise<void>) {
    this.eventHandler.register(this.onPermissionEvent, cb);
  }

  public onAvailableEvent(cb: (stream: MediaStream) => void) {
    this.eventHandler.register(this.onAvailableEvent, cb);
  }

  public onUnavailableEvent(cb: () => void) {
    this.eventHandler.register(this.onUnavailableEvent, cb);
  }

  public unregisterEvent(event: (...args: any[]) => void, cb: (...args: any[]) => void) {
    this.eventHandler.unregister(event, cb);
  }

  // Setters
  protected async prompt(constraints: MediaStreamConstraints, type: MediaDeviceType): Promise<MediaStream> {
    this.resetTracks();

    switch (type) {
      case MediaDeviceType.SCREEN:
        //@ts-ignore
        return await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true});
      case MediaDeviceType.WEBCAM:
      case MediaDeviceType.MICROPHONE:
        return await navigator.mediaDevices.getUserMedia(constraints);
    }
  }

  protected setMediaStream(stream: MediaStream) {
    this.stream = stream;

    this.eventHandler.emit(this.onAvailableEvent, stream)
  }

  protected async setPermission(status: "granted" | "denied"): Promise<void> {
    this.permission = status;

    this.eventHandler.emit(this.onPermissionEvent, status);
  }

  /**
   * Multiple microphone access not allowed
   */
  protected resetTracks() {
    if (this.stream) {
      this.stream.getTracks().map(track => {
        track.stop();
      });

      this.eventHandler.emit(this.onUnavailableEvent);
    }
  }

  // Getters
  public getPermission(): "granted" | "denied" | "unasked" {
    return this.permission;
  }

  public hasStream(): boolean {
    return !!this.stream;
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
export { MediaDeviceType };