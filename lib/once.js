// Helpers
import { once } from "./emitter"

export function onceBase(
  map,
  { emitter, fn, key, options }
) {
  let promise = once(emitter[`${map}Map`], key)

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
