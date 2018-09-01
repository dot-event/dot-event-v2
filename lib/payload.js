// Helpers
import { eventKey } from "./key"

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
      keys: [eventKey({ op, props })],
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
