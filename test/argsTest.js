import Events from "../dist/core"
import { initState } from "../dist/args"

describe("args", () => {
  test("function", () => {
    const events = new Events()
    const { fn } = initState({
      args: [() => {}],
      events,
    })
    expect(fn).toEqual(expect.any(Function))
  })

  test("options", () => {
    const events = new Events()
    const { options } = initState({
      args: [{ hello: "world" }],
      events,
    })
    expect(options).toEqual({ hello: "world" })
  })

  test("before/after", () => {
    const events = new Events()
    const { prep } = initState({
      args: ["before"],
      events,
    })
    expect(prep).toBe("before")
  })

  test("op", () => {
    const events = new Events()
    events.op("create")
    const { op } = initState({
      args: ["create"],
      events,
    })
    expect(op).toBe("create")
  })

  test("props", () => {
    const events = new Events()
    const { props } = initState({
      args: ["hello"],
      events,
    })
    expect(props).toBe("hello")
  })

  test("extras", () => {
    const events = new Events()
    const { extras } = initState({
      args: [true, false, 123, null, []],
      events,
    })
    expect(extras).toEqual([true, false, 123, null, []])
  })
})
