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
  static composer(events = new Events()) {
    return events
  }

  constructor(options = {}) {
    this.name = "events"
    this.state = options.state || {}

    this.ops = new Set()
    this.opsSync = new Set()

    this.maps = {}
    this.sets = {}

    for (const type of emitTypes) {
      this.maps[type] = new Map()
      this.sets[type] = new Set()
    }

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

  async emit(...args) {
    const state = initState({ args, events: this })
    const payload = buildPayload({ emit: true, state })

    await emit({
      emitTypes,
      payload,
      prep: "before",
      state,
    })

    if (payload.event.signal.cancel) {
      return payload
    }

    await emit({ emitTypes, payload, state })

    if (payload.event.signal.cancel) {
      return payload
    }

    await emit({ emitTypes, payload, prep: "after", state })

    return payload.event.signal.returnValue
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

    if (payload.event.signal.cancel) {
      return payload
    }

    emit({ emitTypes, payload, state, sync: true })

    if (payload.event.signal.cancel) {
      return payload
    }

    emit({
      emitTypes,
      payload,
      prep: "after",
      state,
      sync: true,
    })

    return payload.event.signal.returnValue
  }

  setName(newName) {
    this.name = newName
    return this
  }

  setOps(...ops) {
    opBase({ events: this, ops })
    return this
  }

  setOpsSync(...ops) {
    opBase({ events: this, ops, sync: true })
    return this
  }

  setState(state) {
    if (state && typeof state === "object") {
      this.state = state
    }
    return this
  }
}
