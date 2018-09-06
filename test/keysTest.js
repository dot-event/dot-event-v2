import { anyKeys, onKeys } from "../dist/keys"

describe("keys", () => {
  describe("onKeys", () => {
    test("emit empty", () => {
      expect(onKeys()()).toEqual(["::"])
    })

    test("subscribe empty", () => {
      expect(onKeys()({ subscribe: true })).toEqual(["::"])
    })

    test("emit prop", () => {
      expect(
        onKeys({ props: "hello", propsArray: ["hello"] })()
      ).toEqual(["::hello", "::*"])
    })

    test("subscribe prop", () => {
      expect(
        onKeys({ props: "hello", propsArray: ["hello"] })({
          subscribe: true,
        })
      ).toEqual(["::hello"])
    })
  })

  describe("anyKeys", () => {
    test("emit empty", () => {
      expect(anyKeys()()).toEqual(["::"])
    })

    test("subscribe empty", () => {
      expect(anyKeys()({ subscribe: true })).toEqual(["::"])
    })

    test("emit prop", () => {
      expect(
        anyKeys({
          props: "hello.world",
          propsArray: ["hello", "world"],
        })()
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
          props: "hello.*",
          propsArray: ["hello", "*"],
        })()
      ).toEqual(["::hello.*", "::", "::hello", "::*"])
    })

    test("subscribe prop", () => {
      expect(
        anyKeys({
          props: "hello.world",
          propsArray: ["hello", "world"],
        })({
          subscribe: true,
        })
      ).toEqual(["::hello.world"])
    })
  })
})
