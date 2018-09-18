import Events from "../dist/core"

describe("multi", () => {
  describe("on", () => {
    test("one emit", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.on({ hello: fn })

      await events.emit("hello").catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello"],
          props: ["hello"],
          signal: {},
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("two emit", async () => {
      const events = new Events()
      const fn = jest.fn()
      const fn2 = jest.fn()

      events.on({
        hello: fn,
        "hello.world": fn2,
      })

      await events.emit("hello").catch(console.error)
      await events.emit("hello.world").catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello"],
          props: ["hello"],
          signal: {},
        },
        events: expect.any(Events),
      }

      const payload2 = {
        event: {
          listenProps: ["hello", "world"],
          props: ["hello", "world"],
          signal: {},
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
      expect(fn2.mock.calls).toEqual([[payload2]])
    })

    test("off", async () => {
      const events = new Events()
      const fn = jest.fn()

      const off = events.on({
        hello: fn,
        "hello.world": fn,
      })

      off()

      await events.emit("hello").catch(console.error)
      await events.emit("hello.world").catch(console.error)

      expect(fn.mock.calls.length).toBe(0)
    })
  })
})
