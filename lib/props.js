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
