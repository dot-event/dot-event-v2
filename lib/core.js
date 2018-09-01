// Helpers
import { subscribeArgs } from "./args"
import { emitAny } from "./emit"
import { EmitterMap, emit, on } from "./emitter"
import { addBasePayload } from "./payload"
import { onceRaw } from "./once"
import { operate } from "./operate"

// Classes
export default class DotEvent {
  constructor() {
    this.maps = new EmitterMap()
    this.anyMaps = new EmitterMap()
    this.emittedKeys = new Set()
    this.anyEmittedKeys = new Set()
    this.ops = new Set()
  }

  op(...newOps) {
    for (const op of newOps) {
      if (!this.ops.has(op)) {
        this.ops.add(op)
        this[op] = (...args) =>
          operate({ args, emitter: this, op })
      }
    }
  }

  async emit({ payload, prep }) {
    const { keys } = payload.event

    Promise.all(
      keys.map(async key => {
        const prepKey = `${prep || ""}${key}`

        await emit(this.maps, prepKey, payload)
        this.emittedKeys.add(prepKey)

        await emitAny({
          emitter: this,
          key: prepKey,
          payload,
        })
      })
    )

    return payload
  }

  on(...args) {
    const { fn, key, options } = subscribeArgs(args, this)

    return on(this.maps, key, opts =>
      fn({ ...opts, ...options })
    )
  }

  onAny(...args) {
    const { fn, key, options } = subscribeArgs(args, this)

    return on(this.anyMaps, key, opts =>
      fn({ ...opts, ...options })
    )
  }

  once(...args) {
    return onceRaw(subscribeArgs(args, this))
  }

  onceEmitted(...args) {
    const {
      extras,
      fn,
      key,
      op,
      options,
      prep,
      props,
    } = subscribeArgs(args, this)

    if (this.emittedKeys.has(key)) {
      const payload = addBasePayload({
        emitter: this,
        extras,
        op,
        options,
        prep,
        props,
      })
      return Promise.resolve(fn(payload) || payload)
    } else {
      return onceRaw({ emitter: this, fn, key, options })
    }
  }

  onceAnyEmitted(...args) {
    const {
      extras,
      fn,
      key,
      op,
      options,
      prep,
      props,
    } = subscribeArgs(args, this)

    if (this.anyEmittedKeys.has(key)) {
      const payload = addBasePayload({
        emitter: this,
        extras,
        op,
        options,
        prep,
        props,
      })
      return Promise.resolve(fn(payload) || payload)
    } else {
      return onceRaw({ emitter: this, fn, key, options })
    }
  }
}
