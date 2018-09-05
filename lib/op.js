export function opBase({ emitter, ops, sync }) {
  const set = sync ? emitter.opsSync : emitter.ops

  for (const op of ops) {
    if (!set.has(op)) {
      set.add(op)
      emitter[op] = (...args) =>
        emitter[sync ? "emitSync" : "emit"](op, ...args)
    }
  }

  return emitter
}