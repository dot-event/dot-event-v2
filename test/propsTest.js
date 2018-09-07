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
          listenProps: "hello.world",
          listenPropsArray: ["hello", "world"],
          props: "hello.world",
          propsArray: ["hello", "world"],
        },
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("one wildcard emit", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.on("hello.*", fn)

      await event.emit("hello.world").catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          listenProps: "hello.*",
          listenPropsArray: ["hello", "*"],
          props: "hello.world",
          propsArray: ["hello", "world"],
        },
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("one wildcard variable emit", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.on("hello.{place}", fn)

      await event.emit("hello.world").catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          listenProps: "hello.{place}",
          listenPropsArray: ["hello", "{place}"],
          options: {
            place: "world",
          },
          props: "hello.world",
          propsArray: ["hello", "world"],
        },
        place: "world",
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
          listenProps: "hello.world",
          listenPropsArray: ["hello", "world"],
          props: "hello.world",
          propsArray: ["hello", "world"],
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
          listenProps: "hello.world",
          listenPropsArray: ["hello", "world"],
          props: "hello.world",
          propsArray: ["hello", "world"],
        },
      }

      const payload2 = {
        event: {
          emitter: expect.any(DotEvent),
          listenProps: "hello.world",
          listenPropsArray: ["hello", "world"],
          props: "hello.world.again",
          propsArray: ["hello", "world", "again"],
        },
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })

    test("two wildcard emits", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.onAny("*", fn)

      await event.emit().catch(console.error)
      await event.emit("hello").catch(console.error)
      await event.emit("hello.world").catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          listenProps: "*",
          listenPropsArray: ["*"],
          props: "hello",
          propsArray: ["hello"],
        },
      }

      const payload2 = {
        event: {
          emitter: expect.any(DotEvent),
          listenProps: "*",
          listenPropsArray: ["*"],
          props: "hello.world",
          propsArray: ["hello", "world"],
        },
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })

    test("two wildcard variable emits", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.onAny("hello.{place}", fn)

      await event.emit("hello").catch(console.error)
      await event.emit("hello.world").catch(console.error)
      await event
        .emit("hello.world.peace")
        .catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          listenProps: "hello.{place}",
          listenPropsArray: ["hello", "{place}"],
          options: { place: "world" },
          props: "hello.world",
          propsArray: ["hello", "world"],
        },
        place: "world",
      }

      const payload2 = {
        event: {
          emitter: expect.any(DotEvent),
          listenProps: "hello.{place}",
          listenPropsArray: ["hello", "{place}"],
          options: { place: "world" },
          props: "hello.world.peace",
          propsArray: ["hello", "world", "peace"],
        },
        place: "world",
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
          listenProps: "hello",
          listenPropsArray: ["hello"],
        },
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("one emit wildcard", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      await event
        .emit("hello.world.peace")
        .catch(console.error)

      event.onceAnyEmitted("hello.*", fn)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          listenProps: "hello.*",
          listenPropsArray: ["hello", "*"],
        },
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })
  })
})
