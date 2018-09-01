// Helpers
import { parseArgs } from "./args"
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
    const { fn, key, options } = parseArgs({
      args,
      emitter: this,
    })

    return on(this.maps, key, opts =>
      fn({ ...opts, ...options })
    )
  }

  onAny(...args) {
    const { fn, key, options } = parseArgs({
      args,
      emitter: this,
    })

    return on(this.anyMaps, key, opts =>
      fn({ ...opts, ...options })
    )
  }

  once(...args) {
    return onceRaw(parseArgs({ args, emitter: this }))
  }

  onceEmitted(...args) {
    const options = parseArgs({ args, emitter: this })
    const { fn, key } = options

    if (this.emittedKeys.has(key)) {
      const payload = addBasePayload({
        emitter: this,
        ...options,
      })
      return Promise.resolve(fn(payload) || payload)
    } else {
      return onceRaw(options)
    }
  }

  onceAnyEmitted(...args) {
    const options = parseArgs({ args, emitter: this })
    const { fn, key } = options

    if (this.anyEmittedKeys.has(key)) {
      const payload = addBasePayload({
        emitter: this,
        ...options,
      })
      return Promise.resolve(fn(payload) || payload)
    } else {
      return onceRaw(options)
    }
  }
}
