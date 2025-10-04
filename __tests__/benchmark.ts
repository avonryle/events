// vibe coded benchmarker. 
// requires installation of tseep, tte and ee3

import Benchmark from 'benchmark';
import { EventEmitter as CustomEmitter } from '../index';
import { EventEmitter as TseepEmitter } from 'tseep';
import { TypedEmitter } from 'tiny-typed-emitter';
import EventEmitter3 from 'eventemitter3';

const LISTENER_COUNT = 10;
const EMIT_COUNT = 1000;

console.log('='.repeat(80));
console.log('EVENT EMITTER BENCHMARK COMPARISON');
console.log('='.repeat(80));
console.log();

const suite = new Benchmark.Suite();

suite
  .add('CustomEmitter: on + emit (single listener)', () => {
    const ee = new CustomEmitter<any>();
    ee.on('test', () => {});
    for (let i = 0; i < EMIT_COUNT; i++) {
      ee.emit('test', 'data');
    }
  })
  .add('tseep: on + emit (single listener)', () => {
    const ee = new TseepEmitter();
    ee.on('test', () => {});
    for (let i = 0; i < EMIT_COUNT; i++) {
      ee.emit('test', 'data');
    }
  })
  .add('tiny-typed-emitter: on + emit (single listener)', () => {
    const ee = new TypedEmitter();
    ee.on('test', () => {});
    for (let i = 0; i < EMIT_COUNT; i++) {
      ee.emit('test', 'data');
    }
  })
  .add('eventemitter3: on + emit (single listener)', () => {
    const ee = new EventEmitter3();
    ee.on('test', () => {});
    for (let i = 0; i < EMIT_COUNT; i++) {
      ee.emit('test', 'data');
    }
  })

  .add(`CustomEmitter: on + emit (${LISTENER_COUNT} listeners)`, () => {
    const ee = new CustomEmitter<any>();
    for (let i = 0; i < LISTENER_COUNT; i++) {
      ee.on('test', () => {});
    }
    for (let i = 0; i < EMIT_COUNT; i++) {
      ee.emit('test', 'data');
    }
  })
  .add(`tseep: on + emit (${LISTENER_COUNT} listeners)`, () => {
    const ee = new TseepEmitter();
    for (let i = 0; i < LISTENER_COUNT; i++) {
      ee.on('test', () => {});
    }
    for (let i = 0; i < EMIT_COUNT; i++) {
      ee.emit('test', 'data');
    }
  })
  .add(`tiny-typed-emitter: on + emit (${LISTENER_COUNT} listeners)`, () => {
    const ee = new TypedEmitter();
    for (let i = 0; i < LISTENER_COUNT; i++) {
      ee.on('test', () => {});
    }
    for (let i = 0; i < EMIT_COUNT; i++) {
      ee.emit('test', 'data');
    }
  })
  .add(`eventemitter3: on + emit (${LISTENER_COUNT} listeners)`, () => {
    const ee = new EventEmitter3();
    for (let i = 0; i < LISTENER_COUNT; i++) {
      ee.on('test', () => {});
    }
    for (let i = 0; i < EMIT_COUNT; i++) {
      ee.emit('test', 'data');
    }
  })

  .add('CustomEmitter: once + emit', () => {
    const ee = new CustomEmitter<any>();
    for (let i = 0; i < EMIT_COUNT; i++) {
      ee.once('test', () => {});
      ee.emit('test', 'data');
    }
  })
  .add('tseep: once + emit', () => {
    const ee = new TseepEmitter();
    for (let i = 0; i < EMIT_COUNT; i++) {
      ee.once('test', () => {});
      ee.emit('test', 'data');
    }
  })
  .add('tiny-typed-emitter: once + emit', () => {
    const ee = new TypedEmitter();
    for (let i = 0; i < EMIT_COUNT; i++) {
      ee.once('test', () => {});
      ee.emit('test', 'data');
    }
  })
  .add('eventemitter3: once + emit', () => {
    const ee = new EventEmitter3();
    for (let i = 0; i < EMIT_COUNT; i++) {
      ee.once('test', () => {});
      ee.emit('test', 'data');
    }
  })

  .add('CustomEmitter: emit with multiple args', () => {
    const ee = new CustomEmitter<any>();
    ee.on('multi', () => {});
    for (let i = 0; i < EMIT_COUNT; i++) {
      ee.emit('multi', 42, 'test', true, { key: 'value' });
    }
  })
  .add('tseep: emit with multiple args', () => {
    const ee = new TseepEmitter();
    ee.on('multi', () => {});
    for (let i = 0; i < EMIT_COUNT; i++) {
      ee.emit('multi', 42, 'test', true, { key: 'value' });
    }
  })
  .add('tiny-typed-emitter: emit with multiple args', () => {
    const ee = new TypedEmitter();
    ee.on('multi', () => {});
    for (let i = 0; i < EMIT_COUNT; i++) {
      ee.emit('multi', 42, 'test', true, { key: 'value' });
    }
  })
  .add('eventemitter3: emit with multiple args', () => {
    const ee = new EventEmitter3();
    ee.on('multi', () => {});
    for (let i = 0; i < EMIT_COUNT; i++) {
      ee.emit('multi', 42, 'test', true, { key: 'value' });
    }
  })

  .add('CustomEmitter: on + off', () => {
    const ee = new CustomEmitter<any>();
    const fn = () => {};
    for (let i = 0; i < EMIT_COUNT; i++) {
      ee.on('test', fn);
      ee.off('test', fn);
    }
  })
  .add('tseep: on + off', () => {
    const ee = new TseepEmitter();
    const fn = () => {};
    for (let i = 0; i < EMIT_COUNT; i++) {
      ee.on('test', fn);
      ee.off('test', fn);
    }
  })
  .add('tiny-typed-emitter: on + off', () => {
    const ee = new TypedEmitter();
    const fn = () => {};
    for (let i = 0; i < EMIT_COUNT; i++) {
      ee.on('test', fn);
      ee.off('test', fn);
    }
  })
  .add('eventemitter3: on + off', () => {
    const ee = new EventEmitter3();
    const fn = () => {};
    for (let i = 0; i < EMIT_COUNT; i++) {
      ee.on('test', fn);
      ee.off('test', fn);
    }
  })

  .on('cycle', (event: Benchmark.Event) => {
    console.log(String(event.target));
  })
  .on('complete', function (this: Benchmark.Suite) {
    console.log();
    console.log('='.repeat(80));
    console.log('RESULTS SUMMARY');
    console.log('='.repeat(80));
    console.log();

    const results: { [key: string]: Benchmark.Target[] } = {};

    this.forEach((bench: Benchmark.Target) => {
      const name = bench.name as string;
      const category = name.split(':')[1].trim();
      if (!results[category]) results[category] = [];
      results[category].push(bench);
    });

    Object.keys(results).forEach((category) => {
      const benches = results[category];
      const fastest = benches.reduce((prev, current) =>
        (current.hz || 0) > (prev.hz || 0) ? current : prev
      );

      console.log(`\n${category}:`);
      console.log('-'.repeat(80));

      benches.forEach((bench) => {
        const lib = (bench.name as string).split(':')[0];
        const ops = (bench.hz || 0).toFixed(2);
        const relative = ((bench.hz || 0) / (fastest.hz || 1) * 100).toFixed(2);
        const isFastest = bench === fastest;

        console.log(
          `  ${lib.padEnd(25)} ${ops.padStart(15)} ops/sec  ${relative.padStart(6)}%${
            isFastest ? '  ⚡ FASTEST' : ''
          }`
        );
      });
    });

    console.log();
    console.log('='.repeat(80));
  })
  .run({ async: false });
