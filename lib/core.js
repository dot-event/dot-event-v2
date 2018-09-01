// Packages
import { EmitterMap, emit, on, once } from "./emitter"

// Helpers
import { parseArgs } from "./args"
import { propsToArray } from "./props"

// Classes
export default class DotEvent {
  constructor() {
    this.maps = new EmitterMap()
    this.anyMaps = new EmitterMap()
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

    Promise.all(
      keys.map(async key => {
        const prepKey = `${prep || ""}${key}`

        await emit(this.maps, prepKey, payload)
        this.emittedKeys[prepKey] = true

        await this.emitAny(prepKey, payload)
      })
    )

    return payload
  }

  async emitAny(key, payload) {
    const { event } = payload

    let promises = []
    const [prep, op] = key.split(":")

    if (event.props) {
      const propsArray = propsToArray(event.props)

      for (let x = 0; x < propsArray.length; x++) {
        const newProps = propsArray
          .slice(0, x + 1)
          .join(".")
        const key = this.eventKey({
          op,
          prep,
          props: newProps,
        })
        promises = promises.concat([
          emit(this.anyMaps, key, payload),
        ])
      }
    }

    promises = promises.concat([
      emit(
        this.anyMaps,
        this.eventKey({
          op,
          prep,
        }),
        payload
      ),
    ])

    await Promise.all(promises)
    return payload
  }

  eventKey({ op = "", prep = "", props = "" }) {
    return `${prep}:${op || ""}:${props || ""}`
  }

  on(...args) {
    const { fn, key, options } = this.subscribeArgs(args)

    return on(this.maps, key, opts =>
      fn({ ...opts, ...options })
    )
  }

  onAny(...args) {
    const { fn, key, options } = this.subscribeArgs(args)

    return on(this.anyMaps, key, opts =>
      fn({ ...opts, ...options })
    )
  }

  once(...args) {
    return this.onceRaw(this.subscribeArgs(args))
  }

  onceRaw({ fn, key, options }) {
    let promise = once(this.maps, key)

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
