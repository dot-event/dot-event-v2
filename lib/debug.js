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
}

export function attachLog(events) {
  const fs = require("fs")
  const path = require("path")

  const log = fs.createWriteStream(
    path.join(process.cwd(), process.env.EVENTS),
    { flags: "a" }
  )

  events.withOptions({ log }).onAny(logger)
}

export function logger({ event, log }) {
  const msg = [event.op]

  if (event.props) {
    msg.push(event.props.join("."))
  }

  if (event.args && log) {
    const options = JSON.stringify(event.args[0])

    if (options.length < 256) {
      msg.push(options)
    } else {
      msg.push(
        `{ ${Object.keys(event.args[0]).join(", ")} }`
      )
    }
  } else if (event.args) {
    msg.push(event.args[0])
  }

  if (log) {
    log.write(msg.join("\t") + "\n\n")
  } else {
    // eslint-disable-next-line no-console
    console.log(...msg)
  }
}
