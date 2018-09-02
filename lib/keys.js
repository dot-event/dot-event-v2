// Helpers
import { propsToArray } from "./props"

export function eventKey({
  op = "",
  prep = "",
  props = "",
} = {}) {
  return `${prep}:${op}:${props}`
}

export function anyKeys({ payload, prep }) {
  const { event } = payload
  const { op } = event

  const keys = new Set([
    eventKey({ prep }),
    eventKey({ op, prep }),
  ])

  if (event.props) {
    const propsArray = propsToArray(event.props)

    for (let x = 0; x < propsArray.length; x++) {
      const newProps = propsArray.slice(0, x + 1).join(".")

      const key = eventKey({
        op,
        prep,
        props: newProps,
      })

      keys.add(key)
    }
  }

  return [...keys]
}
