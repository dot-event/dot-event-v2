import Events from "../dist/core"

describe("onAnyEmitted", () => {
  describe("Emit immediately if previous emit", () => {
    test("Empty", async () => {
      const events = new Events()
      const fn = jest.fn()

      await events.emit("hello").catch(console.error)
      events.onAnyEmitted(fn)
      await events.emit("hello").catch(console.error)

      const payload = {
        event: {},
        events: expect.any(Events),
      }

      const payload2 = {
        event: {
          props: ["hello"],
          signal: {},
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })

    test("Empty with wildcard op", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.withOp("test")
      await events.test("hello").catch(console.error)
      events.withOp("*").onAnyEmitted(fn)
      await events.test("hello").catch(console.error)

      const payload = {
        event: {},
        events: expect.any(Events),
      }

      const payload2 = {
        event: {
          op: "test",
          props: ["hello"],
          signal: {},
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })

    test("Props", async () => {
      const events = new Events()
      const fn = jest.fn()

      await events
        .emit("hello.world.again")
        .catch(console.error)

      events.onAnyEmitted("hello.world", fn)

      await events
        .emit("hello.world.again")
        .catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "world"],
        },
        events: expect.any(Events),
      }

      const payload2 = {
        event: {
          listenProps: ["hello", "world"],
          props: ["hello", "world", "again"],
          signal: {},
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })

    test("Props with wildcard op", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.withOp("test")

      await events
        .test("hello.world.again")
        .catch(console.error)

      events.withOp("*").onAnyEmitted("hello.world", fn)

      await events
        .test("hello.world.again")
        .catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "world"],
        },
        events: expect.any(Events),
      }

      const payload2 = {
        event: {
          listenProps: ["hello", "world"],
          op: "test",
          props: ["hello", "world", "again"],
          signal: {},
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })

    test("Wildcard", async () => {
      const events = new Events()
      const fn = jest.fn()

      await events.emit("hello.world").catch(console.error)
      events.onAnyEmitted("hello.*", fn)
      await events.emit("hello.world").catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "*"],
        },
        events: expect.any(Events),
      }

      const payload2 = {
        event: {
          listenProps: ["hello", "*"],
          props: ["hello", "world"],
          signal: {},
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })

    test("Wildcard with wildcard op", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.withOp("test")
      await events.test("hello.world").catch(console.error)
      events.withOp("*").onAnyEmitted("hello.*", fn)
      await events.test("hello.world").catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "*"],
        },
        events: expect.any(Events),
      }

      const payload2 = {
        event: {
          listenProps: ["hello", "*"],
          op: "test",
          props: ["hello", "world"],
          signal: {},
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })

    test("Prop variable", async () => {
      const events = new Events()
      const fn = jest.fn()

      await events.emit("hello.world").catch(console.error)
      events.onAnyEmitted("hello.{var}", fn)
      await events.emit("hello.world").catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "{var}"],
        },
        events: expect.any(Events),
      }

      const payload2 = {
        event: {
          listenProps: ["hello", "{var}"],
          options: { var: "world" },
          props: ["hello", "world"],
          signal: {},
        },
        events: expect.any(Events),
        var: "world",
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })

    test("Prop variable with wildcard op", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.withOp("test")
      await events.test("hello.world").catch(console.error)
      events.withOp("*").onAnyEmitted("hello.{var}", fn)
      await events.test("hello.world").catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "{var}"],
        },
        events: expect.any(Events),
      }

      const payload2 = {
        event: {
          listenProps: ["hello", "{var}"],
          op: "test",
          options: { var: "world" },
          props: ["hello", "world"],
          signal: {},
        },
        events: expect.any(Events),
        var: "world",
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })
  })
})
