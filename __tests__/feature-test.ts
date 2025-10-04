// vibe coded feature tester
// requires installation of tseep, tte and ee3

import { EventEmitter as CustomEmitter } from '../index.ts';
import { EventEmitter as TseepEmitter } from 'tseep';
import { TypedEmitter } from 'tiny-typed-emitter';
import EventEmitter3 from 'eventemitter3';

console.log('='.repeat(80));
console.log('FEATURE COMPARISON TEST');
console.log('='.repeat(80));
console.log();

async function testFeature(name: string, test: () => boolean | string | Promise<boolean>): Promise<void> {
  try {
    const result = await test();
    if (typeof result === 'string') {
      console.log(`  ${name}: ${result}`);
    } else {
      console.log(`  ${name}: ${result ? '✓ PASS' : '✗ FAIL'}`);
    }
  } catch (error) {
    console.log(`  ${name}: ✗ ERROR - ${(error as Error).message}`);
  }
}

async function runTests() {
  console.log('CustomEmitter Features:');
  console.log('-'.repeat(80));

  await testFeature('on() method', () => {
    const ee = new CustomEmitter<any>();
    ee.on('test', () => {});
    return true;
  });

  await testFeature('once() method', () => {
    const ee = new CustomEmitter<any>();
    let count = 0;
    ee.once('test', () => count++);
    ee.emit('test', 'data');
    ee.emit('test', 'data');
    return count === 1;
  });

  await testFeature('off() method', () => {
    const ee = new CustomEmitter<any>();
    let count = 0;
    const fn = () => count++;
    ee.on('test', fn);
    ee.emit('test', 'data');
    ee.off('test', fn);
    ee.emit('test', 'data');
    return count === 1;
  });

  await testFeature('emit() returns boolean', () => {
    const ee = new CustomEmitter<any>();
    const noListener = ee.emit('test', 'data');
    ee.on('test', () => {});
    const hasListener = ee.emit('test', 'data');
    return !noListener && hasListener;
  });

  await testFeature('onAny() wildcard listener', () => {
    const ee = new CustomEmitter<any>();
    let called = false;
    ee.onAny(() => (called = true));
    ee.emit('test', 'data');
    return called;
  });

  await testFeature('offAny() remove wildcard', () => {
    const ee = new CustomEmitter<any>();
    let count = 0;
    const fn = () => count++;
    ee.onAny(fn);
    ee.emit('test', 'data');
    ee.offAny(fn);
    ee.emit('test', 'data');
    return count === 1;
  });

  await testFeature('clear() all events', () => {
    const ee = new CustomEmitter<any>();
    ee.on('test', () => {});
    ee.on('data', () => {});
    ee.clear();
    return ee.count('test') === 0 && ee.count('data') === 0;
  });

  await testFeature('clear(event) specific event', () => {
    const ee = new CustomEmitter<any>();
    ee.on('test', () => {});
    ee.on('data', () => {});
    ee.clear('test');
    return ee.count('test') === 0 && ee.count('data') === 1;
  });

  await testFeature('count() listener count', () => {
    const ee = new CustomEmitter<any>();
    ee.on('test', () => {});
    ee.on('test', () => {});
    ee.once('test', () => {});
    return ee.count('test') === 3;
  });

  await testFeature('names() event names', () => {
    const ee = new CustomEmitter<any>();
    ee.on('test', () => {});
    ee.on('data', () => {});
    const names = ee.names();
    return names.length === 2 && names.includes('test') && names.includes('data');
  });

  await testFeature('wait() promise resolution', async () => {
    const ee = new CustomEmitter<any>();
    setTimeout(() => ee.emit('test', 'resolved'), 10);
    const [result] = await ee.wait('test');
    return result === 'resolved';
  });

  await testFeature('wait() with timeout', async () => {
    const ee = new CustomEmitter<any>();
    try {
      await ee.wait('test', 10);
      return false;
    } catch (error) {
      return (error as Error).message.includes('Timeout');
    }
  });

  await testFeature('max() set max listeners', () => {
    const ee = new CustomEmitter<any>();
    ee.max(5);
    return ee.m === 5;
  });

  console.log();
  console.log('tseep Features:');
  console.log('-'.repeat(80));

  await testFeature('on() method', () => {
    const ee = new TseepEmitter();
    ee.on('test', () => {});
    return true;
  });

  await testFeature('once() method', () => {
    const ee = new TseepEmitter();
    let count = 0;
    ee.once('test', () => { count++; });
    ee.emit('test', 'data');
    ee.emit('test', 'data');
    return count === 1;
  });

  await testFeature('off() method', () => {
    const ee = new TseepEmitter();
    let count = 0;
    const fn = () => { count++; };
    ee.on('test', fn);
    ee.emit('test', 'data');
    ee.off('test', fn);
    ee.emit('test', 'data');
    return count === 1;
  });

  await testFeature('onAny() wildcard listener', () => 'Not supported');
  await testFeature('clear() all events', () => 'Not supported');
  await testFeature('count() listener count', () => 'Not supported');
  await testFeature('wait() promise', () => 'Not supported');

  console.log();
  console.log('tiny-typed-emitter Features:');
  console.log('-'.repeat(80));

  await testFeature('on() method', () => {
    const ee = new TypedEmitter();
    ee.on('test', () => {});
    return true;
  });

  await testFeature('once() method', () => {
    const ee = new TypedEmitter();
    let count = 0;
    ee.once('test', () => count++);
    ee.emit('test', 'data');
    ee.emit('test', 'data');
    return count === 1;
  });

  await testFeature('off() method', () => {
    const ee = new TypedEmitter();
    let count = 0;
    const fn = () => count++;
    ee.on('test', fn);
    ee.emit('test', 'data');
    ee.off('test', fn);
    ee.emit('test', 'data');
    return count === 1;
  });

  await testFeature('onAny() wildcard listener', () => 'Not supported');
  await testFeature('clear() all events', () => 'Not supported');
  await testFeature('count() listener count', () => {
    const ee = new TypedEmitter();
    ee.on('test', () => {});
    ee.on('test', () => {});
    return ee.listenerCount('test') === 2;
  });
  await testFeature('wait() promise', () => 'Not supported');

  console.log();
  console.log('eventemitter3 Features:');
  console.log('-'.repeat(80));

  await testFeature('on() method', () => {
    const ee = new EventEmitter3();
    ee.on('test', () => {});
    return true;
  });

  await testFeature('once() method', () => {
    const ee = new EventEmitter3();
    let count = 0;
    ee.once('test', () => count++);
    ee.emit('test', 'data');
    ee.emit('test', 'data');
    return count === 1;
  });

  await testFeature('off() method', () => {
    const ee = new EventEmitter3();
    let count = 0;
    const fn = () => count++;
    ee.on('test', fn);
    ee.emit('test', 'data');
    ee.off('test', fn);
    ee.emit('test', 'data');
    return count === 1;
  });

  await testFeature('onAny() wildcard listener', () => 'Not supported');
  await testFeature('clear() all events', () => {
    const ee = new EventEmitter3();
    ee.on('test', () => {});
    ee.removeAllListeners();
    return ee.listenerCount('test') === 0;
  });
  await testFeature('count() listener count', () => {
    const ee = new EventEmitter3();
    ee.on('test', () => {});
    ee.on('test', () => {});
    return ee.listenerCount('test') === 2;
  });
  await testFeature('wait() promise', () => 'Not supported');

  console.log();
  console.log('='.repeat(80));
}

runTests();
