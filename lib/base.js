// Helpers
import { buildKeys } from "./keys"
import { buildPayload } from "./payload"
import {
  emit as emitBase,
  emitSync,
  on as onBase,
  once as onceBase,
} from "./emitter"

export function emit({ payload, prep, state, sync, type }) {
  const { emitter } = state
  const map = emitter.maps[type]
  const set = emitter.sets[type]
  const keys = buildKeys({ prep, state, type })

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
  const { emitter, fn } = state
  const map = emitter.maps[type]

  const keys = buildKeys({
    state,
    subscribe: true,
    type,
  })

  const offs = keys.map(key =>
    onBase(map, key, opts =>
      fn(buildPayload({ opts, state }))
    )
  )

  return () => {
    for (const off of offs) {
      off()
    }
  }
}

export function once({ state, type }) {
  const { emitter, fn } = state
  const map = emitter.maps[type]

  const keys = buildKeys({
    state,
    subscribe: true,
    type,
  })

  const promises = keys.map(key => {
    let promise = onceBase(map, key)

    if (fn) {
      promise = promise.then(async opts => {
        const payload = buildPayload({ opts, state })
        await fn(payload)
        return payload
      })
    } else {
      promise = promise.then(opts =>
        buildPayload({ opts, state })
      )
    }

    return promise
  })

  return Promise.all(promises)
}

export function emitted({ state, type }) {
  const { emitter } = state

  const keys = buildKeys({
    state,
    subscribe: true,
    type,
  })

  const found = keys.find(key =>
    emitter.sets[type].has(key)
  )

  return found
}
