export function opBase({ emitter, ops, sync }) {
  const set = sync ? emitter.opsSync : emitter.ops

  for (const op of ops) {
    if (!set.has(op)) {
      set.add(op)
      emitter[op] = opBaseEmit.bind({ emitter, op, sync })
    }
  }

  return emitter
}

function opBaseEmit(...args) {
  const { emitter, op, sync } = this
  return emitter[sync ? "emitSync" : "emit"](op, ...args)
}
