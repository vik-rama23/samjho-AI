type Listener = (loading: boolean) => void;

let count = 0;
const listeners = new Set<Listener>();

export function subscribe(fn: Listener) {
  listeners.add(fn);
  fn(count > 0);
  return () => listeners.delete(fn);
}

function notify() {
  const val = count > 0;
  listeners.forEach((l) => l(val));
}

export function increment() {
  count += 1;
  notify();
}

export function decrement() {
  count = Math.max(0, count - 1);
  notify();
}

export function reset() {
  count = 0;
  notify();
}

export default { subscribe, increment, decrement, reset };
