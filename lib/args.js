// Helpers
import { propsToArray } from "./props"

// Helpers
export function initState({ args = [], options = {} }) {
  const state = args.reduce(matchArg, { ...options })
  state.props = propsToArray(state.props)
  return state
}

function matchArg(memo, arg) {
  if (
    !memo.props &&
    (typeof arg === "string" || Array.isArray(arg))
  ) {
    memo.props = arg
  } else if (!memo.fn && typeof arg === "function") {
    memo.fn = arg
  } else if (memo.args) {
    memo.args.push(arg)
  } else {
    memo.args = [arg]
  }

  return memo
}
