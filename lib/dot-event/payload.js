// Helpers
import { propVar } from "./props"
import { isObject } from "./util"

// Constants
const propDefault = []

// Helpers
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
    const emitProps =
      emitEvent && emitEvent.props
        ? emitEvent.props
        : propDefault

    const newOptions = buildOptions({
      emitArgs,
      emitEvent,
      options,
      props,
    })

    return {
      ...events.defaultOptions,
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
        props: emitProps,
        signal: emitEvent ? emitEvent.signal : undefined,
      },
      props: emitProps,
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
