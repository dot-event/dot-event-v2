import { propVarRegex } from "./props"

export function eventKey({
  op = "",
  prep = "",
  props,
} = {}) {
  return `${prep}:${op}:${eventKeyProps(props)}`
}

function eventKeyProps(props) {
  if (props) {
    return props.join(".").replace(propVarRegex, "*")
  } else {
    return ""
  }
}

export function buildKeys(args) {
  args.prep = args.prep || args.state.prep
  return args.type === "any" ? anyKeys(args) : onKeys(args)
}

export function anyKeys({
  prep,
  set,
  state = {},
  subscribe,
} = {}) {
  const { op, props } = state
  const keys = onKeys({
    prep,
    set: true,
    state,
    subscribe,
  })

  if (!subscribe) {
    keys.add(eventKey({ prep }))
    keys.add(eventKey({ op, prep }))

    if (props) {
      for (let x = 0; x < props.length - 1; x++) {
        const newProps = props.slice(0, x + 1)

        const key = eventKey({
          op,
          prep,
          props: newProps,
        })

        keys.add(key)

        const wild = wildProps(newProps)

        if (wild) {
          keys.add(eventKey({ op, prep, props: wild }))
        }
      }
    }
  }

  return set ? keys : [...keys]
}

export function onKeys({
  prep,
  set,
  state = {},
  subscribe,
} = {}) {
  const { op, props } = state
  const keys = new Set([eventKey({ op, prep, props })])

  if (subscribe && !op) {
    keys.add(eventKey({ op: "*", prep, props }))
  }

  if (!subscribe) {
    const wild = wildProps(props)

    if (op) {
      keys.add(eventKey({ op: "*", prep, props }))
    }

    if (wild) {
      keys.add(eventKey({ op, prep, props: wild }))
    }
  }

  return set ? keys : [...keys]
}

function wildProps(props) {
  if (props && props.length) {
    return props.slice(0, props.length - 1).concat(["*"])
  }
}
