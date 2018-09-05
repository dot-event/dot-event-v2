import DotEvent from "../dist/core"
import { initState } from "../dist/args"

describe("args", () => {
  test("no args", () => {
    const emitter = new DotEvent()
    const { key } = initState({ args: [], emitter })
    expect(key).toEqual("::")
  })

  test("function", () => {
    const emitter = new DotEvent()
    const { fn, key } = initState({
      args: [() => {}],
      emitter,
    })
    expect(fn).toEqual(expect.any(Function))
    expect(key).toEqual("::")
  })

  test("options", () => {
    const emitter = new DotEvent()
    const { key, options } = initState({
      args: [{ hello: "world" }],
      emitter,
    })
    expect(options).toEqual({ hello: "world" })
    expect(key).toEqual("::")
  })

  test("before/after", () => {
    const emitter = new DotEvent()
    const { key, prep } = initState({
      args: ["before"],
      emitter,
    })
    expect(key).toBe("before::")
    expect(prep).toBe("before")
  })

  test("op", () => {
    const emitter = new DotEvent()
    emitter.op("create")
    const { key, op } = initState({
      args: ["create"],
      emitter,
    })
    expect(key).toBe(":create:")
    expect(op).toBe("create")
  })

  test("props", () => {
    const emitter = new DotEvent()
    const { key, props } = initState({
      args: ["hello"],
      emitter,
    })
    expect(key).toBe("::hello")
    expect(props).toBe("hello")
  })

  test("extras", () => {
    const emitter = new DotEvent()
    const { extras, key } = initState({
      args: [true, false, 123, null, []],
      emitter,
    })
    expect(extras).toEqual([true, false, 123, null, []])
    expect(key).toBe("::")
  })
})
