// Helpers
import { parseArgs } from "./args"
import { emit, on } from "./emitter"
import { anyKeys } from "./keys"
import { multi } from "./multi"
import { onceBase } from "./once"
import { addBasePayload } from "./payload"

// Classes
export default class DotEvent {
  constructor() {
    this.anyMap = new Map()
    this.onMap = new Map()
    this.onSet = new Set()
    this.anySet = new Set()
    this.ops = new Set()
  }

  op(...newOps) {
    for (const op of newOps) {
      if (!this.ops.has(op)) {
        this.ops.add(op)
        this[op] = (...args) => this.emit(op, ...args)
      }
    }
  }

  async emit(...args) {
    const { extras, props, op, options } = parseArgs({
      args,
      emitter: this,
    })

    const payload = addBasePayload({
      emitter: this,
      extras,
      op,
      options,
      props,
    })

    await this.emitAnyOn(payload, "before")

    if (payload.event.cancel) {
      return payload
    }

    await this.emitAnyOn(payload)

    if (payload.event.cancel) {
      return payload
    }

    await this.emitAnyOn(payload, "after")

    return payload
  }

  async emitAnyOn(payload, prep) {
    await this.emitOn(payload, prep)
    return await this.emitAny(payload, prep)
  }

  async emitAny(payload, prep = "") {
    const keys = await anyKeys({ payload, prep })

    await Promise.all(
      keys.map(async key => {
        await emit(this.anyMap, key, payload)
        this.anySet.add(key)
      })
    )

    return payload
  }

  async emitKey(key, payload, prep = "") {
    key = `${prep}${key}`
    await emit(this.onMap, key, payload)
    this.onSet.add(key)
    return payload
  }

  async emitOn(payload, prep) {
    await Promise.all(
      [...payload.event.keys].map(async key => {
        await this.emitKey(key, payload, prep)
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

    return on(this.onMap, key, opts =>
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

    return onceBase(
      "on",
      parseArgs({ args, emitter: this })
    )
  }

  onceAny(...args) {
    if (Array.isArray(args[0])) {
      return multi(this, "once", args[0])
    }

    return onceBase(
      "any",
      parseArgs({ args, emitter: this })
    )
  }

  onceEmitted(...args) {
    if (Array.isArray(args[0])) {
      return multi(this, "onceEmitted", args[0])
    }

    const options = parseArgs({ args, emitter: this })
    const { fn, key } = options

    if (this.onSet.has(key)) {
      const payload = addBasePayload({
        emitter: this,
        ...options,
      })
      return Promise.resolve(fn(payload) || payload)
    } else {
      return onceBase("on", options)
    }
  }

  onceAnyEmitted(...args) {
    if (Array.isArray(args[0])) {
      return multi(this, "onceAnyEmitted", args[0])
    }

    const options = parseArgs({ args, emitter: this })
    const { fn, key } = options

    if (this.anySet.has(key)) {
      const payload = addBasePayload({
        emitter: this,
        ...options,
      })
      return Promise.resolve(fn(payload) || payload)
    } else {
      return onceBase("any", options)
    }
  }
}
