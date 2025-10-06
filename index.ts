type EventMap = Record<string | symbol, (...args: any[]) => void>;
type EventKey<T extends EventMap> = keyof T;
type EventArgs<T extends EventMap, K extends EventKey<T>> = Parameters<T[K]>;

export class EventEmitter<T extends EventMap> {
  e: any = {};
  o: any = {};
  w: any[] = [];
  m = 10;

  on<K extends EventKey<T>>(k: K, f: T[K]): this {
    const l = this.e[k];
    if (!l) this.e[k] = f;
    else if (typeof l === 'function') this.e[k] = [l, f];
    else l[l.length] = f;
    return this;
  }

  once<K extends EventKey<T>>(k: K, f: T[K]): this {
    const l = this.o[k];
    if (!l) this.o[k] = f;
    else if (typeof l === 'function') this.o[k] = [l, f];
    else l[l.length] = f;
    return this;
  }

  off<K extends EventKey<T>>(k?: K, f?: T[K]): this {
    if (!k) {
      this.e = {};
      this.o = {};
      return this;
    }
    if (!f) {
      this.e[k] = this.o[k] = void 0;
      return this;
    }
    
    let l = this.e[k];
    if (l) {
      if (l === f) this.e[k] = void 0;
      else if (typeof l !== 'function') {
        const i = l.indexOf(f);
        if (i > -1) {
          l.splice(i, 1);
          if (l.length === 1) this.e[k] = l[0];
          else if (!l.length) this.e[k] = void 0;
        }
      }
    }
    
    l = this.o[k];
    if (l) {
      if (l === f) this.o[k] = void 0;
      else if (typeof l !== 'function') {
        const i = l.indexOf(f);
        if (i > -1) {
          l.splice(i, 1);
          if (l.length === 1) this.o[k] = l[0];
          else if (!l.length) this.o[k] = void 0;
        }
      }
    }
    
    return this;
  }

