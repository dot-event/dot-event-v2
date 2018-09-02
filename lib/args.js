// Helpers
import { eventKey } from "./keys"

// Constants
export const prepositions = new Set(["before", "after"])

// Helpers
export function parseArgs({ args, emitter }) {
  let fn, op, options, prep, props

  const extras = new Set()

  for (const arg of args) {
    if (!arg) {
      continue
    }
    if (prepositions.has(arg)) {
      prep = arg
    } else if (emitter.ops.has(arg)) {
      op = arg
    } else if (typeof arg === "string") {
      props = arg
    } else if (typeof arg === "function") {
      fn = arg
    } else if (typeof arg === "object") {
      options = arg
    } else {
      extras.add(arg)
    }
  }

  const key = eventKey({ op, prep, props })

  return {
    emitter,
    extras: extras.size ? Array.from(extras) : undefined,
    fn,
    key,
    op,
    options,
    prep,
    props,
  }
}
