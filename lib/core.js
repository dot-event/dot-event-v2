// Helpers
import { parseArgs } from "./args"
import { emitAny } from "./emit"
import { emit, on } from "./emitter"
import { multi } from "./multi"
import { onceRaw } from "./once"
import { operate } from "./operate"
import { addBasePayload } from "./payload"

// Classes
export default class DotEvent {
  constructor() {
    this.map = new Map()
    this.anyMap = new Map()
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

        await emit(this.map, prepKey, payload)
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
    if (Array.isArray(args[0])) {
      return multi(this, "on", args[0])
    }

    const { fn, key, options } = parseArgs({
      args,
      emitter: this,
    })

    return on(this.map, key, opts =>
      fn({ ...opts, ...options })
    )
  }

  onAny(...args) {
    if (Array.isArray(args[0])) {
      return multi(this, "onAny", args[0])
    }

    const { fn, key, options } = parseArgs({
      args,
      emitter: this,
    })

    return on(this.anyMap, key, opts =>
      fn({ ...opts, ...options })
    )
  }

  once(...args) {
    if (Array.isArray(args[0])) {
      return multi(this, "once", args[0])
    }

    return onceRaw(parseArgs({ args, emitter: this }))
  }

  onceEmitted(...args) {
    if (Array.isArray(args[0])) {
      return multi(this, "onceEmitted", args[0])
    }

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
    if (Array.isArray(args[0])) {
      return multi(this, "onceAnyEmitted", args[0])
    }

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
