// Helpers
import { initState } from "./args"
import { emit } from "./base"
import { opBase } from "./op"
import { buildPayload } from "./payload"
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

    this.on = buildOn.bind({ emitter: this, name: "on" })

    this.onAny = buildOn.bind({
      emitter: this,
      name: "onAny",
    })

    this.onEmitted = buildEmitted.bind({
      emitter: this,
      name: "onEmitted",
    })

    this.onAnyEmitted = buildEmitted.bind({
      emitter: this,
      name: "onAnyEmitted",
    })

    this.once = buildOnce.bind({
      emitter: this,
      name: "once",
    })

    this.onceAny = buildOnce.bind({
      emitter: this,
      name: "onceAny",
    })

    this.onceEmitted = buildOnceEmitted.bind({
      emitter: this,
      name: "onceEmitted",
    })

    this.onceAnyEmitted = buildOnceEmitted.bind({
      emitter: this,
      name: "onceAnyEmitted",
    })

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
    const payload = buildPayload({ emit: true, state })

    await this.emitTypes({ payload, prep: "before", state })

    if (payload.event.cancel) {
      return payload
    }

    await this.emitTypes({ payload, state })

    if (payload.event.cancel) {
      return payload
    }

    await this.emitTypes({ payload, prep: "after", state })

    return payload.event.returnValue
  }

  emitSync(...args) {
    const state = initState({ args, emitter: this })
    const payload = buildPayload({ emit: true, state })

    this.emitTypes({
      payload,
      prep: "before",
      state,
      sync: true,
    })

    if (payload.event.cancel) {
      return payload
    }

    this.emitTypes({ payload, state, sync: true })

    if (payload.event.cancel) {
      return payload
    }

    this.emitTypes({
      payload,
      prep: "after",
      state,
      sync: true,
    })

    return payload.event.returnValue
  }

  emitTypes({ state, payload, prep, sync }) {
    if (sync) {
      for (const type of emitTypes) {
        emit({ payload, prep, state, sync, type })
      }
    } else {
      return Promise.all(
        emitTypes.map(type =>
          emit({ payload, prep, state, sync, type })
        )
      )
    }
  }
}
