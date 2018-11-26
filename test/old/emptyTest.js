import dotEvent, { Events } from "../../"

describe("empty", () => {
  describe("on", () => {
    test("two emits", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.on(fn)

      await events.emit().catch(console.error)
      await events.emit().catch(console.error)

      const payload = {
        event: {
          op: "emit",
          props: [],
          signal: {},
        },
        events: expect.any(Events),
        props: [],
      }

      expect(fn.mock.calls).toEqual([[payload], [payload]])
    })

    test("no emits", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.on(fn)

      await events.emit("hello").catch(console.error)
      await events.emit("hello.world").catch(console.error)

      expect(fn.mock.calls.length).toBe(0)
    })

    test("emit function", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.on(fn)

      await events.emit(() => {})

      expect(fn.mock.calls[0][0].event.args[0]).toEqual(
        expect.any(Function)
      )
    })

    test("options", async () => {
      const events = dotEvent()
      const fn = jest.fn()
      const options = { hello: "world" }

      events.on(fn)

      await events.emit(options).catch(console.error)

      const payload = {
        event: {
          args: [options],
          op: "emit",
          options: options,
          props: [],
          signal: {},
        },
        events: expect.any(Events),
        hello: "world",
        props: [],
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("on op", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.setOp("create")
      events.onAny("*", fn)

      await events.create()

      expect(fn.mock.calls[0].length).toBe(1)
    })
  })

  describe("onAnyEmitted", () => {
    test("one emit", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      await events.emit("hello").catch(console.error)
      events.onAnyEmitted(fn)

      const payload = {
        event: {
          op: "*",
          props: [],
        },
        events: expect.any(Events),
        props: [],
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })
  })

  describe("onEmitted", () => {
    test("one emits", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      await events.emit().catch(console.error)
      events.onEmitted(fn)

      const payload = {
        event: {
          op: "*",
          props: [],
        },
        events: expect.any(Events),
        props: [],
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("two emits", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      await events.emit().catch(console.error)
      events.onEmitted(fn)

      await events.emit().catch(console.error)

      const payload = {
        event: {
          op: "*",
          props: [],
        },
        events: expect.any(Events),
        props: [],
      }

      const payload2 = {
        event: {
          op: "emit",
          props: [],
          signal: {},
        },
        events: expect.any(Events),
        props: [],
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })
  })

  describe("once", () => {
    test("two emits", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.once(fn)

      await events.emit().catch(console.error)
      await events.emit().catch(console.error)

      const payload = {
        event: {
          op: "emit",
          props: [],
          signal: {},
        },
        events: expect.any(Events),
        props: [],
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })
  })

  describe("onceAny", () => {
    test("two emits", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.onceAny(fn)

      await events.emit("hello").catch(console.error)
      await events.emit("hello.world").catch(console.error)

      const payload = {
        event: {
          op: "emit",
          props: ["hello"],
          signal: {},
        },
        events: expect.any(Events),
        props: ["hello"],
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })
  })

  describe("onceEmitted", () => {
    test("one emit", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.onceEmitted(fn)
      await events.emit().catch(console.error)

      const payload = {
        event: {
          op: "emit",
          props: [],
          signal: {},
        },
        events: expect.any(Events),
        props: [],
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("two emits", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      await events.emit().catch(console.error)
      events.onceEmitted(fn)

      await events.emit().catch(console.error)

      const payload = {
        event: {
          op: "*",
          props: [],
        },
        events: expect.any(Events),
        props: [],
      }

      expect(fn.mock.calls).toEqual([[payload]])

      await events.emit().catch(console.error)
      expect(fn.mock.calls.length).toBe(1)
    })
  })

  describe("onceAnyEmitted", () => {
    test("one emit", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.onceAnyEmitted(fn)
      await events.emit("hello").catch(console.error)

      const payload = {
        event: {
          op: "emit",
          props: ["hello"],
          signal: {},
        },
        events: expect.any(Events),
        props: ["hello"],
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("two emits", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      await events.emit("hello").catch(console.error)
      events.onceAnyEmitted(fn)

      await events.emit("hello").catch(console.error)

      const payload = {
        event: {
          op: "*",
          props: [],
        },
        events: expect.any(Events),
        props: [],
      }

      expect(fn.mock.calls).toEqual([[payload]])

      await events.emit("hello").catch(console.error)

      expect(fn.mock.calls.length).toBe(1)
    })
  })
})
