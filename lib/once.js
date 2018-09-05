// Helpers
import { once } from "./emitter"

export function onceBase(mapType, state) {
  const { emitter, fn, key, options } = state

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
