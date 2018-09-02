// Helpers
import { parseArgs } from "./args"
import { emit, on } from "./emitter"
import { eventKey } from "./key"
import { multi } from "./multi"
import { onceRaw } from "./once"
import { addBasePayload } from "./payload"
import { propsToArray } from "./props"

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
        this[op] = (...args) => this.emit(op, ...args)
      }
    }
  }

  async emit(op, ...args) {
    const { extras, props, options } = parseArgs({
      args,
    })

    const payload = addBasePayload({
      emitter: this,
      extras,
      op,
      options,
      props,
    })

    await this.emitAll(payload, "before")

    if (payload.event.cancel) {
      return payload
    }

    await this.emitAll(payload)

    if (payload.event.cancelAfter) {
      return payload
    }

    await this.emitAll(payload, "after")

    return payload
  }

  async emitAll(payload, prep) {
    await Promise.all(
      [...payload.event.keys].map(async key => {
        await this.emitKey(key, payload, prep)
      })
    )

    await this.emitAny(payload, prep)

    return payload
  }

  async emitAny(payload, prep = "") {
    const { event } = payload
    const { op } = event

    const keys = new Set([
      eventKey({ prep }),
      eventKey({ op, prep }),
    ])

    if (event.props) {
      const propsArray = propsToArray(event.props)

      for (let x = 0; x < propsArray.length; x++) {
        const newProps = propsArray
          .slice(0, x + 1)
          .join(".")

        const key = eventKey({
          op,
          prep,
          props: newProps,
        })

        keys.add(key)
      }
    }

    await Promise.all(
      [...keys].map(async key => {
        await emit(this.anyMap, key, payload)
        this.anyEmittedKeys.add(key)
      })
    )

    return payload
  }

  async emitKey(key, payload, prep = "") {
    key = `${prep}${key}`
    await emit(this.map, key, payload)
    this.emittedKeys.add(key)
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
