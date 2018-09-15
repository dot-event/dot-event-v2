// Helpers
import { propsToArray } from "./props"

// Constants
export const prepositions = new Set(["before", "after"])

// Helpers
export function initState({ args, events }) {
  const matches = args.reduce(matchArg, { events })
  matches.props = propsToArray(matches.props)
  return matches
}

function matchArg(memo, arg) {
  if (!memo.prep && prepositions.has(arg)) {
    memo.prep = arg
  } else if (
    !memo.op &&
    (memo.events.ops.has(arg) ||
      memo.events.opsSync.has(arg))
  ) {
    memo.op = arg
  } else if (
    !memo.props &&
    (typeof arg === "string" || Array.isArray(arg))
  ) {
    memo.props = arg
  } else if (!memo.fn && typeof arg === "function") {
    memo.fn = arg
  } else {
    if (
      !memo.options &&
      typeof arg === "object" &&
      arg !== null &&
      arg.constructor === Object
    ) {
      memo.options = arg
    }

    if (memo.args) {
      memo.args.push(arg)
    } else {
      memo.args = [arg]
    }
  }

  return memo
}
