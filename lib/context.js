import { opBase } from "./op"
import {
  emit,
  onEmitted,
  on,
  once,
  onceEmitted,
} from "./build"

// Helpers
export function contextComposer() {
  const opts = this
  return {
    after: contextComposer.bind({ ...opts, prep: "after" }),

    before: contextComposer.bind({
      ...opts,
      prep: "before",
    }),

    emit: emit.bind(opts),

    on: on.bind({ ...opts, name: "on" }),

    onAny: on.bind({ ...opts, name: "onAny" }),

    onAnyEmitted: onEmitted.bind({
      ...opts,
      name: "onAnyEmitted",
    }),

    onEmitted: onEmitted.bind({
      ...opts,
      name: "onEmitted",
    }),

    once: once.bind({ ...opts, name: "once" }),

    onceAny: once.bind({ ...opts, name: "onceAny" }),

    onceAnyEmitted: onceEmitted.bind({
      ...opts,
      name: "onceAnyEmitted",
    }),

    onceEmitted: onceEmitted.bind({
      ...opts,
      name: "onceEmitted",
    }),

    sync: contextComposer.bind({
      ...opts,
      sync: true,
    }),

    withOp: op => {
      opBase({ op, options: opts })
      return contextComposer.call({ ...opts, op })
    },

    withOptions: options =>
      contextComposer.call({ ...opts, options }),
  }
}
