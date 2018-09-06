// Helpers
import {
  emit as emitBase,
  emitSync,
  on as onBase,
  once as onceBase,
} from "./emitter"

export function emit({ state, prep, sync, type }) {
  const { maps, payload, sets } = state
  const map = maps[type]
  const set = sets[type]
  const keys = state.keys[type]({ prep })

  if (sync) {
    for (const key of keys) {
      emitSync(map, key, payload)
      set.add(key)
    }
  } else {
    return Promise.all(
      keys.map(async key => {
        await emitBase(map, key, payload)
        set.add(key)
      })
    )
  }
}

export function on({ state, type }) {
  const { fn, maps, options, prep } = state
  const map = maps[type]
  const keys = state.keys[type]({
    prep,
    subscribe: true,
  })

  const offs = keys.map(key =>
    onBase(map, key, opts => fn({ ...opts, ...options }))
  )

  return () => {
    for (const off of offs) {
      off()
    }
  }
}

export function once({ state, type }) {
  const { fn, maps, options, prep } = state
  const map = maps[type]
  const keys = state.keys[type]({
    prep,
    subscribe: true,
  })

  const promises = keys.map(key => {
    let promise = onceBase(map, key)

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
  })

  return Promise.all(promises)
}

export function emitted({ state, type }, callback) {
  const { prep, sets } = state

  const keys = state.keys[type]({
    prep,
    subscribe: true,
  })

  const found = keys.find(key => sets[type].has(key))

  return callback(found)
}
