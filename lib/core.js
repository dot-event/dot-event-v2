// Helpers
import { emitTypes } from "./build"
import { contextComposer } from "./context"
import { debug } from "./debug"
import { opBase } from "./op"

// Classes
export default function(options) {
  return new Events(options)
}

export class Events {
  constructor({ name = "events" } = {}) {
    this.name = name
    this.ops = new Set()

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

  setName(newName) {
    this.name = newName
    return this
  }
}
