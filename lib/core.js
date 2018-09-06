// Helpers
import { initState } from "./args"
import { emit } from "./base"
import { opBase } from "./op"
import {
  buildEmitted,
  buildOn,
  buildOnce,
  buildOnceEmitted,
} from "./build"

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

    this.on = buildOn(this, "on")
    this.onAny = buildOn(this, "onAny")
    this.onEmitted = buildEmitted(this, "onEmitted")
    this.onAnyEmitted = buildEmitted(this, "onAnyEmitted")
    this.once = buildOnce(this, "once")
    this.onceAny = buildOnce(this, "onceAny")
    this.onceEmitted = buildOnceEmitted(this, "onceEmitted")
    this.onceAnyEmitted = buildOnceEmitted(
      this,
      "onceAnyEmitted"
    )

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
    const state = initState({ args, emitter: this })
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
    const state = initState({ args, emitter: this })
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
}
