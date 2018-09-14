import { initState } from "./args"
import { emitted, on, once } from "./base"
import { multi } from "./multi"
import { buildPayload } from "./payload"

export function buildOn(...args) {
  const { events, name } = this
  const type = nameToType(name)

  if (Array.isArray(args[0])) {
    return multi(events, name, args[0])
  }

  const state = initState({ args, events })

  return on({ state, type })
}

export function buildEmitted(...args) {
  const { events, name } = this
  const type = nameToType(name)

  if (Array.isArray(args[0])) {
    return multi(events, name, args[0])
  }

  const state = initState({ args, events })
  const { fn } = state

  const found = emitted({ state, type })

  if (found) {
    fn(buildPayload({ state }))
  }

  return on({ state, type })
}

export function buildOnce(...args) {
  const { events, name } = this
  const type = nameToType(name)

  if (Array.isArray(args[0])) {
    return multi(events, name, args[0])
  }

  const state = initState({ args, events })

  return once({ state, type })
}

export function buildOnceEmitted(...args) {
  const { events, name } = this
  const type = nameToType(name)

  if (Array.isArray(args[0])) {
    return multi(events, name, args[0])
  }

  const state = initState({ args, events })
  const { fn } = state

  const found = emitted({ state, type })

  if (found) {
    return buildOnceEmittedFound({ fn, state })
  } else {
    return once({ state, type })
  }
}

async function buildOnceEmittedFound({ fn, state }) {
  const payload = buildPayload({ state })
  await fn(payload)
  return payload
}

function nameToType(name) {
  return name.includes("Any") ? "any" : "on"
}
