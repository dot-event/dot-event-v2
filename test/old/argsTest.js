import { initState } from "../../dist/args"

describe("args", () => {
  test("function", () => {
    const { fn } = initState({
      args: [() => {}],
    })
    expect(fn).toEqual(expect.any(Function))
  })

  test("options", () => {
    const { options } = initState({
      options: {
        options: { hello: "world" },
      },
    })
    expect(options).toEqual({ hello: "world" })
  })

  test("before/after", () => {
    const { prep } = initState({
      options: {
        prep: "before",
      },
    })
    expect(prep).toBe("before")
  })

  test("op", () => {
    const { op } = initState({
      options: {
        op: "create",
      },
    })
    expect(op).toBe("create")
  })

  test("props", () => {
    const { props } = initState({
      args: ["hello"],
    })
    expect(props).toEqual(["hello"])
  })

  test("props (array)", () => {
    const { props } = initState({
      args: [["hello"]],
    })
    expect(props).toEqual(["hello"])
  })

  test("args", () => {
    const { args } = initState({
      args: [true, false, 123, null],
    })
    expect(args).toEqual([true, false, 123, null])
  })
})
