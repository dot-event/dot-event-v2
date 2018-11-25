import { emit } from "./build"

export function opBase({ op, options }) {
  const { events } = options
  const set = events.ops

  if (op !== "*" && !set.has(op)) {
    set.add(op)
    events[op] = emit.bind({ ...options, op })
  }
}
