// vibe coded memory tester
// requires installation of tseep, tte and ee3

import { EventEmitter as CustomEmitter } from '../index';
import { EventEmitter as TseepEmitter } from 'tseep';
import { TypedEmitter } from 'tiny-typed-emitter';
import EventEmitter3 from 'eventemitter3';

// --------------------
// 🧩 Environment Helpers
// --------------------
const gc =
  (typeof globalThis.gc === 'function'
    ? globalThis.gc
    : typeof Bun !== 'undefined' && typeof Bun.gc === 'function'
    ? Bun.gc
    : undefined);

async function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

function getMemoryUsage() {
  // Node.js
  if (typeof process !== 'undefined' && process.memoryUsage) {
    return process.memoryUsage();
  }

  // Bun
  if (typeof Bun !== 'undefined') {
    // @ts-ignore Bun supports performance.memory (not typed yet)
    const mem = performance?.memory;
    if (mem) {
      return {
        rss: mem.totalJSHeapSize,
        heapTotal: mem.jsHeapSizeLimit,
        heapUsed: mem.usedJSHeapSize,
        external: 0,
      };
    }
  }

  throw new Error('No compatible memory usage API found.');
}

function formatBytes(bytes: number): string {
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

function clamp(n: number): number {
  return n < 0 ? 0 : n;
}

// --------------------
// 🧠 Benchmark Function
// --------------------
async function measureMemory(
  name: string,
  fn: () => void | Promise<void>
): Promise<{ name: string; heapUsed: number; rss: number; external: number; total: number }> {
  gc?.();
  await sleep(50);
  gc?.();

  const before = getMemoryUsage();

  await fn();

  // Let runtime settle allocations
  await sleep(100);

  gc?.();
  await sleep(50);

  const after = getMemoryUsage();

  const heapUsed = clamp((after.heapUsed ?? 0) - (before.heapUsed ?? 0));
  const rss = clamp((after.rss ?? 0) - (before.rss ?? 0));
  const external = clamp((after.external ?? 0) - (before.external ?? 0));
  const total = heapUsed + rss + external;

  console.log(`${name}:`);
  console.log(`  Heap Used Δ:   ${formatBytes(heapUsed)}`);
  console.log(`  RSS Δ:         ${formatBytes(rss)}`);
  console.log(`  External Δ:    ${formatBytes(external)}`);
  console.log(`  Total Δ:       ${formatBytes(total)}\n`);

  return { name, heapUsed, rss, external, total };
}

// --------------------
// 🚀 Benchmark Runner
// --------------------
(async () => {
  console.log('='.repeat(80));
  console.log('MEMORY USAGE COMPARISON');
  console.log('='.repeat(80));
  console.log();

  const INSTANCES = 1000;
  const LISTENERS_PER_INSTANCE = 10;

  console.log(`Creating ${INSTANCES} instances with ${LISTENERS_PER_INSTANCE} listeners each\n`);

  const results = [];

  results.push(
    await measureMemory('CustomEmitter', () => {
      const emitters: CustomEmitter<any>[] = [];
      for (let i = 0; i < INSTANCES; i++) {
        const ee = new CustomEmitter<any>();
        for (let j = 0; j < LISTENERS_PER_INSTANCE; j++) {
          ee.on('test', () => {});
          ee.on('data', () => {});
        }
        emitters.push(ee);
      }
    })
  );

  results.push(
    await measureMemory('tseep', () => {
      const emitters: TseepEmitter[] = [];
      for (let i = 0; i < INSTANCES; i++) {
        const ee = new TseepEmitter();
        for (let j = 0; j < LISTENERS_PER_INSTANCE; j++) {
          ee.on('test', () => {});
          ee.on('data', () => {});
        }
        emitters.push(ee);
      }
    })
  );

  results.push(
    await measureMemory('tiny-typed-emitter', () => {
      const emitters: TypedEmitter[] = [];
      for (let i = 0; i < INSTANCES; i++) {
        const ee = new TypedEmitter();
        for (let j = 0; j < LISTENERS_PER_INSTANCE; j++) {
          ee.on('test', () => {});
          ee.on('data', () => {});
        }
        emitters.push(ee);
      }
    })
  );

  results.push(
    await measureMemory('eventemitter3', () => {
      const emitters: EventEmitter3[] = [];
      for (let i = 0; i < INSTANCES; i++) {
        const ee = new EventEmitter3();
        for (let j = 0; j < LISTENERS_PER_INSTANCE; j++) {
          ee.on('test', () => {});
          ee.on('data', () => {});
        }
        emitters.push(ee);
      }
    })
  );

  // --------------------
  // 🧾 Summary Table
  // --------------------
  console.log('='.repeat(80));
  console.log('\n📊 Summary Table:\n');

  const table = results.map((r) => ({
    Library: r.name,
    'Heap Δ (MB)': formatBytes(r.heapUsed),
    'RSS Δ (MB)': formatBytes(r.rss),
    'External Δ (MB)': formatBytes(r.external),
    'Total Δ (MB)': formatBytes(r.total),
  }));

  console.table(table);

  console.log('='.repeat(80));
  console.log('\nNote: Run with GC exposed for accurate measurements');
  console.log('Example (Node): node --expose-gc dist/memory-benchmark.js');
  console.log('Example (Bun):  bun run --optimize dist/memory-benchmark.ts');
  console.log('='.repeat(80));
})();
