// Helpers
import { parseArgs } from "./args"
import { eventKey } from "./keys"

export function basePayload(parsedArgs) {
  const { emitter, extras, op, options, props } = parsedArgs
  const keys = new Set([eventKey({ op, props })])
  const event = {
    emitter,
    extras,
    keys,
    op,
    options,
    props,
  }

  return {
    ...parsedArgs.options,
    event,
  }
}

export function buildPayload(parsedArgs) {
  if (parsedArgs.args) {
    return basePayload(parseArgs(parsedArgs))
  }
  return basePayload(parsedArgs)
}
