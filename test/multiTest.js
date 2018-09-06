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
          op: "create",
        },
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("two emit", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.op("create")
      event.on([
        ["create", "hello", fn],
        ["create", "hello.world", fn],
      ])

      await event.create("hello").catch(console.error)
      await event.create("hello.world").catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          op: "create",
          props: "hello",
          propsArray: ["hello"],
        },
      }

      const payload2 = {
        event: {
          emitter: expect.any(DotEvent),
          op: "create",
          props: "hello.world",
          propsArray: ["hello", "world"],
        },
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
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
