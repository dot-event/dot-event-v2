import { propVar } from "./props"
import { isObject } from "./util"

export function buildPayload({ emit, opts = {}, state }) {
  const { args, events, op, options, props } = state

  if (emit) {
    return {
      ...options,
      event: {
        args,
        op,
        options,
        props,
        signal: {},
      },
      [events.name]: events,
    }
  } else {
    const emitEvent = opts.event
    const emitArgs = emitEvent ? emitEvent.args : undefined

    const newOptions = buildOptions({
      emitArgs,
      emitEvent,
      options,
      props,
    })

    return {
      ...newOptions,
      event: {
        args: emitArgs,
        listenArgs: args,
        listenProps:
          props && props.length ? props : undefined,
        op: emitEvent ? emitEvent.op : op,
        options:
          newOptions && Object.keys(newOptions).length
            ? newOptions
            : undefined,
        props:
          emitEvent && emitEvent.props
            ? emitEvent.props.length
              ? emitEvent.props
              : undefined
            : undefined,
        signal: emitEvent ? emitEvent.signal : undefined,
      },
      [events.name]: events,
    }
  }
}

function buildOptions({
  emitArgs,
  emitEvent,
  options,
  props,
}) {
  if (emitEvent) {
    const wildcardVar = propVar({
      emitProps: emitEvent.props,
      props,
    })

    return Object.assign(
      {},
      emitEvent.options,
      options,
      wildcardVar,
      emitArgs && isObject(emitArgs[0])
        ? emitArgs[0]
        : undefined
    )
  } else {
    return options
  }
}
