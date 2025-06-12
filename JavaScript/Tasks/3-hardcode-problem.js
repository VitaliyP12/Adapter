// Task: refactor `Timer` to make the event name configurable
// (e.g., 'step' in the example) and not hardcoded into the `Timer`.
// Hint: You need Node.js >= v19.0.0

'use strict';
class Timer extends EventTarget {
  #counter = 0;
  #eventName;

  constructor(delay, eventName = 'step') {
    super();
    this.#eventName = eventName;
    setInterval(() => {
      const step = this.#counter++;
      const data = { detail: { step } };
      const event = new CustomEvent(this.#eventName, data);
      this.dispatchEvent(event);
    }, delay);
  }
}

const timer = new Timer(1000, 'step'); 

timer.addEventListener('step', (event) => {
  console.log({ event, detail: event.detail });
});

const timer2 = new Timer(500, 'tick');
timer2.addEventListener('tick', (event) => {
  console.log('[tick]', event.detail);
});
