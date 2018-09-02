import DotEvent from "../dist/core"
import { parseArgs } from "../dist/args"

describe("args", () => {
  test("no args", () => {
    const emitter = new DotEvent()
    const options = parseArgs({ args: [], emitter })
    expect(options).toEqual({
      emitter: expect.any(DotEvent),
      key: "::",
    })
  })

  test("function", () => {
    const emitter = new DotEvent()
    const options = parseArgs({ args: [() => {}], emitter })
    expect(options).toEqual({
      emitter: expect.any(DotEvent),
      fn: expect.any(Function),
      key: "::",
    })
  })

  test("options", () => {
    const emitter = new DotEvent()
    const options = parseArgs({
      args: [{ hello: "world" }],
      emitter,
    })
    expect(options).toEqual({
      emitter: expect.any(DotEvent),
      key: "::",
      options: { hello: "world" },
    })
  })

  test("before/after", () => {
    const emitter = new DotEvent()
    expect(
      parseArgs({
        args: ["before"],
        emitter,
      })
    ).toEqual({
      emitter: expect.any(DotEvent),
      key: "before::",
      prep: "before",
    })
  })

  test("op", () => {
    const emitter = new DotEvent()
    emitter.op("create")
    expect(
      parseArgs({
        args: ["create"],
        emitter,
      })
    ).toEqual({
      emitter: expect.any(DotEvent),
      key: ":create:",
      op: "create",
    })
  })

  test("props", () => {
    const emitter = new DotEvent()
    expect(
      parseArgs({
        args: ["hello"],
        emitter,
      })
    ).toEqual({
      emitter: expect.any(DotEvent),
      key: "::hello",
      props: "hello",
    })
  })

  test("extras", () => {
    const emitter = new DotEvent()
    expect(
      parseArgs({
        args: [true, false, 123, null, []],
        emitter,
      })
    ).toEqual({
      emitter: expect.any(DotEvent),
      extras: [true, false, 123, null, []],
      key: "::",
    })
  })
})
