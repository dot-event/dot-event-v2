// Helpers
import { parseArgs } from "./args"
import { basePayload } from "./payload"

export async function operate({ args, emitter, op }) {
  const { extras, prep, props, options } = parseArgs({
    args,
  })

  const base = basePayload({
    emitter,
    extras,
    op,
    prep,
    props,
  })

  const payload = { ...options, ...base }

  await emitter.emit({ payload, prep: "before" })

  if (payload.event.cancel) {
    return payload
  }

  await emitter.emit({ payload })

  if (payload.event.cancelAfter) {
    return payload
  }

  await emitter.emit({ payload, prep: "after" })

  return payload
}
