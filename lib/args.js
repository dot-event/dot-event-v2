// Constants
export const prepositions = ["before", "after"]

// Helpers
export function parseArgs({ args, ops }) {
  let fn, op, options, prep, props

  for (const arg of args) {
    if (!arg) {
      continue
    }
    if (prepositions.indexOf(arg) > -1) {
      prep = arg
    } else if (ops && ops.indexOf(arg) > -1) {
      op = arg
    } else if (typeof arg === "string") {
      props = arg
    } else if (typeof arg === "function") {
      fn = arg
    } else if (typeof arg === "object") {
      options = arg
    }
  }

  return { fn, op, options, prep, props }
}
