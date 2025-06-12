// Task: implement a cancelable promise by passing `timeout: number`
// as an option to the promisified function (last argument,
// replacing the callback).
'use strict';

const promisify = (fn) => (...args) => {
  let timeout = null;
  let options = {};
  if (
    args.length &&
    typeof args[args.length - 1] === 'object' &&
    args[args.length - 1] !== null &&
    'timeout' in args[args.length - 1]
  ) {
    options = args.pop();
    timeout = options.timeout;
  }

  let timer;
  let finished = false;

  const promise = new Promise((resolve, reject) => {
    const callback = (err, data) => {
      if (finished) return;
      finished = true;
      if (timer) clearTimeout(timer);
      if (err) reject(err);
      else resolve(data);
    };

    fn(...args, callback);

    if (timeout != null) {
      timer = setTimeout(() => {
        if (finished) return;
        finished = true;
        reject(new Error('Operation timed out'));
      }, timeout);
    }
  });

  return promise;
};

const fs = require('node:fs');
const read = promisify(fs.readFile);

const main = async () => {
  const fileName = '1-promisify-problem.js'; 
  try {
    const data = await read(fileName, 'utf8', { timeout: 1 });
    console.log(`File "${fileName}" size: ${data.length}`);
  } catch (err) {
    console.error('Failed:', err.message);
  }
};

main();
