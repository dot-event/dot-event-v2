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
