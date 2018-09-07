import { propVar } from "./props"

export function buildPayload({ emit, opts = {}, state }) {
  const {
    emitter,
    extras = [],
    op,
    options = {},
    props,
    propsArray,
  } = state

  if (emit) {
    return {
      ...options,
      event: {
        emitter,
        extras,
        op,
        options,
        props,
        propsArray,
      },
    }
  } else {
    const prevEvent = opts.event || {}
    const prevExtras = prevEvent.extras || []

    const wildcardVar = propVar({
      listenPropsArray: prevEvent.propsArray,
      propsArray,
    })

    const nextExtras = prevExtras.concat(extras)
    const prevOptions = prevEvent.options || {}

    const nextOptions = Object.assign(
      {},
      prevOptions,
      options,
      wildcardVar
    )

    return {
      ...nextOptions,
      event: {
        emitter,
        extras: nextExtras.length ? nextExtras : undefined,
        listenProps: props,
        listenPropsArray: propsArray,
        op: prevEvent.op,
        options: Object.keys(nextOptions).length
          ? nextOptions
          : undefined,
        props: prevEvent.props,
        propsArray: prevEvent.propsArray,
      },
    }
  }
}
