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
  const listener = state.args[0][props]

  if (Array.isArray(listener)) {
    return listener.map(listenFn =>
      buildSubscriber({
        fn,
        listener: listenFn,
        props,
        state,
      })
    )
  } else {
    return buildSubscriber({ fn, listener, props, state })
  }
}

function buildSubscriber({ fn, listener, props, state }) {
  return fn.call({
    ...state,
    args: undefined,
    fn: listener,
    props,
  })
}

function multiOff() {
  const { offs } = this
  for (const off of offs) {
    if (Array.isArray(off)) {
      for (const fn of off) {
        fn()
      }
    } else {
      off()
    }
  }
}
