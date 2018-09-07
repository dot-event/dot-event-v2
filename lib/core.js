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
export default class Events {
  constructor() {
    this.maps = {}
    this.sets = {}

    for (const type of emitTypes) {
      this.maps[type] = new Map()
      this.sets[type] = new Set()
    }

    this.ops = new Set()
    this.opsSync = new Set()

    this.on = buildOn.bind({ events: this, name: "on" })

    this.onAny = buildOn.bind({
      events: this,
      name: "onAny",
    })

    this.onEmitted = buildEmitted.bind({
      events: this,
      name: "onEmitted",
    })

    this.onAnyEmitted = buildEmitted.bind({
      events: this,
      name: "onAnyEmitted",
    })

    this.once = buildOnce.bind({
      events: this,
      name: "once",
    })

    this.onceAny = buildOnce.bind({
      events: this,
      name: "onceAny",
    })

    this.onceEmitted = buildOnceEmitted.bind({
      events: this,
      name: "onceEmitted",
    })

    this.onceAnyEmitted = buildOnceEmitted.bind({
      events: this,
      name: "onceAnyEmitted",
    })
  }

  op(...ops) {
    return opBase({ events: this, ops })
  }

  opSync(...ops) {
    return opBase({ events: this, ops, sync: true })
  }

  async emit(...args) {
    const state = initState({ args, events: this })
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
    const state = initState({ args, events: this })
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
