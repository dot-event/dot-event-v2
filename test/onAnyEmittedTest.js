import Events from "../dist/core"

describe("onAny", () => {
  describe("Emit immediately if previous emit", () => {
    test("Empty", async () => {
      const events = new Events()
      const fn = jest.fn()

      await events.emit("hello").catch(console.error)
      events.onAnyEmitted(fn)

      const payload = {
        event: {},
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("Empty with wildcard op", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.withOp("test")
      await events.test("hello").catch(console.error)
      events.withOp("*").onAnyEmitted(fn)

      const payload = {
        event: {},
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

      events.onAnyEmitted("hello.world", fn)

      const payload = {
        event: {
          listenProps: ["hello", "world"],
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

      events.withOp("*").onAnyEmitted("hello.world", fn)

      const payload = {
        event: {
          listenProps: ["hello", "world"],
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("Wildcard", async () => {
      const events = new Events()
      const fn = jest.fn()

      await events.emit("hello.world").catch(console.error)
      events.onAnyEmitted("hello.*", fn)

      const payload = {
        event: {
          listenProps: ["hello", "*"],
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
      events.withOp("*").onAnyEmitted("hello.*", fn)

      const payload = {
        event: {
          listenProps: ["hello", "*"],
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("Prop variable", async () => {
      const events = new Events()
      const fn = jest.fn()

      await events.emit("hello.world").catch(console.error)
      events.onAnyEmitted("hello.{var}", fn)

      const payload = {
        event: {
          listenProps: ["hello", "{var}"],
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
      events.withOp("*").onAnyEmitted("hello.{var}", fn)

      const payload = {
        event: {
          listenProps: ["hello", "{var}"],
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })
  })
})
