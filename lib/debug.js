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

  if (debug && process.env.EVENTS === "1") {
    attachDebugConsole(events)
  } else if (debug) {
    attachLog(events)
  }

  return debug
}

export function attachDebugConsole(events) {
  events.onAny(logger)
  events.withOp("*").onAny(logger)
}

export function attachLog(events) {
  const fs = require("fs")
  const path = require("path")
  const log = fs.createWriteStream(
    path.join(process.cwd(), process.env.EVENTS),
    { flags: "a" }
  )
  events.withOptions({ log }).onAny(logger)
  events
    .withOptions({ log })
    .withOp("*")
    .onAny(logger)
}

export function logger({ event, log }) {
  const msg = [
    event.op ? event.op : null,
    event.props ? event.props.join(".") : null,
    event.args ? event.args.join(" ") : null,
  ].reduce(
    (memo, arg) => (arg ? memo.concat([arg]) : memo),
    []
  )
  if (log) {
    log.write(msg.join(" ") + "\n")
  } else {
    // eslint-disable-next-line no-console
    console.log(...msg)
  }
}
