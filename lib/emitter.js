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
  return new Promise(oncePromise.bind({ eventName, map }))
}

function oncePromise(resolve) {
  const { eventName, map } = this
  assertEventName(eventName)
  const off = on(map, eventName, data => {
    off()
    resolve(data)
  })
}

export async function emit(map, eventName, eventData) {
  assertEventName(eventName)

  if (!map.has(eventName)) {
    return Promise.resolve(eventData)
  }

  const listeners = getListeners(map, eventName)
  const staticListeners = [...listeners]

  return Promise.all(
    staticListeners.map(
      emitListener.bind({ eventData, listeners })
    )
  )
}

async function emitListener(listener) {
  const { eventData, listeners } = this
  if (listeners.has(listener)) {
    return listener(eventData)
  }
}

export function clearListeners(map, eventName) {
  if (map.has(eventName)) {
    getListeners(map, eventName).clear()
  }
}
