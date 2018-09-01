export function multi(emitter, fnName, groups) {
  const offs = groups.map(group =>
    emitter[fnName](...group)
  )
  return () => {
    for (const off of offs) {
      off()
    }
  }
}
