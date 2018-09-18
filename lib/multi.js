import * as builders from "./build"
import { isObject } from "./util"

export function multi(options) {
  if ((options.props && options.fn) || !options.args) {
    return
  }

  const arg = options.args[0]

  if (isObject(arg)) {
    const offs = Object.keys(arg).map(
      multiMap.bind(options)
    )
    return multiOff.bind({ offs })
  }
}

function multiMap(props) {
  const { name } = this

  return builders[name].call({
    ...this,
    args: undefined,
    fn: this.args[0][props],
    props,
  })
}

function multiOff() {
  const { offs } = this
  for (const off of offs) {
    off()
  }
}
