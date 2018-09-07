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

    this.ops = new Set()
    this.opsSync = new Set()

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

    await emit({
      emitTypes,
      payload,
      prep: "before",
      state,
    })

    if (payload.event.cancel) {
      return payload
    }

    await emit({ emitTypes, payload, state })

    if (payload.event.cancel) {
      return payload
    }

    await emit({ emitTypes, payload, prep: "after", state })

    return payload.event.returnValue
  }

  emitSync(...args) {
    const state = initState({ args, emitter: this })
    const payload = buildPayload({ emit: true, state })

    emit({
      emitTypes,
      payload,
      prep: "before",
      state,
      sync: true,
    })

    if (payload.event.cancel) {
      return payload
    }

    emit({ emitTypes, payload, state, sync: true })

    if (payload.event.cancel) {
      return payload
    }

    emit({
      emitTypes,
      payload,
      prep: "after",
      state,
      sync: true,
    })

    return payload.event.returnValue
  }
}
