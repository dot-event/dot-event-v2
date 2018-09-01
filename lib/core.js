// Packages
import Emitter from "./emitter"

// Helpers
import { parseArgs } from "./args"

// Classes
export default class DotEvent extends Emitter {
  constructor() {
    super()
    this.emittedKeys = {}
    this.ops = []
  }

  basePayload({ extras, op, prep, props }) {
    return {
      event: {
        emitter: this,
        extras,
        keys: [this.eventKey({ op, props })],
        op,
        prep,
        props,
      },
    }
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

    const basePayload = this.basePayload({
      extras,
      op,
      prep,
      props,
    })

    const payload = { ...options, ...basePayload }

    await this.emit({ payload, prep: "before" })

    if (payload.event.cancel) {
      return payload
    }

    await this.emit({ payload })

    if (payload.event.cancelAfter) {
      return payload
    }

    await this.emit({ payload, prep: "after" })

    return payload
  }

  async emit({ payload, prep }) {
    const { keys } = payload.event

    prep = prep ? `${prep}:` : ""

    Promise.all(
      keys.map(key => {
        const prepKey = `${prep}${key}`
        const promise = super.emit(prepKey, payload)
        this.emittedKeys[prepKey] = true
        return promise
      })
    )

    return payload
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
    return this.onceRaw(this.subscribeArgs(args))
  }

  onceRaw({ fn, key, options }) {
    let promise = super.once(key)

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

  onceEmitted(...args) {
    const {
      extras,
      fn,
      key,
      op,
      options,
      prep,
      props,
    } = this.subscribeArgs(args)

    if (this.emittedKeys[key]) {
      const basePayload = this.basePayload({
        extras,
        op,
        prep,
        props,
      })
      const payload = { ...options, ...basePayload }
      return Promise.resolve(fn(payload) || payload)
    } else {
      return this.onceRaw({ fn, key, options })
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
