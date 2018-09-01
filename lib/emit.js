// Helpers
import { emit } from "./emitter"
import { eventKey } from "./key"
import { propsToArray } from "./props"

export async function emitAny({ emitter, key, payload }) {
  const { event } = payload

  let promises = []
  const [prep, op] = key.split(":")

  if (event.props) {
    const propsArray = propsToArray(event.props)

    for (let x = 0; x < propsArray.length; x++) {
      const newProps = propsArray.slice(0, x + 1).join(".")
      const key = eventKey({
        op,
        prep,
        props: newProps,
      })
      promises = promises.concat([
        (async () => {
          await emit(emitter.anyMaps, key, payload)
          emitter.anyEmittedKeys.add(key)
        })(),
      ])
    }
  }

  promises = promises.concat([
    emit(
      emitter.anyMaps,
      eventKey({
        op,
        prep,
      }),
      payload
    ),
  ])

  await Promise.all(promises)
  return payload
}
