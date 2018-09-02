// Helpers
import { eventKey } from "./key"

export function basePayload({
  emitter,
  extras,
  op,
  prep,
  props,
}) {
  const keys = new Set([
    eventKey(),
    eventKey({ op }),
    eventKey({ op, props }),
  ])
  return {
    event: {
      emitter,
      extras,
      keys,
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
