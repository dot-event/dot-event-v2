import { isObject } from "./util"

export function multi({ fn, state }) {
  if ((state.props && state.fn) || !state.args) {
    return
  }

  const arg = state.args[0]

  if (isObject(arg)) {
    const offs = Object.keys(arg).map(
      multiMap.bind({ fn, state })
    )
    return multiOff.bind({ offs })
  }
}

function multiMap(props) {
  const { fn, state } = this

  return fn.call({
    ...state,
    args: undefined,
    fn: state.args[0][props],
    props,
  })
}

function multiOff() {
  const { offs } = this
  for (const off of offs) {
    off()
  }
}
