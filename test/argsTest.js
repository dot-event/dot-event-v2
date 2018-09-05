import DotEvent from "../dist/core"
import { initState } from "../dist/args"

describe("args", () => {
  test("function", () => {
    const emitter = new DotEvent()
    const { fn } = initState({
      args: [() => {}],
      emitter,
    })
    expect(fn).toEqual(expect.any(Function))
  })

  test("options", () => {
    const emitter = new DotEvent()
    const { options } = initState({
      args: [{ hello: "world" }],
      emitter,
    })
    expect(options).toEqual({ hello: "world" })
  })

  test("before/after", () => {
    const emitter = new DotEvent()
    const { prep } = initState({
      args: ["before"],
      emitter,
    })
    expect(prep).toBe("before")
  })

  test("op", () => {
    const emitter = new DotEvent()
    emitter.op("create")
    const { op } = initState({
      args: ["create"],
      emitter,
    })
    expect(op).toBe("create")
  })

  test("props", () => {
    const emitter = new DotEvent()
    const { props } = initState({
      args: ["hello"],
      emitter,
    })
    expect(props).toBe("hello")
  })

  test("extras", () => {
    const emitter = new DotEvent()
    const { extras } = initState({
      args: [true, false, 123, null, []],
      emitter,
    })
    expect(extras).toEqual([true, false, 123, null, []])
  })
})
