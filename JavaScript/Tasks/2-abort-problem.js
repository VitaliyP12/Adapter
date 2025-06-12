// Task: implement cancellation by passing `AbortSignal` as an option
// to the promisified function (last argument, replacing the callback).
// Hint: Create `AbortController` or `AbortSignal` in the usage section.

'use strict';

const promisify = (fn) => (...args) => {
  let signal;
  if (
    args.length &&
    typeof args[args.length - 1] === 'object' &&
    args[args.length - 1] !== null &&
    'signal' in args[args.length - 1]
  ) {
    ({ signal } = args.pop());
  }

  let finished = false;

  const promise = new Promise((resolve, reject) => {
    if (signal) {
      if (signal.aborted) {
        finished = true;
        return reject(new Error('Aborted'));
      }
      signal.addEventListener('abort', () => {
        if (!finished) {
          finished = true;
          reject(new Error('Aborted'));
        }
      }, { once: true });
    }

    const callback = (err, data) => {
      if (finished) return;
      finished = true;
      if (err) reject(err);
      else resolve(data);
    };

    fn(...args, callback);
  });

  return promise;
};

const fs = require('node:fs');
const read = promisify(fs.readFile);

const main = async () => {
  const fileName = '2-abort-problem.js';
  const controller = new AbortController();

  setTimeout(() => controller.abort(), 1);

  try {
    const data = await read(fileName, 'utf8', { signal: controller.signal });
    console.log(`File "${fileName}" size: ${data.length}`);
  } catch (err) {
    console.error('Failed:', err.message); 
  }
};
main();
