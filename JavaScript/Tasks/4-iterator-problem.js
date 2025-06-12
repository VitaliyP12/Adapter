// Task: ensure all blocks of code in the usage section iterate in parallel.
// Currently, only the last block (of 3) works. Fix this issue so that
// all blocks can iterate concurrently using a single `Timer` instance.

'use strict';
class Timer {
  #counter = 0;
  #resolvers = [];

  constructor(delay) {
    setInterval(() => {
      this.#counter++;
      for (const resolve of this.#resolvers) {
        resolve({
          value: this.#counter,
          done: false,
        });
      }
      this.#resolvers = [];
    }, delay);
  }

  [Symbol.asyncIterator]() {
    return {
      next: () => new Promise((resolve) => {
        this.#resolvers.push(resolve);
      }),
    };
  }
}

const main = async () => {
  const timer = new Timer(1000);

  (async () => {
    console.log('Section 1 start');
    for await (const step of timer) {
      console.log({ section: 1, step });
    }
  })();

  (async () => {
    console.log('Section 2 start');
    const iter = timer[Symbol.asyncIterator]();
    do {
      const { value, done } = await iter.next();
      console.log({ section: 2, step: value, done });
    } while (true);
  })();

  (async () => {
    console.log('Section 3 start');
    const iter = timer[Symbol.asyncIterator]();
    do {
      const { value, done } = await iter.next();
      console.log({ section: 3, step: value, done });
    } while (true);
  })();
};

main();
