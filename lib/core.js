// Helpers
import { initState } from "./args"
import { emit, emitted, on, once } from "./base"
import { multi } from "./multi"
import { opBase } from "./op"

// Constants
const emitTypes = ["any", "on"]

// Classes
export default class DotEvent {
  constructor() {
    this.maps = {}
    this.sets = {}

    for (const type of emitTypes) {
      this.maps[type] = new Map()
      this.sets[type] = new Set()
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

    await this.emitTypes({ prep: "before", state })

    if (payload.event.cancel) {
      return payload
    }

    await this.emitTypes({ state })

    if (payload.event.cancel) {
      return payload
    }

    await this.emitTypes({ prep: "after", state })

    return payload.event.returnValue
  }

  emitSync(...args) {
    const state = initState({
      args,
      callee: "emitSync",
      emitter: this,
    })

    const { payload } = state

    this.emitTypes({ prep: "before", state, sync: true })

    if (payload.event.cancel) {
      return payload
    }

    this.emitTypes({ state, sync: true })

    if (payload.event.cancel) {
      return payload
    }

    this.emitTypes({ prep: "after", state, sync: true })

    return payload.event.returnValue
  }

  emitTypes({ state, prep, sync }) {
    if (sync) {
      for (const type of emitTypes) {
        emit({ prep, state, sync, type })
      }
    } else {
      return Promise.all(
        emitTypes.map(type =>
          emit({ prep, state, sync, type })
        )
      )
    }
  }

  on(...args) {
    if (Array.isArray(args[0])) {
      return multi(this, "on", args[0])
    }

    const state = initState({ args, emitter: this })

    return on({ state, type: "on" })
  }

  onAny(...args) {
    if (Array.isArray(args[0])) {
      return multi(this, "onAny", args[0])
    }

    const state = initState({ args, emitter: this })

    return on({ state, type: "any" })
  }

  onEmitted(...args) {
    if (Array.isArray(args[0])) {
      return multi(this, "onEmitted", args[0])
    }

    const state = initState({ args, emitter: this })
    const { fn, payload } = state
    const type = "on"

    return emitted({ state, type }, found => {
      if (found) {
        fn(payload)
      }
      return on({ state, type })
    })
  }

  onAnyEmitted(...args) {
    if (Array.isArray(args[0])) {
      return multi(this, "onAnyEmitted", args[0])
    }

    const state = initState({ args, emitter: this })
    const { fn, payload } = state
    const type = "any"

    return emitted({ state, type }, found => {
      if (found) {
        fn(payload)
      }
      return on({ state, type })
    })
  }

  once(...args) {
    if (Array.isArray(args[0])) {
      return multi(this, "once", args[0])
    }

    const state = initState({ args, emitter: this })

    return once({ state, type: "on" })
  }

  onceAny(...args) {
    if (Array.isArray(args[0])) {
      return multi(this, "onceAny", args[0])
    }

    const state = initState({ args, emitter: this })
    return once({ state, type: "any" })
  }

  onceEmitted(...args) {
    if (Array.isArray(args[0])) {
      return multi(this, "onceEmitted", args[0])
    }

    const state = initState({ args, emitter: this })
    const { fn, payload } = state
    const type = "on"

    return emitted({ state, type }, found => {
      if (found) {
        return (async () => {
          await fn(payload)
          return payload
        })()
      } else {
        return once({ state, type })
      }
    })
  }

  onceAnyEmitted(...args) {
    if (Array.isArray(args[0])) {
      return multi(this, "onceAnyEmitted", args[0])
    }

    const state = initState({ args, emitter: this })
    const { fn, payload } = state
    const type = "any"

    return emitted({ state, type }, found => {
      if (found) {
        return (async () => {
          await fn(payload)
          return payload
        })()
      } else {
        return once({ state, type })
      }
    })
  }
}
