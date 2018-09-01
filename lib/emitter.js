const resolvedPromise = Promise.resolve()

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

function getListeners(map, eventName) {
  if (!map.has(eventName)) {
    map.set(eventName, new Set())
  }

  return map.get(eventName)
}

export function on(map, eventName, listener) {
  assertEventName(eventName)
  assertListener(listener)
  getListeners(map, eventName).add(listener)
  return off.bind(undefined, map, eventName, listener)
}

export function off(map, eventName, listener) {
  assertEventName(eventName)
  assertListener(listener)
  getListeners(map, eventName).delete(listener)
}

export function once(map, eventName) {
  return new Promise(resolve => {
    assertEventName(eventName)
    const off = on(map, eventName, data => {
      off()
      resolve(data)
    })
  })
}

export async function emit(map, eventName, eventData) {
  assertEventName(eventName)

  const listeners = getListeners(map, eventName)
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
  map,
  eventName,
  eventData
) {
  assertEventName(eventName)

  const listeners = getListeners(map, eventName)
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

export function clearListeners(map, eventName) {
  getListeners(map, eventName).clear()
}
