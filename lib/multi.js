export function multi(emitter, fnName, groups) {
  return groups.map(group => emitter[fnName](...group))
}
