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

    test("one emit w/ multiple listeners", async () => {
      const events = new Events()
      const out = []

      const fn = () => out.push("a")
      const fn2 = () => out.push("b")

      events.on({ hello: [fn, fn2] })

      await events.emit("hello").catch(console.error)

      expect(out).toEqual(["a", "b"])
    })

    test("one emit w/ multiple nested listeners", async () => {
      const events = new Events()
      const out = []

      const fn = () => out.push("a")
      const fn2 = () => out.push("b")
      const fn3 = () => out.push("c")

      events.on({ hello: { hi: [fn, [fn2, fn3]] } })

      await events.emit("hello").catch(console.error)

      expect(out).toEqual(["a", "b", "c"])
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

    test("off w/ multiple listeners", async () => {
      const events = new Events()
      const fn = jest.fn()
      const fn2 = jest.fn()

      const off = events.on({
        "hello.world": [fn, fn2],
      })

      off()

      await events.emit("hello.world").catch(console.error)

      expect(fn.mock.calls.length).toBe(0)
      expect(fn2.mock.calls.length).toBe(0)
    })
  })
})
