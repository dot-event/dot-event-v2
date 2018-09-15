import { propVar } from "./props"

export function buildPayload({ emit, opts = {}, state }) {
  const { args, events, op, options, propsArray } = state

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
    const emitEvent = opts.event
    const emitArgs = emitEvent ? emitEvent.args : undefined

    const newOptions = buildOptions({
      emitEvent,
      options,
      propsArray,
    })

    return {
      ...newOptions,
      event: {
        args: emitArgs,
        listenArgs: args,
        listenProps: propsArray,
        op: emitEvent ? emitEvent.op : undefined,
        options:
          newOptions && Object.keys(newOptions).length
            ? newOptions
            : undefined,
        props: emitEvent ? emitEvent.props : undefined,
        signal: emitEvent ? emitEvent.signal : undefined,
      },
      [events.name]: events,
    }
  }
}

function buildOptions({ emitEvent, options, propsArray }) {
  if (emitEvent) {
    const wildcardVar = propVar({
      emitPropsArray: emitEvent.props,
      propsArray,
    })

    return Object.assign(
      {},
      emitEvent.options,
      options,
      wildcardVar
    )
  } else {
    return options
  }
}
