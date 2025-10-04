# 📦 @avonrylew/events

A lightweight, TypeScript-first, and high-performance event emitter for modern JavaScript runtimes — built for simplicity, speed, and feature completeness.

```typescript
import { EventEmitter } from "@avonrylew/events";

type Events = {
  ready: () => void;
  data: (value: string) => void;
};

const emitter = new EventEmitter<Events>();

emitter.on("ready", () => console.log("Ready!"));
emitter.emit("ready");
```

## 🚀 Features

| Feature                  | CustomEmitter | tseep | tiny-typed-emitter | eventemitter3 |
|--------------------------|---------------|-------|--------------------|---------------|
| on() / once() / off()    | ✅            | ✅    | ✅                 | ✅            |
| Wildcard onAny() / offAny() | ✅         | ❌    | ❌                 | ❌            |
| clear() (all / specific) | ✅            | ❌    | ❌                 | ✅            |
| count() listener count   | ✅            | ❌    | ✅                 | ✅            |
| names() list event names | ✅            | ❌    | ❌                 | ❌            |
| wait() Promise-based listener | ✅       | ❌    | ❌                 | ❌            |
| max() limit max listeners | ✅           | ❌    | ❌                 | ❌            |
| TypeScript generic support | ✅ Strong  | ✅    | ✅                 | ⚠️ Partial    |
| Lightweight (no deps)    | ✅            | ✅    | ✅                 | ✅            |

## ⚙️ Installation

```bash
npm install @avonrylew/events
# or
bun add @avonrylew/events
# or
pnpm add @avonrylew/events
# or
yarn add @avonrylew/events
```

## 🧩 API Overview

```typescript
const emitter = new EventEmitter<MyEvents>();

// Register listeners
emitter.on("event", handler);
emitter.once("event", handler);

// Emit events
emitter.emit("event", ...args);

// Remove listeners
emitter.off("event", handler);
emitter.clear();          // Remove all
emitter.clear("event");   // Remove specific

// Utility
emitter.onAny((name, ...args) => console.log(name, args));
emitter.offAny(fn);
emitter.count("event");   // Listener count
emitter.names();          // All event names
await emitter.wait("ready", 1000); // Promise-based wait with timeout
emitter.max(20);          // Set max listeners
```

## 🧾 Design Goals

- ⚡ **Performance-focused**: optimized listener maps & low overhead dispatch
- 🧠 **Type-safe**: full generic event typing with inferred parameters
- 🧩 **Feature-complete**: includes promises, wildcards, and listener management
- 💡 **Lightweight**: zero dependencies and <2KB minified
