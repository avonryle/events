type EventMap = Record<string | symbol, (...args: any[]) => void>;
type EventKey<T extends EventMap> = keyof T;
type EventArgs<T extends EventMap, K extends EventKey<T>> = Parameters<T[K]>;

export class EventEmitter<T extends EventMap> {
  private e: any = {};
  private o: any = {};
  private w: any[] = [];
  m = 10;

  on<K extends EventKey<T>>(k: K, f: T[K]): this {
    (this.e[k] || (this.e[k] = [])).push(f);
    if (this.e[k].length > this.m) console.warn(`MaxListeners: ${String(k)}`);
    return this;
  }

  once<K extends EventKey<T>>(k: K, f: T[K]): this {
    (this.o[k] || (this.o[k] = [])).push(f);
    return this;
  }

  off<K extends EventKey<T>>(k: K, f: T[K]): this {
    const l = this.e[k];
    if (l) {
      const i = l.indexOf(f);
      i > -1 && l.splice(i, 1);
    }
    return this;
  }

  emit<K extends EventKey<T>>(k: K, ...a: EventArgs<T, K>): boolean {
    const l = this.e[k];
    const ol = this.o[k];
    let h = false;
    
    if (l) {
      h = true;
      for (let i = 0, n = l.length; i < n; i++) l[i](...a);
    }
    
    if (ol) {
      h = true;
      for (let i = 0, n = ol.length; i < n; i++) ol[i](...a);
      this.o[k] = 0;
    }
    
    const w = this.w;
    const wl = w.length;
    if (wl) {
      h = true;
      for (let i = 0; i < wl; i++) w[i](k, ...a);
    }
    
    return h;
  }

  onAny(f: (e: EventKey<T>, ...a: any[]) => void): this {
    this.w.push(f);
    return this;
  }

  offAny(f: (e: EventKey<T>, ...a: any[]) => void): this {
    const i = this.w.indexOf(f);
    i > -1 && this.w.splice(i, 1);
    return this;
  }

  clear<K extends EventKey<T>>(k?: K): this {
    k ? (this.e[k] = this.o[k] = 0) : (this.e = {}, this.o = {}, this.w = []);
    return this;
  }

  count<K extends EventKey<T>>(k: K): number {
    return (this.e[k]?.length || 0) + (this.o[k]?.length || 0);
  }

  names(): EventKey<T>[] {
    return [...new Set([...Object.keys(this.e), ...Object.keys(this.o)])];
  }

  wait<K extends EventKey<T>>(k: K, t?: number): Promise<EventArgs<T, K>> {
    return new Promise((res, rej) => {
      let timer: any;
      const h = (...a: EventArgs<T, K>) => {
        timer && clearTimeout(timer);
        res(a);
      };
      this.once(k, h as T[K]);
      t && (timer = setTimeout(() => {
        this.off(k, h as T[K]);
        rej(new Error(`Timeout: ${String(k)}`));
      }, t));
    });
  }

  max(n: number): this {
    this.m = n;
    return this;
  }
}

export default EventEmitter;
