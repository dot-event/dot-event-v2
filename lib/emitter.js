const anyMap = new WeakMap()
const eventsMap = new WeakMap()
const resolvedPromise = Promise.resolve()

export class EmitterMaps {
  constructor() {
    anyMap.set(this, new Set())
    eventsMap.set(this, new Map())
  }
}

function assertEventName(eventName) {
  if (typeof eventName !== "string") {
    throw new TypeError("eventName must be a string")
  }
}

function assertListener(listener) {
  if (typeof listener !== "function") {
    throw new TypeError("listener must be a function")
  }
}

function getListeners(instance, eventName) {
  const events = eventsMap.get(instance)
  if (!events.has(eventName)) {
    events.set(eventName, new Set())
  }

  return events.get(eventName)
}

export function on(maps, eventName, listener) {
  assertEventName(eventName)
  assertListener(listener)
  getListeners(maps, eventName).add(listener)
  return off.bind(undefined, maps, eventName, listener)
}

export function off(maps, eventName, listener) {
  assertEventName(eventName)
  assertListener(listener)
  getListeners(maps, eventName).delete(listener)
}

export function once(maps, eventName) {
  return new Promise(resolve => {
    assertEventName(eventName)
    const off = on(maps, eventName, data => {
      off()
      resolve(data)
    })
  })
}

export async function emit(maps, eventName, eventData) {
  assertEventName(eventName)

  const listeners = getListeners(maps, eventName)
  const anyListeners = anyMap.get(maps)
  const staticListeners = [...listeners]
  const staticAnyListeners = [...anyListeners]

  await resolvedPromise
  return Promise.all([
    ...staticListeners.map(async listener => {
      if (listeners.has(listener)) {
        return listener(eventData)
      }
    }),
    ...staticAnyListeners.map(async listener => {
      if (anyListeners.has(listener)) {
        return listener(eventName, eventData)
      }
    }),
  ])
}

export async function emitSerial(
  maps,
  eventName,
  eventData
) {
  assertEventName(eventName)

  const listeners = getListeners(maps, eventName)
  const anyListeners = anyMap.get(maps)
  const staticListeners = [...listeners]
  const staticAnyListeners = [...anyListeners]

  await resolvedPromise
  /* eslint-disable no-await-in-loop */
  for (const listener of staticListeners) {
    if (listeners.has(listener)) {
      await listener(eventData)
    }
  }

  for (const listener of staticAnyListeners) {
    if (anyListeners.has(listener)) {
      await listener(eventName, eventData)
    }
  }
  /* eslint-enable no-await-in-loop */
}

export function onAny(maps, listener) {
  assertListener(listener)
  anyMap.get(maps).add(listener)
  return offAny.bind(undefined, maps, listener)
}

export function offAny(maps, listener) {
  assertListener(listener)
  anyMap.get(maps).delete(listener)
}

export function clearListeners(maps, eventName) {
  if (typeof eventName === "string") {
    getListeners(maps, eventName).clear()
  } else {
    anyMap.get(maps).clear()
    for (const listeners of eventsMap.get(maps).values()) {
      listeners.clear()
    }
  }
}

export function listenerCount(maps, eventName) {
  if (typeof eventName === "string") {
    return (
      anyMap.get(maps).size +
      getListeners(maps, eventName).size
    )
  }

  if (typeof eventName !== "undefined") {
    assertEventName(eventName)
  }

  let count = anyMap.get(maps).size

  for (const value of eventsMap.get(maps).values()) {
    count += value.size
  }

  return count
}
