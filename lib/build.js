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
  const state = initState({
    args,
    emit: true,
    options: this,
  })
  const payload = buildPayload({ emit: true, state })

  await emitBase({ payload, prep: "before", state })

  if (payload.event.signal.cancel) {
    return payload.event.signal.returnValue
  }

  await emitBase({ payload, state })

  if (payload.event.signal.cancel) {
    return payload.event.signal.returnValue
  }

  await emitBase({ payload, prep: "after", state })

  return payload.event.signal.returnValue
}

export function on(...args) {
  const state = initState({ args, options: this })
  const multiOutput = multi({ fn: on, state })
  const type = getType(state)

  if (multiOutput) {
    return multiOutput
  }

  return onBase({ state, type })
}

export function onEmitted(...args) {
  const state = initState({ args, options: this })
  const multiOutput = multi({ fn: onEmitted, state })
  const type = getType(state)

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
  const state = initState({ args, options: this })
  const multiOutput = multi({ fn: once, state })
  const type = getType(state)

  if (multiOutput) {
    return multiOutput
  }

  return onceBase({ state, type })
}

export function onceEmitted(...args) {
  const state = initState({ args, options: this })
  const multiOutput = multi({ fn: onceEmitted, state })
  const type = getType(state)

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

function getType({ name }) {
  return name.indexOf("Any") > -1 ? "any" : "on"
}
