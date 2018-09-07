import { propVarRegex } from "./props"

export function eventKey({
  op = "",
  prep = "",
  props = "",
} = {}) {
  props = props.replace(propVarRegex, "*")
  return `${prep}:${op}:${props}`
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
  const { op, props, propsArray } = state
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
      for (let x = 0; x < propsArray.length - 1; x++) {
        const newProps = propsArray.slice(0, x + 1)

        const key = eventKey({
          op,
          prep,
          props: newProps.join("."),
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
  const { op, props, propsArray } = state
  const keys = new Set([eventKey({ op, prep, props })])

  if (!subscribe) {
    const wild = wildProps(propsArray)

    if (wild) {
      keys.add(eventKey({ op, prep, props: wild }))
    }
  }

  return set ? keys : [...keys]
}

function wildProps(propsArray) {
  if (propsArray) {
    return propsArray
      .slice(0, propsArray.length - 1)
      .concat(["*"])
      .join(".")
  }
}
