

class MediaDeviceEventHandler {

  private map: Map<(...args: any[]) => void, Array<(...args: any[]) => void>>

  constructor() {
    this.map = new Map();
  }

  public register(event: (...args: any[]) => void, callback: (...args: any[]) => void) {
    let callbacks = this.map.get(event) || new Array<() => void>();
    callbacks.push(callback);
    this.map.set(event, callbacks);
  }

  public unregister(event: (...args: any[]) => void, callback: (...args: any[]) => void) {
    let callbacks = this.map.get(event) || new Array<() => void>();
    const newCallbacks = callbacks.filter(item => item !== callback);
    this.map.set(event, newCallbacks);
  }

  public emit(event: (...args: any[]) => void, ...data: any[]) {
    let callbacks = this.map.get(event) || new Array<(...args: any[])  => void>();
    for (let cb of callbacks) {
      cb(...data);
    }
  }
}

export default MediaDeviceEventHandler;