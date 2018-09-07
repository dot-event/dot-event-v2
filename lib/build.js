import { initState } from "./args"
import { emitted, on, once } from "./base"
import { multi } from "./multi"
import { buildPayload } from "./payload"

export function buildOn(...args) {
  const { emitter, name } = this
  const type = nameToType(name)

  if (Array.isArray(args[0])) {
    return multi(emitter, name, args[0])
  }

  const state = initState({ args, emitter })

  return on({ state, type })
}

export function buildEmitted(...args) {
  const { emitter, name } = this
  const type = nameToType(name)

  if (Array.isArray(args[0])) {
    return multi(emitter, name, args[0])
  }

  const state = initState({ args, emitter })
  const { fn } = state

  const found = emitted({ state, type })

  if (found) {
    fn(buildPayload({ emitter, state }))
  }

  return on({ state, type })
}

export function buildOnce(...args) {
  const { emitter, name } = this
  const type = nameToType(name)

  if (Array.isArray(args[0])) {
    return multi(emitter, name, args[0])
  }

  const state = initState({ args, emitter })

  return once({ state, type })
}

export function buildOnceEmitted(...args) {
  const { emitter, name } = this
  const type = nameToType(name)

  if (Array.isArray(args[0])) {
    return multi(emitter, name, args[0])
  }

  const state = initState({ args, emitter })
  const { fn } = state

  const found = emitted({ state, type })

  if (found) {
    return (async () => {
      const payload = buildPayload({ emitter, state })
      await fn(payload)
      return payload
    })()
  } else {
    return once({ state, type })
  }
}

function nameToType(name) {
  return name.includes("Any") ? "any" : "on"
}
