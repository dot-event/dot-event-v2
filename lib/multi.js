export function multi(emitter, fnName, groups) {
  const offs = groups.map(
    multiMap.bind({ emitter, fnName })
  )
  return multiOff.bind({ offs })
}

function multiMap(group) {
  const { emitter, fnName } = this
  return emitter[fnName](...group)
}

function multiOff() {
  const { offs } = this
  for (const off of offs) {
    off()
  }
}
