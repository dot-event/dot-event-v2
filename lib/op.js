export function opBase({ events, ops, sync }) {
  const set = sync ? events.opsSync : events.ops

  for (const op of ops) {
    if (!set.has(op)) {
      set.add(op)
      events[op] = opBaseEmit.bind({ events, op, sync })
    }
  }

  return events
}

function opBaseEmit(...args) {
  const { events, op, sync } = this
  return events[sync ? "emitSync" : "emit"](op, ...args)
}
