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

export function propVar({ emitPropsArray, propsArray }) {
  if (!propsArray) {
    return
  }

  const propVar = {}
  const [index, match] =
    propsArray.reduce(propVarReduce, undefined) || []

  if (match) {
    propVar[match[1]] = emitPropsArray[index]
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
