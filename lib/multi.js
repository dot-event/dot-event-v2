import { isObject } from "./util"

export function multi({ fn, state }) {
  if ((state.props && state.fn) || !state.args) {
    return
  }

  const arg = state.args[0]

  if (state.args.length === 1 && isObject(arg)) {
    const offs = Object.keys(arg).map(
      makeChains.bind({ fn, state })
    )
    return multiOff.bind({ offs })
  }
}

function makeChains(props) {
  const { fn, state } = this
  const listener = makeChain(state.args[0][props])

  return buildSubscriber({ fn, listener, props, state })
}

function makeChain(listener) {
  if (isObject(listener)) {
    if (listener.if) {
      return ifChain.bind({ listener })
    } else {
      return allChain.bind({ listener })
    }
  } else if (Array.isArray(listener)) {
    return eachChain.bind({ listener })
  } else {
    return listener
  }
}

async function ifChain(...args) {
  const { listener } = this
  const ok = await listener.if(...args)

  if (ok) {
    await allChain.bind({ listener })(...args)
  }
}

async function allChain(...args) {
  const { listener } = this

  await Promise.all(
    Object.keys(listener).map(
      allChainMap.bind({ args, listener })
    )
  )
}

async function allChainMap(key) {
  const { args, listener } = this

  await makeChain(listener[key])(...args)
}

async function eachChain(...args) {
  const { listener } = this

  for (const fn of listener) {
    await makeChain(fn)(...args)
  }
}

function buildSubscriber({ fn, listener, props, state }) {
  return fn.call({
    ...state,
    args: undefined,
    fn: listener,
    op: undefined,
    props,
  })
}

function multiOff() {
  const { offs } = this

  for (const off of offs) {
    if (Array.isArray(off)) {
      for (const fn of off) {
        fn()
      }
    } else {
      off()
    }
  }
}
