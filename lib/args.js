// Constants
export const prepositions = ["before", "op", "after"]

// Helpers
export function parseArgs({ args, ops }) {
  let extras, fn, op, options, prep, props

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
    } else {
      extras = (extras || []).concat([arg])
    }
  }

  return { extras, fn, op, options, prep, props }
}
