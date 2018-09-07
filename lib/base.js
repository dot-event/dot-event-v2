// Helpers
import { buildKeys } from "./keys"
import { buildPayload } from "./payload"
import {
  emit as emitBase,
  emitSync,
  on as onBase,
  once as onceBase,
} from "./emitter"

export function emit({
  emitTypes,
  payload,
  prep,
  state,
  sync,
}) {
  if (sync) {
    for (const type of emitTypes) {
      emitType({ payload, prep, state, sync, type })
    }
  } else {
    return Promise.all(
      emitTypes.map(
        emitTypesMap.bind({ payload, prep, state, sync })
      )
    )
  }
}

function emitTypesMap(type) {
  const { payload, prep, state, sync } = this
  return emitType({ payload, prep, state, sync, type })
}

export function emitType({
  payload,
  prep,
  state,
  sync,
  type,
}) {
  const { events } = state
  const map = events.maps[type]
  const set = events.sets[type]
  const keys = buildKeys({ prep, state, type })

  if (sync) {
    for (const key of keys) {
      emitSync(map, key, payload)
      set.add(key)
    }
  } else {
    return Promise.all(
      keys.map(emitMap, { map, payload, set })
    )
  }
}

async function emitMap(key) {
  const { map, payload, set } = this
  await emitBase(map, key, payload)
  set.add(key)
}

export function on({ state, type }) {
  const { events, fn } = state
  const map = events.maps[type]

  const keys = buildKeys({
    state,
    subscribe: true,
    type,
  })

  const offs = keys.map(onMap, { fn, map, state })

  return onOff.bind({ offs })
}

function onMap(key) {
  const { fn, map, state } = this
  return onBase(map, key, onMapBase.bind({ fn, state }))
}

function onMapBase(opts) {
  const { fn, state } = this
  return fn(buildPayload({ opts, state }))
}

function onOff() {
  const { offs } = this
  for (const off of offs) {
    off()
  }
}

export function once({ state, type }) {
  const { events, fn } = state
  const map = events.maps[type]

  const keys = buildKeys({
    state,
    subscribe: true,
    type,
  })

  return Promise.all(keys.map(onceMap, { fn, map, state }))
}

function onceMap(key) {
  const { fn, map, state } = this
  const promise = onceBase(map, key)

  if (fn) {
    return promise.then(onceMapFn.bind({ fn, state }))
  } else {
    return promise.then(onceMapPromise.bind({ state }))
  }
}

async function onceMapFn(opts) {
  const { fn, state } = this
  const payload = buildPayload({ opts, state })
  await fn(payload)
  return payload
}

function onceMapPromise(opts) {
  const { state } = this
  return buildPayload({ opts, state })
}

export function emitted({ state, type }) {
  const { events } = state

  const keys = buildKeys({
    state,
    subscribe: true,
    type,
  })

  return keys.find(emittedFind, { events, type })
}

function emittedFind(key) {
  const { events, type } = this
  return events.sets[type].has(key)
}
