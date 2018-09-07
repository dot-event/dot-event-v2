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

  return props
    .split(".")
    .reduce(function(ret, el, index, list) {
      var last = index > 0 && list[index - 1]
      if (last && /(?:^|[^\\])\\$/.test(last)) {
        ret.pop()
        ret.push(last.slice(0, -1) + "." + el)
      } else {
        ret.push(el)
      }
      return ret
    }, [])
}

export function propVar({ listenPropsArray, propsArray }) {
  if (!propsArray) {
    return
  }

  let index,
    match,
    propVar = {}

  propsArray.some((prop, i) => {
    if ((match = prop.match(propVarRegex))) {
      index = i
      return true
    }
  })

  if (match) {
    propVar[match[1]] = listenPropsArray[index]
  }

  return propVar
}
