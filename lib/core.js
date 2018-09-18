// Helpers
import { emitTypes } from "./build"
import { contextComposer } from "./context"
import { debug } from "./debug"
import { opBase } from "./op"
import { isObject } from "./util"

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

    const context = contextComposer.call({ events: this })

    for (const key in context) {
      this[key] = context[key]
    }

    debug(this)
  }

  setOps(...ops) {
    for (const op of ops) {
      opBase({ op, options: { events: this } })
    }
    return this
  }

  setSyncOps(...ops) {
    for (const op of ops) {
      opBase({ op, options: { events: this }, sync: true })
    }
    return this
  }

  setName(newName) {
    this.name = newName
    return this
  }

  setState(state) {
    if (isObject(state)) {
      this.state = state
    }
    return this
  }
}
