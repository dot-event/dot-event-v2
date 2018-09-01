// Helpers
import { eventKey } from "./key"

// Constants
export const prepositions = new Set([
  "before",
  "op",
  "after",
])

// Helpers
export function parseArgs({ args, ops }) {
  let extras, fn, op, options, prep, props

  for (const arg of args) {
    if (!arg) {
      continue
    }
    if (prepositions.has(arg)) {
      prep = arg
    } else if (ops && ops.has(arg)) {
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

  return { extras, fn, op, options, prep, props }
}

export function subscribeArgs(args, emitter) {
  const {
    extras,
    fn,
    op,
    options,
    prep,
    props,
  } = parseArgs({
    args,
    ops: emitter.ops,
  })

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
