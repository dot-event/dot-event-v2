import Events from "../dist/core"

describe("multi", () => {
  describe("on", () => {
    test("one emit", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.op("create")
      events.on([["create", fn]])

      await events.create().catch(console.error)

      const payload = {
        event: {
          op: "create",
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("two emit", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.op("create")
      events.on([
        ["create", "hello", fn],
        ["create", "hello.world", fn],
      ])

      await events.create("hello").catch(console.error)

      await events
        .create("hello.world")
        .catch(console.error)

      const payload = {
        event: {
          listenProps: "hello",
          listenPropsArray: ["hello"],
          op: "create",
          props: "hello",
          propsArray: ["hello"],
        },
        events: expect.any(Events),
      }

      const payload2 = {
        event: {
          listenProps: "hello.world",
          listenPropsArray: ["hello", "world"],
          op: "create",
          props: "hello.world",
          propsArray: ["hello", "world"],
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })

    test("off", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.op("create")
      const off = events.on([
        ["create", fn],
        ["create", "hello", fn],
      ])

      off()

      await events.create().catch(console.error)
      await events.create("hello").catch(console.error)

      expect(fn.mock.calls.length).toBe(0)
    })
  })
})
