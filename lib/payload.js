import { propVar } from "./props"

export function buildPayload({ emit, opts = {}, state }) {
  const {
    args = [],
    events,
    op,
    options = {},
    propsArray,
  } = state

  if (emit) {
    return {
      ...options,
      event: {
        args,
        op,
        options,
        props: propsArray,
        signal: {},
      },
      [events.name]: events,
    }
  } else {
    const emitEvent = opts.event || {}
    const emitArgs = emitEvent.args || []

    const wildcardVar = propVar({
      emitPropsArray: emitEvent.props,
      propsArray,
    })

    const emitOptions = emitEvent.options || {}

    const newOptions = Object.assign(
      {},
      emitOptions,
      options,
      wildcardVar
    )

    return {
      ...newOptions,
      event: {
        args: emitArgs.length ? emitArgs : undefined,
        listenArgs: args.length ? args : undefined,
        listenProps: propsArray,
        op: emitEvent.op,
        options: Object.keys(newOptions).length
          ? newOptions
          : undefined,
        props: emitEvent.props,
        signal: emitEvent.signal,
      },
      [events.name]: events,
    }
  }
}
