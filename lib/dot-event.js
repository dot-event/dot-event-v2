// Helpers
import { emitTypes } from "./dot-event/build"
import { contextComposer } from "./dot-event/context"
import { opBase } from "./dot-event/op"

// Classes
export default function(options) {
  return new Events(options)
}

export class Events {
  constructor({
    defaultOptions = {},
    name = "events",
  } = {}) {
    this.defaultOptions = defaultOptions
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
  }

  setDefaultOptions(options) {
    this.defaultOptions = {
      ...this.defaultOptions,
      ...options,
    }
    return this
  }

  setOp(op) {
    opBase({ op, options: { events: this } })
    return this
  }

  setOps(...ops) {
    for (const op of ops) {
      this.setOp(op)
    }
    return this
  }

  setName(newName) {
    this.name = newName
    return this
  }
}
