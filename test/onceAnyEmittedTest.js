import Events from "../dist/core"

describe("onceAnyEmitted", () => {
  describe("Emit immediately if previous emit", () => {
    test("Empty", async () => {
      const events = new Events()
      const fn = jest.fn()

      await events.emit("hello").catch(console.error)
      events.onceAnyEmitted(fn)
      await events.emit("hello").catch(console.error)

      const payload = {
        event: {
          op: "*",
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("Empty returns promise", async () => {
      const events = new Events()

      await events.emit("hello").catch(console.error)
      const out = await events.onceAnyEmitted()

      const payload = {
        event: {
          op: "*",
        },
        events: expect.any(Events),
      }

      expect(out).toEqual(payload)
    })

    test("Empty with wildcard op", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.withOp("test")
      await events.test("hello").catch(console.error)
      events.withOp("*").onceAnyEmitted(fn)
      await events.test("hello").catch(console.error)

      const payload = {
        event: {
          op: "*",
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("Props", async () => {
      const events = new Events()
      const fn = jest.fn()

      await events
        .emit("hello.world.again")
        .catch(console.error)

      events.onceAnyEmitted("emit.hello.world", fn)

      await events
        .emit("hello.world.again")
        .catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "world"],
          op: "emit",
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("Props with wildcard op", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.withOp("test")

      await events
        .test("hello.world.again")
        .catch(console.error)

      events.withOp("*").onceAnyEmitted("hello.world", fn)

      await events
        .test("hello.world.again")
        .catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "world"],
          op: "*",
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("Wildcard", async () => {
      const events = new Events()
      const fn = jest.fn()

      await events.emit("hello.world").catch(console.error)
      events.onceAnyEmitted("emit.hello.*", fn)
      await events.emit("hello.world").catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "*"],
          op: "emit",
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("Wildcard with wildcard op", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.withOp("test")
      await events.test("hello.world").catch(console.error)
      events.withOp("*").onceAnyEmitted("hello.*", fn)
      await events.test("hello.world").catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "*"],
          op: "*",
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("Prop variable", async () => {
      const events = new Events()
      const fn = jest.fn()

      await events.emit("hello.world").catch(console.error)
      events.onceAnyEmitted("emit.hello.{var}", fn)
      await events.emit("hello.world").catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "{var}"],
          op: "emit",
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("Prop variable with wildcard op", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.withOp("test")
      await events.test("hello.world").catch(console.error)
      events.withOp("*").onceAnyEmitted("hello.{var}", fn)
      await events.test("hello.world").catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "{var}"],
          op: "*",
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })
  })
})
