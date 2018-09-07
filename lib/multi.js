export function multi(events, fnName, groups) {
  const offs = groups.map(multiMap.bind({ events, fnName }))
  return multiOff.bind({ offs })
}

function multiMap(group) {
  const { events, fnName } = this
  return events[fnName](...group)
}

function multiOff() {
  const { offs } = this
  for (const off of offs) {
    off()
  }
}
