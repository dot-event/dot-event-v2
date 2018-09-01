// Helpers
import { subscribeArgs } from "./args"
import { EmitterMap, emit, on } from "./emitter"
import { eventKey } from "./key"
import { basePayload } from "./payload"
import { propsToArray } from "./props"
import { onceRaw } from "./once"
import { operate } from "./operate"

// Classes
export default class DotEvent {
  constructor() {
    this.maps = new EmitterMap()
    this.anyMaps = new EmitterMap()
    this.emittedKeys = {}
    this.ops = []
  }

  op(...newOps) {
    for (const op of newOps) {
      if (this.ops.indexOf(op) < 0) {
        this.ops = this.ops.concat([op])
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
        const key = eventKey({
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
        eventKey({
          op,
          prep,
        }),
        payload
      ),
    ])

    await Promise.all(promises)
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

    if (this.emittedKeys[key]) {
      const base = basePayload({
        emitter: this,
        extras,
        op,
        prep,
        props,
      })
      const payload = { ...options, ...base }
      return Promise.resolve(fn(payload) || payload)
    } else {
      return onceRaw({ emitter: this, fn, key, options })
    }
  }
}
