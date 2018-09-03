// Helpers
import { eventKey } from "./keys"

// Constants
export const prepositions = new Set(["before", "after"])

// Helpers
export function parseArgs({ args, emitter }) {
  let fn, op, options, prep, props

  const extras = []

  for (const arg of args) {
    if (!prep && prepositions.has(arg)) {
      prep = arg
    } else if (
      !op &&
      (emitter.ops.has(arg) || emitter.opsSync.has(arg))
    ) {
      op = arg
    } else if (!props && typeof arg === "string") {
      props = arg
    } else if (!fn && typeof arg === "function") {
      fn = arg
    } else if (
      !options &&
      typeof arg === "object" &&
      arg !== null &&
      arg.constructor === Object
    ) {
      options = arg
    } else {
      extras.push(arg)
    }
  }

  const key = eventKey({ op, prep, props })

  return {
    emitter,
    extras: extras.length ? extras : undefined,
    fn,
    key,
    op,
    options,
    prep,
    props,
  }
}
