// Packages
import Emitter from "./emitter"

// Helpers
import { parseArgs } from "./args"

// Classes
export default class DotEvent extends Emitter {
  constructor() {
    super()
    this.firstKeys = {}
    this.ops = []
  }

  op(...newOps) {
    for (const op of newOps) {
      if (this.ops.indexOf(op) < 0) {
        this.ops = this.ops.concat([op])
        this[op] = (...args) => this.operate({ args, op })
      }
    }
  }

  async operate({ args, op }) {
    const { extras, prep, props, options } = parseArgs({
      args,
    })

    const basePayload = {
      event: {
        emitter: this,
        extras,
        keys: [this.eventKey({ op, props })],
        op,
        prep,
        props,
      },
    }

    const beforePayload = await this.emit(
      "before",
      options,
      basePayload
    )

    const event = beforePayload.event

    if (event && event.cancel) {
      return beforePayload
    }

    const opPayload = await this.emit(
      "op",
      beforePayload,
      basePayload
    )

    const afterPayload = await this.emit(
      "after",
      opPayload,
      basePayload
    )

    return afterPayload
  }

  async emit(prep, payload = {}, basePayload = {}) {
    const { event } = payload

    const { keys } =
      event && event.keys ? event : basePayload.event

    const emitPayload = {
      ...payload,
      ...basePayload,
    }

    Promise.all(
      keys.map(key =>
        super.emit(`${prep}:${key}`, emitPayload)
      )
    )

    return emitPayload
  }

  eventKey({ op, prep, props }) {
    return `${prep ? prep + ":" : ""}${op || ""}${
      props ? ":" + props : ""
    }`
  }

  on(...args) {
    const { fn, key, options } = this.subscribeArgs(args)

    return super.on(key, opts =>
      fn({ ...opts, ...options })
    )
  }

  once(...args) {
    return this.onceRaw(this.susbcribeArgs(args))
  }

  onceRaw({ fn, key, options }) {
    let promise = super.once(key)

    if (fn) {
      promise = promise.then(opts =>
        fn({ ...opts, ...options })
      )
    } else {
      promise = promise.then(opts => ({
        ...opts,
        ...options,
      }))
    }

    return promise
  }

  onceFirst(...args) {
    const { fn, key, options } = this.susbcribeArgs(args)

    if (this.firstKeys[key]) {
      return Promise.resolve(fn(options))
    } else {
      return this.onceRaw({
        fn: opts => {
          this.firstKeys[key] = true
          return fn(opts)
        },
        key,
        options,
      })
    }
  }

  subscribeArgs(args) {
    const {
      extras,
      fn,
      op,
      options,
      prep,
      props,
    } = parseArgs({
      args,
      ops: this.ops,
    })

    const key = this.eventKey({ op, prep, props })

    return { extras, fn, key, op, options, prep, props }
  }
}
