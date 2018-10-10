import dotEvent, { Events } from "../dist/core"

describe("onceAny", () => {
  describe("Subscribes to child props", () => {
    test("Empty", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.onceAny(fn)

      await events.emit("hello").catch(console.error)
      await events.emit().catch(console.error)

      const payload = {
        event: {
          op: "emit",
          props: ["hello"],
          signal: {},
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("Empty returns promise", async () => {
      const events = dotEvent()

      setTimeout(() => {
        events.emit("hello").catch(console.error)
      }, 1)

      const out = await events.onceAny()

      const payload = {
        event: {
          op: "*",
        },
        events: expect.any(Events),
      }

      expect(out).toEqual(payload)
    })

    test("Empty with wildcard op", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.setOps("test")
      events.onceAny("*", fn)

      await events.test("hello").catch(console.error)
      await events.test().catch(console.error)

      const payload = {
        event: {
          op: "test",
          props: ["hello"],
          signal: {},
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("Props", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.onceAny("emit.hello.world", fn)

      await events.emit("hello").catch(console.error)
      await events
        .emit("hello.world.again")
        .catch(console.error)
      await events.emit("hello.world").catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "world"],
          op: "emit",
          props: ["hello", "world", "again"],
          signal: {},
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("Props with wildcard op", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.setOps("test")
      events.onceAny("*.hello.world", fn)

      await events.test("hello").catch(console.error)
      await events
        .test("hello.world.again")
        .catch(console.error)
      await events.test("hello.world").catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "world"],
          op: "test",
          props: ["hello", "world", "again"],
          signal: {},
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("Wildcard", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.onceAny("emit.hello.*", fn)

      await events.emit("hello").catch(console.error)
      await events
        .emit("hello.world.again")
        .catch(console.error)
      await events.emit("hello.world").catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "*"],
          op: "emit",
          props: ["hello", "world", "again"],
          signal: {},
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("Wildcard with wildcard op", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.setOps("test")
      events.onceAny("*.hello.*", fn)

      await events.test("hello").catch(console.error)
      await events
        .test("hello.world.again")
        .catch(console.error)
      await events.test("hello.world").catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "*"],
          op: "test",
          props: ["hello", "world", "again"],
          signal: {},
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("Prop variable", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.onceAny("emit.hello.{var}", fn)

      await events.emit("hello").catch(console.error)
      await events
        .emit("hello.world.again")
        .catch(console.error)
      await events.emit("hello.world").catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "{var}"],
          op: "emit",
          options: { var: "world" },
          props: ["hello", "world", "again"],
          signal: {},
        },
        events: expect.any(Events),
        var: "world",
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("Prop variable with wildcard op", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.setOps("test")
      events.onceAny("*.hello.{var}", fn)

      await events.test("hello").catch(console.error)
      await events
        .test("hello.world.again")
        .catch(console.error)
      await events.test("hello.world").catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "{var}"],
          op: "test",
          options: { var: "world" },
          props: ["hello", "world", "again"],
          signal: {},
        },
        events: expect.any(Events),
        var: "world",
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })
  })
})
