// Constants
export const propVarRegex = /\{([^}]+)\}/

// Helpers
export function propsToArray(props) {
  if (typeof props === "undefined") {
    return []
  }

  if (Array.isArray(props)) {
    return props
  }

  return props.split(".").reduce(propsToArrayReduce, [])
}

function propsToArrayReduce(ret, el, index, list) {
  var last = index > 0 && list[index - 1]
  if (last && /(?:^|[^\\])\\$/.test(last)) {
    ret.pop()
    ret.push(last.slice(0, -1) + "." + el)
  } else {
    ret.push(el)
  }
  return ret
}

export function propVar({ emitProps, props }) {
  if (!props) {
    return
  }

  const propVar = {}
  const [index, match] =
    props.reduce(propVarReduce, undefined) || []

  if (match) {
    propVar[match[1]] = emitProps[index]
  }

  return propVar
}

function propVarReduce(memo, prop, index) {
  if (memo) {
    return memo
  }
  const match = prop.match(propVarRegex)
  if (match) {
    return [index, match]
  }
}
