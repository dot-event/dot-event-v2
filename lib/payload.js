// Helpers
import { parseArgs } from "./args"
import { eventKey } from "./keys"

export function basePayload({
  emitter,
  extras,
  op,
  options,
  props,
}) {
  return {
    event: {
      emitter,
      extras,
      keys: new Set([eventKey({ op, props })]),
      op,
      options,
      props,
    },
  }
}

export function addBasePayload({
  emitter,
  extras,
  op,
  options,
  props,
}) {
  return {
    ...options,
    ...basePayload({
      emitter,
      extras,
      op,
      options,
      props,
    }),
  }
}

export function emitPayload({ args, emitter }) {
  const { extras, props, op, options } = parseArgs({
    args,
    emitter,
  })

  return addBasePayload({
    emitter,
    extras,
    op,
    options,
    props,
  })
}

export function emittedPayload({ emitter, options }) {
  return addBasePayload({ emitter, ...options })
}
