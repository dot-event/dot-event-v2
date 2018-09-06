export function eventKey({
  op = "",
  prep = "",
  props = "",
} = {}) {
  return `${prep}:${op}:${props}`
}

export function anyKeys(event = {}) {
  return ({ prep, subscribe } = {}) => {
    const { op, props, propsArray } = event

    const keys = onKeys(event)({
      prep,
      set: true,
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

    return [...keys]
  }
}

export function onKeys(event = {}) {
  return ({ prep, set, subscribe } = {}) => {
    const { op, props, propsArray } = event

    const keys = new Set([eventKey({ op, prep, props })])

    if (!subscribe) {
      const wild = wildProps(propsArray)

      if (wild) {
        keys.add(eventKey({ op, prep, props: wild }))
      }
    }

    return set ? keys : [...keys]
  }
}

function wildProps(propsArray) {
  if (propsArray) {
    return propsArray
      .slice(0, propsArray.length - 1)
      .concat(["*"])
      .join(".")
  }
}
