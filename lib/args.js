// Helpers
import { propsToArray } from "./props"

// Helpers
export function initState({
  args = [],
  emit,
  options = {},
}) {
  const state = args.reduce(matchArg.bind({ emit }), {
    ...options,
  })
  state.props = propsToArray(state.props)
  return state
}

function matchArg(memo, arg) {
  const { emit } = this

  if (
    !memo.props &&
    (typeof arg === "string" || Array.isArray(arg))
  ) {
    memo.props = arg
  } else if (
    !emit &&
    !memo.fn &&
    typeof arg === "function"
  ) {
    memo.fn = arg
  } else if (memo.args) {
    memo.args.push(arg)
  } else {
    memo.args = [arg]
  }

  return memo
}
