// Helpers
import { once as onceEmitter } from "./emitter"

export function once(mapType, state) {
  const { emitter, fn, key, options } = state

  let promise = onceEmitter(emitter[`${mapType}Map`], key)

  if (fn) {
    promise = promise.then(async opts => {
      const opt = { ...opts, ...options }
      await fn(opt)
      return opt
    })
  } else {
    promise = promise.then(opts => ({
      ...opts,
      ...options,
    }))
  }

  return promise
}
