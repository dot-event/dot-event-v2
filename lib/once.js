// Helpers
import { once } from "./emitter"

export function onceRaw({ emitter, fn, key, options }) {
  let promise = once(emitter.map, key)

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
