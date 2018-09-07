import { anyKeys, onKeys } from "../dist/keys"

describe("keys", () => {
  describe("onKeys", () => {
    test("emit empty", () => {
      expect(onKeys()).toEqual(["::"])
    })

    test("subscribe empty", () => {
      expect(onKeys({ subscribe: true })).toEqual(["::"])
    })

    test("emit prop", () => {
      expect(
        onKeys({
          state: { props: "hello", propsArray: ["hello"] },
        })
      ).toEqual(["::hello", "::*"])
    })

    test("subscribe prop", () => {
      expect(
        onKeys({
          state: {
            props: "hello",
            propsArray: ["hello"],
          },
          subscribe: true,
        })
      ).toEqual(["::hello"])
    })
  })

  describe("anyKeys", () => {
    test("emit empty", () => {
      expect(anyKeys()).toEqual(["::"])
    })

    test("subscribe empty", () => {
      expect(anyKeys({ subscribe: true })).toEqual(["::"])
    })

    test("emit prop", () => {
      expect(
        anyKeys({
          state: {
            props: "hello.world",
            propsArray: ["hello", "world"],
          },
        })
      ).toEqual([
        "::hello.world",
        "::hello.*",
        "::",
        "::hello",
        "::*",
      ])
    })

    test("emit prop wildcard", () => {
      expect(
        anyKeys({
          state: {
            props: "hello.*",
            propsArray: ["hello", "*"],
          },
        })
      ).toEqual(["::hello.*", "::", "::hello", "::*"])
    })

    test("subscribe prop", () => {
      expect(
        anyKeys({
          state: {
            props: "hello.world",
            propsArray: ["hello", "world"],
          },
          subscribe: true,
        })
      ).toEqual(["::hello.world"])
    })
  })
})
