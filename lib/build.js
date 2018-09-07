import { initState } from "./args"
import { emitted, on, once } from "./base"
import { multi } from "./multi"
import { buildPayload } from "./payload"

export function buildOn(emitter, name) {
  const type = nameToType(name)

  return (...args) => {
    if (Array.isArray(args[0])) {
      return multi(emitter, name, args[0])
    }

    const state = initState({ args, emitter })

    return on({ state, type })
  }
}

export function buildEmitted(emitter, name) {
  const type = nameToType(name)

  return (...args) => {
    if (Array.isArray(args[0])) {
      return multi(emitter, name, args[0])
    }

    const state = initState({ args, emitter })
    const { fn } = state

    const found = emitted({ state, type })

    if (found) {
      fn(buildPayload({ emitter: this, state }))
    }
    return on({ state, type })
  }
}

export function buildOnce(emitter, name) {
  const type = nameToType(name)

  return (...args) => {
    if (Array.isArray(args[0])) {
      return multi(this, name, args[0])
    }

    const state = initState({ args, emitter })

    return once({ state, type })
  }
}

export function buildOnceEmitted(emitter, name) {
  const type = nameToType(name)

  return (...args) => {
    if (Array.isArray(args[0])) {
      return multi(this, name, args[0])
    }

    const state = initState({ args, emitter })
    const { fn } = state

    const found = emitted({ state, type })

    if (found) {
      return (async () => {
        const payload = buildPayload({
          emitter: this,
          state,
        })
        await fn(payload)
        return payload
      })()
    } else {
      return once({ state, type })
    }
  }
}

function nameToType(name) {
  return name.includes("Any") ? "any" : "on"
}
