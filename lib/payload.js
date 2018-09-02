// Helpers
import { eventKey } from "./keys"

export function basePayload({
  emitter,
  extras,
  op,
  prep,
  props,
}) {
  return {
    event: {
      emitter,
      extras,
      keys: new Set([eventKey({ op, props })]),
      op,
      prep,
      props,
    },
  }
}

export function addBasePayload({
  emitter,
  extras,
  op,
  options,
  prep,
  props,
}) {
  return {
    ...options,
    ...basePayload({
      emitter,
      extras,
      op,
      prep,
      props,
    }),
  }
}
