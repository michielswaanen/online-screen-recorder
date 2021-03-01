

class MediaDeviceEventHandler {

  private map: Map<string, Array<(...args: any[]) => void>>


  constructor() {
    this.map = new Map();
  }

  public register(event: string, callback: (...args: any[]) => void) {
    let callbacks = this.map.get(event) || new Array<() => void>();
    callbacks.push(callback);
    this.map.set(event, callbacks);
    console.log(this.map);
  }

  public unregister(event: string, callback: (...args: any[]) => void) {
    let callbacks = this.map.get(event) || new Array<() => void>();
    callbacks = callbacks.filter(item => item !== callback);
    this.map.set(event, callbacks);
  }

  public emit(event: string, ...data: any[]) {
    let callbacks = this.map.get(event) || new Array<(...args: any[])  => void>();
    for (let cb of callbacks) {
      cb(...data);
    }
  }

}

export default MediaDeviceEventHandler;