  emit<K extends EventKey<T>>(k: K, a?: any, b?: any, c?: any, d?: any, e?: any): boolean {
  const l = this.e[k];
  
  if (typeof l === 'function') {
    const al = arguments.length - 1;
    if (al === 0) { l(); return true; }
    if (al === 1) { l(a); return true; }
    if (al === 2) { l(a, b); return true; }
    if (al === 3) { l(a, b, c); return true; }
    if (al === 4) { l(a, b, c, d); return true; }
    if (al === 5) { l(a, b, c, d, e); return true; }
    const args1 = new Array(al);
    for (let i = 0; i < al; i++) args1[i] = arguments[i + 1];
    l.apply(void 0, args1);
    return true;
  }
  
  const ol = this.o[k];
  if (!l && !ol && !this.w.length) return false;
  
  const al = arguments.length - 1;
  let i, n;
  
  if (l) {
    n = l.length;
    switch (al) {
      case 0:
        for (i = 0; i < n; i++) l[i]();
        break;
      case 1:
        for (i = 0; i < n; i++) l[i](a);
        break;
      case 2:
        for (i = 0; i < n; i++) l[i](a, b);
        break;
      case 3:
        for (i = 0; i < n; i++) l[i](a, b, c);
        break;
      case 4:
        for (i = 0; i < n; i++) l[i](a, b, c, d);
        break;
      case 5:
        for (i = 0; i < n; i++) l[i](a, b, c, d, e);
        break;
      default:
        const args2 = new Array(al);
        for (let j = 0; j < al; j++) args2[j] = arguments[j + 1];
        for (i = 0; i < n; i++) l[i].apply(void 0, args2);
    }
  }
  
  if (ol) {
    if (typeof ol === 'function') {
      switch (al) {
        case 0: ol(); break;
        case 1: ol(a); break;
        case 2: ol(a, b); break;
        case 3: ol(a, b, c); break;
        case 4: ol(a, b, c, d); break;
        case 5: ol(a, b, c, d, e); break;
        default:
          const args3 = new Array(al);
          for (i = 0; i < al; i++) args3[i] = arguments[i + 1];
          ol.apply(void 0, args3);
      }
    } else {
      n = ol.length;
      switch (al) {
        case 0:
          for (i = 0; i < n; i++) ol[i]();
          break;
        case 1:
          for (i = 0; i < n; i++) ol[i](a);
          break;
        case 2:
          for (i = 0; i < n; i++) ol[i](a, b);
          break;
        case 3:
          for (i = 0; i < n; i++) ol[i](a, b, c);
          break;
        case 4:
          for (i = 0; i < n; i++) ol[i](a, b, c, d);
          break;
        case 5:
          for (i = 0; i < n; i++) ol[i](a, b, c, d, e);
          break;
        default:
          const args4 = new Array(al);
          for (let j = 0; j < al; j++) args4[j] = arguments[j + 1];
          for (i = 0; i < n; i++) ol[i].apply(void 0, args4);
      }
    }
    delete this.o[k];  // Changed from: this.o[k] = void 0;
  }
  
  const w = this.w;
  const wl = w.length;
  if (wl) {
    switch (al) {
      case 0:
        for (i = 0; i < wl; i++) w[i](k);
        break;
      case 1:
        for (i = 0; i < wl; i++) w[i](k, a);
        break;
      case 2:
        for (i = 0; i < wl; i++) w[i](k, a, b);
        break;
      case 3:
        for (i = 0; i < wl; i++) w[i](k, a, b, c);
        break;
      case 4:
        for (i = 0; i < wl; i++) w[i](k, a, b, c, d);
        break;
      case 5:
        for (i = 0; i < wl; i++) w[i](k, a, b, c, d, e);
        break;
      default:
        const args5 = new Array(al);
        for (let j = 0; j < al; j++) args5[j] = arguments[j + 1];
        for (i = 0; i < wl; i++) w[i].apply(void 0, [k].concat(args5));
    }
  }
  
  return true;
}

  offAny(f?: (e: EventKey<T>, ...a: any[]) => void): this {
    if (!f) {
      this.w.length = 0;
      return this;
    }
    const i = this.w.indexOf(f);
    i > -1 && this.w.splice(i, 1);
    return this;
  }

  clear<K extends EventKey<T>>(k?: K): this {
    if (k) {
      this.e[k] = this.o[k] = void 0;
    } else {
      this.e = {};
      this.o = {};
      this.w.length = 0;
    }
    return this;
  }

  count<K extends EventKey<T>>(k?: K): number {
    if (!k) {
      let t = this.w.length;
      for (const key in this.e) {
        const v = this.e[key];
        if (v) t += typeof v === 'function' ? 1 : v.length;
      }
      for (const key in this.o) {
        const v = this.o[key];
        if (v) t += typeof v === 'function' ? 1 : v.length;
      }
      return t;
    }
    const el = this.e[k], ol = this.o[k];
    return (el ? (typeof el === 'function' ? 1 : el.length) : 0) + 
           (ol ? (typeof ol === 'function' ? 1 : ol.length) : 0);
  }

  names(): EventKey<T>[] {
    const s = new Set<EventKey<T>>();
    for (const k in this.e) if (this.e[k]) s.add(k as EventKey<T>);
    for (const k in this.o) if (this.o[k]) s.add(k as EventKey<T>);
    return [...s];
  }

  listeners<K extends EventKey<T>>(k: K): T[K][] {
    const el = this.e[k], ol = this.o[k], r: T[K][] = [];
    if (el) {
      if (typeof el === 'function') r[0] = el;
      else for (let i = 0; i < el.length; i++) r[r.length] = el[i];
    }
    if (ol) {
      if (typeof ol === 'function') r[r.length] = ol;
      else for (let i = 0; i < ol.length; i++) r[r.length] = ol[i];
    }
    return r;
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

