import { initState } from "./args"
import { multi } from "./multi"
import { buildPayload } from "./payload"
import {
  emitBase,
  onEmittedBase,
  onBase,
  onceBase,
} from "./base"

// Constants
export const emitTypes = ["any", "on"]

// Helpers
export async function emit(...args) {
  const state = initState({ args, options: this })
  const payload = buildPayload({ emit: true, state })

  await emitBase({
    emitTypes,
    payload,
    prep: "before",
    state,
  })

  if (payload.event.signal.cancel) {
    return payload
  }

  await emitBase({ emitTypes, payload, state })

  if (payload.event.signal.cancel) {
    return payload
  }

  await emitBase({
    emitTypes,
    payload,
    prep: "after",
    state,
  })

  return payload.event.signal.returnValue
}

export function emitSync(...args) {
  const state = initState({ args, options: this })
  const payload = buildPayload({ emit: true, state })

  emitBase({
    emitTypes,
    payload,
    prep: "before",
    state,
    sync: true,
  })

  if (payload.event.signal.cancel) {
    return payload
  }

  emitBase({ emitTypes, payload, state, sync: true })

  if (payload.event.signal.cancel) {
    return payload
  }

  emitBase({
    emitTypes,
    payload,
    prep: "after",
    state,
    sync: true,
  })

  return payload.event.signal.returnValue
}

export function on(...args) {
  const type = nameToType(this.name)
  const state = initState({ args, options: this })
  const multiOutput = multi(state)

  if (multiOutput) {
    return multiOutput
  }

  return onBase({ state, type })
}

export function onEmitted(...args) {
  const type = nameToType(this.name)
  const state = initState({ args, options: this })
  const multiOutput = multi(state)

  if (multiOutput) {
    return multiOutput
  }

  const found = onEmittedBase({ state, type })

  if (found) {
    state.fn(buildPayload({ state }))
  }

  return onBase({ state, type })
}

export function once(...args) {
  const type = nameToType(this.name)
  const state = initState({ args, options: this })
  const multiOutput = multi(state)

  if (multiOutput) {
    return multiOutput
  }

  return onceBase({ state, type })
}

export function onceEmitted(...args) {
  const type = nameToType(this.name)
  const state = initState({ args, options: this })
  const multiOutput = multi(state)

  if (multiOutput) {
    return multiOutput
  }

  const found = onEmittedBase({ state, type })

  if (found) {
    return onceEmittedFound({ state })
  } else {
    return onceBase({ state, type })
  }
}

async function onceEmittedFound({ state }) {
  const payload = buildPayload({ state })
  await state.fn(payload)
  return payload
}

function nameToType(name) {
  return name.indexOf("Any") > -1 ? "any" : "on"
}
