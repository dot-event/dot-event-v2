export function debug(events) {
  return debugWindow(events) || debugProcess(events)
}

export function debugWindow(events) {
  if (typeof window === "undefined") {
    return
  }

  const debug =
    window.location &&
    /[?&]events=1/.test(window.location.search)

  if (debug) {
    attachDebugConsole(events)
  }

  return debug
}

export function debugProcess(events) {
  if (typeof process === "undefined") {
    return
  }

  const debug = process.env && process.env.EVENTS

  if (debug) {
    attachDebugConsole(events)
  }

  return debug
}

export function attachDebugConsole(events) {
  events.onAny(({ event }) => {
    if (event.op !== "get") {
      // eslint-disable-next-line no-console
      console.log(event.op, event.props, event.args)
    }
  })
}
