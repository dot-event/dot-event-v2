import DotEvent from "../dist/core"

describe("empty", () => {
  describe("on", () => {
    test("two emits", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.on(fn)

      await event.emit().catch(console.error)
      await event.emit().catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          keys: new Set(["::"]),
        },
      }

      expect(fn.mock.calls).toEqual([[payload], [payload]])
    })

    test("no emits", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.on(fn)

      await event.emit("hello").catch(console.error)
      await event.emit("hello.world").catch(console.error)

      expect(fn.mock.calls.length).toBe(0)
    })

    test("options", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.on(fn)

      await event
        .emit({ hello: "world" })
        .catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          keys: new Set(["::"]),
          options: {
            hello: "world",
          },
        },
        hello: "world",
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })
  })

  describe("once", () => {
    test("two emits", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.once(fn)

      await event.emit().catch(console.error)
      await event.emit().catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          keys: new Set(["::"]),
        },
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })
  })

  describe("onceAny", () => {
    test("one emit", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.onceAny(fn)

      await event.emit("hello").catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          keys: new Set(["::hello"]),
          props: "hello",
        },
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })
  })

  describe("onceEmitted", () => {
    test("one emit", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.onceEmitted(fn)
      await event.emit().catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          keys: new Set(["::"]),
        },
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("two emits", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      await event.emit().catch(console.error)
      event.onceEmitted(fn)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          keys: new Set(["::"]),
        },
      }

      expect(fn.mock.calls).toEqual([[payload]])

      await event.emit().catch(console.error)
      expect(fn.mock.calls.length).toBe(1)
    })
  })

  describe("onceAnyEmitted", () => {
    test("one emit", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.onceAnyEmitted(fn)
      await event.emit("hello").catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          keys: new Set(["::hello"]),
          props: "hello",
        },
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("two emits", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      await event.emit("hello").catch(console.error)
      event.onceAnyEmitted(fn)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          keys: new Set(["::"]),
        },
      }

      expect(fn.mock.calls).toEqual([[payload]])

      await event.emit("hello").catch(console.error)

      expect(fn.mock.calls.length).toBe(1)
    })
  })
})
