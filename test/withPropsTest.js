import DotEvent from "../dist/core"

describe("with props", () => {
  describe("on", () => {
    test("one emit", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.op("create")
      event.on("create", "hello.world", fn)

      await event.create("hello.world").catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          keys: new Set([":create:hello.world"]),
          op: "create",
          prep: undefined,
          props: "hello.world",
        },
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("two emits", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.op("create")
      event.on("create", "hello.world", fn)

      await event.create("hello.world").catch(console.error)
      await event.create("hello.world").catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          keys: new Set([":create:hello.world"]),
          op: "create",
          prep: undefined,
          props: "hello.world",
        },
      }

      expect(fn.mock.calls).toEqual([[payload], [payload]])
    })

    test("no emits", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.op("create")
      event.on("create", "hello.world", fn)

      await event.create("hello").catch(console.error)

      expect(fn.mock.calls.length).toBe(0)
    })
  })

  describe("onAny", () => {
    test("two emits", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.op("create")
      event.onAny("create", "hello.world", fn)

      await event.create("hello").catch(console.error)
      await event.create("hello.world").catch(console.error)
      await event
        .create("hello.world.again")
        .catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          keys: new Set([":create:hello.world"]),
          op: "create",
          prep: undefined,
          props: "hello.world",
        },
      }

      const payload2 = {
        event: {
          emitter: expect.any(DotEvent),
          keys: new Set([":create:hello.world.again"]),
          op: "create",
          prep: undefined,
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

      event.op("create")
      await event.create("hello.world").catch(console.error)

      event.onceAnyEmitted("create", "hello", fn)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          keys: new Set([":create:hello"]),
          op: "create",
          prep: undefined,
          props: "hello",
        },
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })
  })
})
