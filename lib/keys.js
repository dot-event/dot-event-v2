export function eventKey({
  op = "",
  prep = "",
  props = "",
} = {}) {
  return `${prep}:${op}:${props}`
}

export function anyKeys(event) {
  return ({ prep, subscribe }) => {
    const { op, props, propsArray } = event

    const keys = new Set([eventKey({ op, prep, props })])

    if (!subscribe) {
      keys.add(eventKey({ prep }))
      keys.add(eventKey({ op, prep }))

      if (props) {
        for (let x = 0; x < propsArray.length; x++) {
          const newProps = propsArray
            .slice(0, x + 1)
            .join(".")

          const key = eventKey({
            op,
            prep,
            props: newProps,
          })

          keys.add(key)
        }
      }
    }

    return [...keys]
  }
}

export function onKeys(event) {
  return ({ prep }) => {
    const { op, props } = event
    const keys = new Set([eventKey({ op, prep, props })])
    return [...keys]
  }
}
