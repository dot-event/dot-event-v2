// Helpers
import { eventKey } from "./key"

// Constants
export const prepositions = new Set([
  "before",
  "op",
  "after",
])

// Helpers
export function parseArgs({ args, emitter }) {
  let extras, fn, op, options, prep, props

  for (const arg of args) {
    if (!arg) {
      continue
    }
    if (prepositions.has(arg)) {
      prep = arg
    } else if (emitter && emitter.ops.has(arg)) {
      op = arg
    } else if (typeof arg === "string") {
      props = arg
    } else if (typeof arg === "function") {
      fn = arg
    } else if (typeof arg === "object") {
      options = arg
    } else {
      extras = (extras || []).concat([arg])
    }
  }

  const key = eventKey({ op, prep, props })

  return {
    emitter,
    extras,
    fn,
    key,
    op,
    options,
    prep,
    props,
  }
}
