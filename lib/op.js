import { emit, emitSync } from "./build"

export function opBase({ op, options, sync }) {
  const { events } = options
  const set = sync ? events.opsSync : events.ops

  if (!set.has(op)) {
    set.add(op)
    events[op] = (sync ? emitSync : emit).bind({
      ...options,
      op,
    })
  }
}
