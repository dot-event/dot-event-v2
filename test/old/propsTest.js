import dotEvent, { Events } from "../../dist/core"

describe("props", () => {
  describe("on", () => {
    test("one emit", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.on("emit.hello.world", fn)

      await events.emit("hello.world").catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "world"],
          op: "emit",
          props: ["hello", "world"],
          signal: {},
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("one wildcard emit", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.on("emit.hello.*", fn)

      await events.emit("hello.world").catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "*"],
          op: "emit",
          props: ["hello", "world"],
          signal: {},
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("one wildcard variable emit", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.on("emit.hello.{place}", fn)

      await events.emit("hello.world").catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "{place}"],
          op: "emit",
          options: {
            place: "world",
          },
          props: ["hello", "world"],
          signal: {},
        },
        events: expect.any(Events),
        place: "world",
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("two emits", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.on("emit.hello.world", fn)

      await events.emit("hello.world").catch(console.error)
      await events.emit("hello.world").catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "world"],
          op: "emit",
          props: ["hello", "world"],
          signal: {},
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload], [payload]])
    })

    test("no emits", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.on("emit.hello.world", fn)

      await events.emit("hello").catch(console.error)

      expect(fn.mock.calls.length).toBe(0)
    })
  })

  describe("onAny", () => {
    test("two emits", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.onAny("emit.hello.world", fn)

      await events.emit("hello").catch(console.error)
      await events.emit("hello.world").catch(console.error)
      await events
        .emit("hello.world.again")
        .catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "world"],
          op: "emit",
          props: ["hello", "world"],
          signal: {},
        },
        events: expect.any(Events),
      }

      const payload2 = {
        event: {
          listenProps: ["hello", "world"],
          op: "emit",
          props: ["hello", "world", "again"],
          signal: {},
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })

    test("two wildcard emits", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.onAny("emit.*", fn)

      await events.emit().catch(console.error)
      await events.emit("hello").catch(console.error)
      await events.emit("hello.world").catch(console.error)

      const payload = {
        event: {
          listenProps: ["*"],
          op: "emit",
          props: ["hello"],
          signal: {},
        },
        events: expect.any(Events),
      }

      const payload2 = {
        event: {
          listenProps: ["*"],
          op: "emit",
          props: ["hello", "world"],
          signal: {},
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })

    test("two wildcard variable emits", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.onAny("emit.hello.{place}", fn)

      await events.emit("hello").catch(console.error)
      await events.emit("hello.world").catch(console.error)
      await events
        .emit("hello.world.peace")
        .catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "{place}"],
          op: "emit",
          options: { place: "world" },
          props: ["hello", "world"],
          signal: {},
        },
        events: expect.any(Events),
        place: "world",
      }

      const payload2 = {
        event: {
          listenProps: ["hello", "{place}"],
          op: "emit",
          options: { place: "world" },
          props: ["hello", "world", "peace"],
          signal: {},
        },
        events: expect.any(Events),
        place: "world",
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })
  })

  describe("once", () => {
    test("two wildcard variable emits", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.once("emit.hello.{place}", fn)

      await events.emit("hello.world").catch(console.error)
      await events.emit("hello.world").catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "{place}"],
          op: "emit",
          options: { place: "world" },
          props: ["hello", "world"],
          signal: {},
        },
        events: expect.any(Events),
        place: "world",
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })
  })

  describe("onceAnyEmitted", () => {
    test("one emit", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      await events.emit("hello.world").catch(console.error)

      events.onceAnyEmitted("emit.hello", fn)

      const payload = {
        event: {
          listenProps: ["hello"],
          op: "emit",
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("one emit wildcard", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      await events
        .emit("hello.world.peace")
        .catch(console.error)

      events.onceAnyEmitted("emit.hello.*", fn)

      const payload = {
        event: {
          listenProps: ["hello", "*"],
          op: "emit",
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })
  })
})
