// Helpers
import { initState } from "./args"
import { emit, emitSync, on, once } from "./emitter"
import { multi } from "./multi"
import { opBase } from "./op"

// Constants
const emitTypes = ["any", "on"]

// Classes
export default class DotEvent {
  constructor() {
    for (const type of emitTypes) {
      this[`${type}Map`] = new Map()
      this[`${type}Set`] = new Set()
    }

    this.ops = new Set()
    this.opsSync = new Set()
  }

  op(...ops) {
    return opBase({ emitter: this, ops })
  }

  opSync(...ops) {
    return opBase({ emitter: this, ops, sync: true })
  }

  async emit(...args) {
    const state = initState({
      args,
      callee: "emit",
      emitter: this,
    })

    const { payload } = state

    await this.emitAllTypes({ prep: "before", state })

    if (payload.event.cancel) {
      return payload
    }

    await this.emitAllTypes({ state })

    if (payload.event.cancel) {
      return payload
    }

    await this.emitAllTypes({ prep: "after", state })

    return payload.event.returnValue
  }

  emitSync(...args) {
    const state = initState({
      args,
      callee: "emitSync",
      emitter: this,
    })

    const { payload } = state

    this.emitAllTypes({ prep: "before", state, sync: true })

    if (payload.event.cancel) {
      return payload
    }

    this.emitAllTypes({ state, sync: true })

    if (payload.event.cancel) {
      return payload
    }

    this.emitAllTypes({ prep: "after", state, sync: true })

    return payload.event.returnValue
  }

  emitAllTypes({ state, prep, sync }) {
    if (sync) {
      for (const type of emitTypes) {
        this.emitType({ prep, state, sync, type })
      }
    } else {
      return Promise.all(
        emitTypes.map(type =>
          this.emitType({ prep, state, sync, type })
        )
      )
    }
  }

  emitType({ state, prep, sync, type }) {
    const { payload } = state
    const keys = state[`${type}Keys`]({ prep })
    const map = this[`${type}Map`]
    const set = this[`${type}Set`]

    if (sync) {
      for (const key of keys) {
        emitSync(map, key, payload)
        set.add(key)
      }
    } else {
      return Promise.all(
        keys.map(async key => {
          await emit(map, key, payload)
          set.add(key)
        })
      )
    }
  }

  on(...args) {
    if (Array.isArray(args[0])) {
      return multi(this, "on", args[0])
    }

    const state = initState({ args, emitter: this })

    return this.onType({ state, type: "on" })
  }

  onType({ state, type }) {
    const { fn, options, prep } = state
    const map = this[`${type}Map`]
    const keys = state[`${type}Keys`]({
      prep,
      subscribe: true,
    })

    const offs = keys.map(key =>
      on(map, key, opts => fn({ ...opts, ...options }))
    )

    return () => {
      for (const off of offs) {
        off()
      }
    }
  }

  onceType({ state, type }) {
    const { fn, options, prep } = state
    const map = this[`${type}Map`]
    const keys = state[`${type}Keys`]({
      prep,
      subscribe: true,
    })

    const promises = keys.map(key => {
      let promise = once(map, key)

      if (fn) {
        promise = promise.then(async opts => {
          const opt = { ...opts, ...options }
          await fn(opt)
          return opt
        })
      } else {
        promise = promise.then(opts => ({
          ...opts,
          ...options,
        }))
      }

      return promise
    })

    return Promise.all(promises)
  }

  onAny(...args) {
    if (Array.isArray(args[0])) {
      return multi(this, "onAny", args[0])
    }

    const state = initState({ args, emitter: this })

    return this.onType({ state, type: "any" })
  }

  once(...args) {
    if (Array.isArray(args[0])) {
      return multi(this, "once", args[0])
    }

    const state = initState({ args, emitter: this })

    return this.onceType({ state, type: "on" })
  }

  onceAny(...args) {
    if (Array.isArray(args[0])) {
      return multi(this, "once", args[0])
    }

    const state = initState({ args, emitter: this })
    return this.onceType({ state, type: "any" })
  }

  onceEmitted(...args) {
    if (Array.isArray(args[0])) {
      return multi(this, "onceEmitted", args[0])
    }

    const state = initState({ args, emitter: this })
    const { fn, anyKeys, payload, prep } = state
    const keys = anyKeys({ prep, subscribe: true })
    const found = keys.find(key => this.onSet.has(key))

    if (found) {
      return (async () => {
        await fn(payload)
        return payload
      })()
    } else {
      return this.onceType({ state, type: "on" })
    }
  }

  onceAnyEmitted(...args) {
    if (Array.isArray(args[0])) {
      return multi(this, "onceAnyEmitted", args[0])
    }

    const state = initState({ args, emitter: this })
    const { anyKeys, fn, payload, prep } = state
    const keys = anyKeys({ prep, subscribe: true })
    const found = keys.find(key => this.anySet.has(key))

    if (found) {
      return (async () => {
        await fn(payload)
        return payload
      })()
    } else {
      return this.onceType({ state, type: "any" })
    }
  }
}
