import dotEvent, { Events } from "../dist/core"

describe("onAny", () => {
  describe("Subscribes to child props", () => {
    test("Empty", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.onAny(fn)

      await events.emit().catch(console.error)
      await events.emit("hello").catch(console.error)

      const payload = {
        event: {
          op: "emit",
          props: [],
          signal: {},
        },
        events: expect.any(Events),
        props: [],
      }

      const payload2 = {
        event: {
          op: "emit",
          props: ["hello"],
          signal: {},
        },
        events: expect.any(Events),
        props: ["hello"],
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })

    test("Empty with op", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.onAny("test", fn)

      await events.test().catch(console.error)
      await events.test("hello").catch(console.error)

      const payload = {
        event: {
          op: "test",
          props: [],
          signal: {},
        },
        events: expect.any(Events),
        props: [],
      }

      const payload2 = {
        event: {
          op: "test",
          props: ["hello"],
          signal: {},
        },
        events: expect.any(Events),
        props: ["hello"],
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })

    test("Empty with wildcard op", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.setOp("test")
      events.onAny("*", fn)

      await events.test().catch(console.error)
      await events.test("hello").catch(console.error)

      const payload = {
        event: {
          op: "test",
          props: [],
          signal: {},
        },
        events: expect.any(Events),
        props: [],
      }

      const payload2 = {
        event: {
          op: "test",
          props: ["hello"],
          signal: {},
        },
        events: expect.any(Events),
        props: ["hello"],
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })

    test("Props", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.onAny("emit.hello.world", fn)

      await events.emit("hello").catch(console.error)
      await events.emit("hello.world").catch(console.error)
      await events
        .emit("hello.world.again")
        .catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "world"],
          op: "emit",
          props: ["hello", "world"],
          signal: {},
        },
        events: expect.any(Events),
        props: ["hello", "world"],
      }

      const payload2 = {
        event: {
          listenProps: ["hello", "world"],
          op: "emit",
          props: ["hello", "world", "again"],
          signal: {},
        },
        events: expect.any(Events),
        props: ["hello", "world", "again"],
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })

    test("Props with wildcard op", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.setOp("test")
      events.onAny("*.hello.world", fn)

      await events.test("hello").catch(console.error)
      await events.test("hello.world").catch(console.error)
      await events
        .test("hello.world.again")
        .catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "world"],
          op: "test",
          props: ["hello", "world"],
          signal: {},
        },
        events: expect.any(Events),
        props: ["hello", "world"],
      }

      const payload2 = {
        event: {
          listenProps: ["hello", "world"],
          op: "test",
          props: ["hello", "world", "again"],
          signal: {},
        },
        events: expect.any(Events),
        props: ["hello", "world", "again"],
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })

    test("Wildcard", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.onAny("emit.hello.*", fn)

      await events.emit("hello").catch(console.error)
      await events.emit("hello.world").catch(console.error)
      await events
        .emit("hello.world.again")
        .catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "*"],
          op: "emit",
          props: ["hello", "world"],
          signal: {},
        },
        events: expect.any(Events),
        props: ["hello", "world"],
      }

      const payload2 = {
        event: {
          listenProps: ["hello", "*"],
          op: "emit",
          props: ["hello", "world", "again"],
          signal: {},
        },
        events: expect.any(Events),
        props: ["hello", "world", "again"],
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })

    test("Wildcard with wildcard op", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.setOp("test")
      events.onAny("*.hello.*", fn)

      await events.test("hello").catch(console.error)
      await events.test("hello.world").catch(console.error)
      await events
        .test("hello.world.again")
        .catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "*"],
          op: "test",
          props: ["hello", "world"],
          signal: {},
        },
        events: expect.any(Events),
        props: ["hello", "world"],
      }

      const payload2 = {
        event: {
          listenProps: ["hello", "*"],
          op: "test",
          props: ["hello", "world", "again"],
          signal: {},
        },
        events: expect.any(Events),
        props: ["hello", "world", "again"],
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })

    test("Prop variable", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.onAny("emit.hello.{var}", fn)

      await events.emit("hello").catch(console.error)
      await events.emit("hello.world").catch(console.error)
      await events
        .emit("hello.world.again")
        .catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "{var}"],
          op: "emit",
          options: { var: "world" },
          props: ["hello", "world"],
          signal: {},
        },
        events: expect.any(Events),
        props: ["hello", "world"],
        var: "world",
      }

      const payload2 = {
        event: {
          listenProps: ["hello", "{var}"],
          op: "emit",
          options: { var: "world" },
          props: ["hello", "world", "again"],
          signal: {},
        },
        events: expect.any(Events),
        props: ["hello", "world", "again"],
        var: "world",
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })

    test("Prop variable with wildcard op", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.setOp("test")
      events.onAny("*.hello.{var}", fn)

      await events.test("hello").catch(console.error)
      await events.test("hello.world").catch(console.error)
      await events
        .test("hello.world.again")
        .catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "{var}"],
          op: "test",
          options: { var: "world" },
          props: ["hello", "world"],
          signal: {},
        },
        events: expect.any(Events),
        props: ["hello", "world"],
        var: "world",
      }

      const payload2 = {
        event: {
          listenProps: ["hello", "{var}"],
          op: "test",
          options: { var: "world" },
          props: ["hello", "world", "again"],
          signal: {},
        },
        events: expect.any(Events),
        props: ["hello", "world", "again"],
        var: "world",
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })
  })
})
