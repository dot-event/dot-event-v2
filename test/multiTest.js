import DotEvent from "../dist/core"

describe("multi", () => {
  describe("on", () => {
    test("one emit", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.op("create")
      event.on([["create", fn]])

      await event.create().catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          keys: new Set(["::", ":create:"]),
          op: "create",
          prep: undefined,
          props: undefined,
        },
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("two emit", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.op("create")
      event.on([["create", fn], ["create", "hello", fn]])

      await event.create("hello").catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          keys: new Set([
            "::",
            ":create:",
            ":create:hello",
          ]),
          op: "create",
          prep: undefined,
          props: "hello",
        },
      }

      expect(fn.mock.calls).toEqual([[payload], [payload]])
    })

    test("off", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.op("create")
      const off = event.on([
        ["create", fn],
        ["create", "hello", fn],
      ])

      off()

      await event.create().catch(console.error)
      await event.create("hello").catch(console.error)

      expect(fn.mock.calls.length).toBe(0)
    })
  })
})
