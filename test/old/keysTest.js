import { anyKeys, onKeys } from "../../dist/dot-event/keys"

describe("keys", () => {
  describe("onKeys", () => {
    test("emit empty", () => {
      expect(onKeys({ state: { op: "emit" } })).toEqual([
        "emit",
        "*",
      ])
    })

    test("subscribe empty", () => {
      expect(
        onKeys({ state: { op: "emit" }, subscribe: true })
      ).toEqual(["emit"])
    })

    test("emit prop", () => {
      expect(
        onKeys({
          state: { op: "emit", props: ["hello"] },
        })
      ).toEqual(["emit.hello", "*.hello", "emit.*", "*.*"])
    })

    test("subscribe prop", () => {
      expect(
        onKeys({
          state: {
            op: "emit",
            props: ["hello"],
          },
          subscribe: true,
        })
      ).toEqual(["emit.hello"])
    })
  })

  describe("anyKeys", () => {
    test("emit empty", () => {
      expect(anyKeys({ state: { op: "emit" } })).toEqual([
        "emit",
        "*",
      ])
    })

    test("subscribe empty", () => {
      expect(
        anyKeys({ state: { op: "emit" }, subscribe: true })
      ).toEqual(["emit"])
    })

    test("emit prop", () => {
      expect(
        anyKeys({
          state: {
            op: "emit",
            props: ["hello", "world"],
          },
        })
      ).toEqual([
        "emit.hello.world",
        "*.hello.world",
        "emit.hello.*",
        "*.hello.*",
        "emit",
        "*",
        "emit.hello",
        "*.hello",
        "emit.*",
        "*.*",
      ])
    })

    test("subscribe prop wildcard", () => {
      expect(
        anyKeys({
          state: {
            op: "emit",
            props: ["hello", "{id}"],
          },
          subscribe: true,
        })
      ).toEqual(["emit.hello.*"])
    })

    test("subscribe prop", () => {
      expect(
        anyKeys({
          state: {
            op: "emit",
            props: ["hello", "world"],
          },
          subscribe: true,
        })
      ).toEqual(["emit.hello.world"])
    })
  })
})
