import { emit } from "./build"

export function opBase({ op, options }) {
  const { events } = options
  const set = events.ops

  if (!set.has(op)) {
    set.add(op)

    const emitOp = emit.bind({ ...options, op })
    const emitBase = emit.bind({ ...options })

    events[op] = async (...opts) => {
      const opOut = await emitOp(...opts)
      const baseOut = await emitBase(...opts)

      return opOut || baseOut
    }
  }
}
