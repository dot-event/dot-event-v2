// Helpers
import { buildKeys } from "./keys"
import { buildPayload } from "./payload"
import { emit, emitSerial, on, once } from "./emitter"
import { asyncEmitTypes, syncEmitTypes } from "./build"

export async function emitBase({
  payload,
  prep,
  state,
  sync,
}) {
  if (sync) {
    for (const type of syncEmitTypes) {
      await emitType({ payload, prep, state, sync, type })
    }
  } else {
    await Promise.all(
      asyncEmitTypes.map(
        emitTypesMap.bind({ payload, prep, state, sync })
      )
    )
  }
}

function emitTypesMap(type) {
  const { payload, prep, state, sync } = this
  return emitType({ payload, prep, state, sync, type })
}

export async function emitType({
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
      await emitSerial(map, key, payload)
      set.add(key)
    }
  } else {
    await Promise.all(
      keys.map(emitMap, { map, payload, set })
    )
  }
}

async function emitMap(key) {
  const { map, payload, set } = this
  await emit(map, key, payload)
  set.add(key)
}

export function onBase({ state, type }) {
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
  return on(map, key, onMapBase.bind({ fn, state }))
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

export function onceBase({ state, type }) {
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
  const promise = once(map, key)

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

export function onEmittedBase({ state, type }) {
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
