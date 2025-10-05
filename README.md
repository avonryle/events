# @avonrylew/events

## Description

A high-performance, type-safe event emitter that prioritizes speed without sacrificing features. Designed for scenarios where millions of events per second matter, while maintaining full TypeScript support and a rich API including wildcard listeners, promise-based event waiting, and comprehensive listener management.

Outperforms eventemitter3 in single-listener scenarios (the most common use case) while staying competitive across all workloads.

## Installation
```bash
npm install @avonrylew/events
# or
bun add @avonrylew/events
# or
yarn add @avonrylew/events
```

## API Methods

```typescript
// Add listeners
emitter.on(event, handler)      // Regular listener
emitter.once(event, handler)    // One-time listener

// Remove listeners
emitter.off(event, handler)     // Remove specific
emitter.off(event)              // Remove all for event
emitter.off()                   // Remove all listeners
emitter.clear(event?)           // Alias for off()

// Emit events
emitter.emit(event, ...args)    // Returns boolean

// Wildcard listeners
emitter.onAny((event, ...args) => {})
emitter.offAny(handler)
emitter.offAny()                // Remove all wildcard listeners

// Utilities
emitter.count(event?)           // Count listeners (total or per event)
emitter.names()                 // Get all event names
emitter.listeners(event)        // Get listeners for event
emitter.max(n)                  // Set max listeners warning threshold

// Promise-based
await emitter.wait(event, timeout?)  // Wait for event with optional timeout
```

## Quick Start
```typescript
import { EventEmitter } from '@avonrylew/events';

interface Events {
  ready: () => void;
  data: (value: string) => void;
  error: (error: Error) => void;
}

const emitter = new EventEmitter<Events>();

// Register listeners
emitter.on('ready', () => console.log('Ready!'));
emitter.once('data', (value) => console.log(value));

// Emit events
emitter.emit('ready');
emitter.emit('data', 'Hello World');

// Remove listeners
emitter.off('ready', handler);
emitter.clear(); // Remove all listeners
```
*check [demos](https://github.com/avonryle/events/tree/main/demos) for more examples.*

## Features

| Feature                  | @avonrylew/events | tseep | tiny-typed-emitter | eventemitter3 |
|--------------------------|-------------------|-------|--------------------|---------------|
| on() / once() / off()    | ✅                | ✅    | ✅                 | ✅            |
| Wildcard onAny() / offAny() | ✅             | ❌    | ❌                 | ❌            |
| clear() (all / specific) | ✅                | ❌    | ✅                  | ✅            |
| count() listener count   | ✅                | ❌    | ⚠️ Partial         | ✅            |
| names() list event names | ✅                | ❌    | ❌                 | ✅            |
| wait() Promise-based listener | ✅           | ❌    | ❌                 | ❌            |
| max() limit max listeners | ✅               | ❌    | ❌                 | ❌            |
| TypeScript generic support | ✅ Strong       | ✅    | ✅                 | ⚠️ Partial    |
| Lightweight (unpacked size)    | ✅ 5.46 kB               | ✅ 105 kB    | ✅ 5.3 kB                  | ✅ 73.4 kB      | 

## Performance Benchmarks

| Test | @avonrylew/events | tseep | tiny-typed-emitter | eventemitter3 |
|------|-------------------|-------|--------------------|--------------| 
| emit (1 listener) | 117,883,903 ⚡ | 78,920,154 | 80,169,678 | 114,160,714 |
| emit (10 listeners) | 21,333,284 | 53,100,696 ⚡ | 13,600,686 | 19,974,968 |
| once + emit | 12,223,202 ⚡ | 3,395,743 | 4,182,692 | 11,880,773 |
| emit (multiple args) | 33,925,591 | 42,474,765 | 42,559,347 ⚡ | 29,681,331 |
| on + off | 28,377,211 ⚡ | 1,713,299 | 9,033,476 | 13,639,721 |
| add listener | 37,202,834 | 1,786,343 | 12,220,241 | 84,448,430 ⚡ |
| emit (no args) | 44,523,204 | 55,132,587 | 63,401,344 ⚡ | 35,761,228 |

*All values in ops/sec. ⚡ indicates fastest in category.* \n
*Benchmarks run on Bun runtime using [benchmark.ts](https://github.com/avonryle/events/blob/main/__tests__/benchmark.ts)*

## Memory Usage Comparison
The following table shows the memory consumption when creating 1000 instances with 10 listeners each (measured on Bun runtime with GC exposed):
| Library | Heap Δ (MB) | RSS Δ (MB) | Total Δ (MB) |
|---------|-------------|------------|--------------|
| @avonrylew/events | 0.03 | 6.45 | 6.49 |
| tseep | 0.08 | 8.39 | 8.54 |
| tiny-typed-emitter | 0.04 | 0.39 | 0.46 |
| eventemitter3 | 0.00 | 0.63 | 0.63 |


*Memory test run on Bun runtime using [memory.ts](https://github.com/avonryle/events/blob/main/__tests__/memory-test.ts).*
