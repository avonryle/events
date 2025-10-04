const {EventEmitter} = require('@avonrylew/events')

// Create a new emitter instance
const emitter = new EventEmitter();

// Set max listeners to 2 for demonstration
emitter.max(2);

console.log('=== EventEmitter Demo ===');

// 1. Basic 'on' and 'emit'
emitter.on('greet', (name) => {
  console.log(`Hello, ${name}!`);
});

console.log('\n1. Emitting "greet" event:');
emitter.emit('greet', 'Alice'); // Output: Hello, Alice!

// 2. Using 'once' for one-time execution
emitter.once('welcome', () => {
  console.log('Welcome message (will only appear once)');
});

console.log('\n2. Emitting "welcome" twice:');
emitter.emit('welcome'); // Output: Welcome message (will only appear once)
emitter.emit('welcome'); // No output

// 3. Using 'onAny' to catch all events
emitter.onAny((eventName, ...args) => {
  console.log(`[ANY EVENT] ${eventName} with args:`, args);
});

console.log('\n3. Emitting "data" event (will trigger onAny):');
emitter.emit('data', { id: 123, value: 'test' });
// Output:
// [ANY EVENT] data with args: [ { id: 123, value: 'test' } ]

// 4. Demonstrating max listeners warning
console.log('\n4. Adding more than max listeners (2):');
emitter.on('test', () => console.log('Listener 1'));
emitter.on('test', () => console.log('Listener 2'));
emitter.on('test', () => console.log('Listener 3')); // Will show warning
// Output: MaxListeners: test

// 5. Using 'off' to remove listeners
const tempListener = () => console.log('Temporary listener');
emitter.on('temp', tempListener);

console.log('\n5. Removing listener:');
emitter.off('temp', tempListener);
console.log('Listeners for "temp":', emitter.count('temp')); // Output: 0

// 6. Getting event names
console.log('\n6. Registered event names:');
console.log(emitter.names());
// Output: [ 'greet', 'welcome', 'data', 'test' ]

// 7. Using 'wait' for promise-based event handling
console.log('\n7. Waiting for "result" event:');
setTimeout(() => {
  emitter.emit('result', 'Operation complete');
}, 1000);

emitter.wait('result')
  .then(([result]) => {
    console.log('Promise resolved with:', result);
    // Output after 1s: Promise resolved with: Operation complete
  })
  .catch(err => console.error('Error:', err.message));

// 8. Clearing all listeners
console.log('\n8. Clearing all listeners:');
emitter.clear();
console.log('Remaining listeners:', emitter.names()); // Output: []
