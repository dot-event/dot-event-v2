// Helpers
import { anyKeys, onKeys } from "./keys"

// Constants
export const prepositions = new Set(["before", "after"])

// Helpers
export function initState({ args, emitter }) {
  let extras = [],
    fn,
    op,
    options,
    prep,
    props

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

  extras = extras.length ? extras : undefined

  const event = {
    emitter,
    extras,
    op,
    options,
    props,
  }

  const payload = {
    ...options,
    event,
  }

  return {
    emitter,
    extras,
    fn,
    keys: {
      any: anyKeys({ payload }),
      on: onKeys({ op, props }),
    },
    op,
    options,
    payload,
    prep,
    props,
  }
}
