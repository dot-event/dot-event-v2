// Helpers
import { propsToArray } from "./props"

export function eventKey({
  op = "",
  prep = "",
  props = "",
} = {}) {
  return `${prep}:${op}:${props}`
}

export function anyKeys({ payload }) {
  return ({ prep, subscribe }) => {
    const { event } = payload
    const { op, props } = event

    const keys = new Set([eventKey({ op, prep, props })])

    if (!subscribe) {
      keys.add(eventKey({ prep }))
      keys.add(eventKey({ op, prep }))

      if (props) {
        const propsArray = propsToArray(props)

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

export function onKeys({ op, props }) {
  return ({ prep }) => {
    const keys = new Set([eventKey({ op, prep, props })])
    return [...keys]
  }
}
