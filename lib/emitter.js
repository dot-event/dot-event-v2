const eventsMap = new WeakMap()
const resolvedPromise = Promise.resolve()

export class EmitterMap {
  constructor() {
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
  const staticListeners = [...listeners]

  await resolvedPromise
  return Promise.all([
    ...staticListeners.map(async listener => {
      if (listeners.has(listener)) {
        return listener(eventData)
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
  const staticListeners = [...listeners]

  await resolvedPromise
  /* eslint-disable no-await-in-loop */
  for (const listener of staticListeners) {
    if (listeners.has(listener)) {
      await listener(eventData)
    }
  }
  /* eslint-enable no-await-in-loop */
}

export function clearListeners(maps, eventName) {
  getListeners(maps, eventName).clear()
}

export function listenerCount(maps, eventName) {
  assertEventName(eventName)

  let count = 0

  for (const value of eventsMap.get(maps).values()) {
    count += value.size
  }

  return count
}
