// Helpers
import { propsToArray } from "./props"

// Constants
export const prepositions = new Set(["before", "after"])

// Helpers
export function initState({ args, events }) {
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
      (events.ops.has(arg) || events.opsSync.has(arg))
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

  let propsArray = propsToArray(props)

  extras = extras.length ? extras : undefined
  propsArray = propsArray.length ? propsArray : undefined

  return {
    events,
    extras,
    fn,
    op,
    options,
    prep,
    props,
    propsArray,
  }
}
