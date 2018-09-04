// Helpers
import { once } from "./emitter"

export function onceBase(mapType, parsedArgs) {
  const { emitter, fn, key, options } = parsedArgs

  let promise = once(emitter[`${mapType}Map`], key)

  if (fn) {
    promise = promise.then(
      opts => fn({ ...opts, ...options }) || opts
    )
  } else {
    promise = promise.then(opts => ({
      ...opts,
      ...options,
    }))
  }

  return promise
}
