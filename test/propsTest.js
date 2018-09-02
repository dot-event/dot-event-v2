import DotEvent from "../dist/core"

describe("props", () => {
  describe("on", () => {
    test("one emit", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.on("hello.world", fn)

      await event.emit("hello.world").catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          keys: new Set(["::hello.world"]),
          props: "hello.world",
        },
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("two emits", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.on("hello.world", fn)

      await event.emit("hello.world").catch(console.error)
      await event.emit("hello.world").catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          keys: new Set(["::hello.world"]),
          props: "hello.world",
        },
      }

      expect(fn.mock.calls).toEqual([[payload], [payload]])
    })

    test("no emits", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.on("hello.world", fn)

      await event.emit("hello").catch(console.error)

      expect(fn.mock.calls.length).toBe(0)
    })
  })

  describe("onAny", () => {
    test("two emits", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.onAny("hello.world", fn)

      await event.emit("hello").catch(console.error)
      await event.emit("hello.world").catch(console.error)
      await event
        .emit("hello.world.again")
        .catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          keys: new Set(["::hello.world"]),
          props: "hello.world",
        },
      }

      const payload2 = {
        event: {
          emitter: expect.any(DotEvent),
          keys: new Set(["::hello.world.again"]),
          props: "hello.world.again",
        },
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })
  })

  describe("onceAnyEmitted", () => {
    test("one emit", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      await event.emit("hello.world").catch(console.error)

      event.onceAnyEmitted("hello", fn)

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
})
