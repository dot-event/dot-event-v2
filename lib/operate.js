// Helpers
import { parseArgs } from "./args"
import { addBasePayload } from "./payload"

export async function operate({ args, emitter, op }) {
  const { extras, prep, props, options } = parseArgs({
    args,
  })

  const payload = addBasePayload({
    emitter,
    extras,
    op,
    options,
    prep,
    props,
  })

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
