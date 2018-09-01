import DotEvent from "../dist/core"

describe("without props", () => {
  describe("on", () => {
    test("one emit", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.op("create")
      event.on("create", fn)

      await event.create().catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          keys: [":create:"],
          op: "create",
          prep: undefined,
          props: undefined,
        },
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("two emits", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.op("create")
      event.on("create", fn)

      await event.create().catch(console.error)
      await event.create().catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          keys: [":create:"],
          op: "create",
          prep: undefined,
          props: undefined,
        },
      }

      expect(fn.mock.calls).toEqual([[payload], [payload]])
    })

    test("no emits", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.op("create")
      event.on("create", fn)

      await event.create("hello").catch(console.error)

      expect(fn.mock.calls.length).toBe(0)
    })

    test("subscriber options", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.op("create")
      event.on("create", fn, { opt: true })

      await event.create().catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          keys: [":create:"],
          op: "create",
          prep: undefined,
          props: undefined,
        },
        opt: true,
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("emit options", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.op("create")
      event.on("create", fn)

      await event.create({ opt: true }).catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          keys: [":create:"],
          op: "create",
          prep: undefined,
          props: undefined,
        },
        opt: true,
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("emit extras", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.op("create")
      event.on("create", fn)

      await event.create(true).catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          extras: [true],
          keys: [":create:"],
          op: "create",
          prep: undefined,
          props: undefined,
        },
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("emit extras and options", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.op("create")
      event.on("create", fn)

      await event
        .create(true, { opt: true })
        .catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          extras: [true],
          keys: [":create:"],
          op: "create",
          prep: undefined,
          props: undefined,
        },
        opt: true,
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("emit extras and options with subscriber options", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.op("create")
      event.on("create", fn, { opt2: true })

      await event
        .create(true, { opt: true })
        .catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          extras: [true],
          keys: [":create:"],
          op: "create",
          prep: undefined,
          props: undefined,
        },
        opt: true,
        opt2: true,
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })
  })

  describe("onAny", () => {
    test("two emits", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.op("create")
      event.onAny("create", fn)

      await event.create().catch(console.error)
      await event.create("hello").catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          keys: [":create:"],
          op: "create",
          prep: undefined,
          props: undefined,
        },
      }

      const payload2 = {
        event: {
          emitter: expect.any(DotEvent),
          keys: [":create:hello"],
          op: "create",
          prep: undefined,
          props: "hello",
        },
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })
  })

  describe("once", () => {
    test("two emits", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.op("create")
      event.once("create", fn)

      await event.create().catch(console.error)
      await event.create().catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          keys: [":create:"],
          op: "create",
          prep: undefined,
          props: undefined,
        },
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("two emits with promise", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.op("create")
      event.once("create").then(fn)

      await event.create()
      await event.create()

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          keys: [":create:"],
          op: "create",
          prep: undefined,
          props: undefined,
        },
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("two emits with promise and callback", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.op("create")
      event.once("create", fn).then(fn)

      await event.create()
      await event.create()
      await event.create()

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          keys: [":create:"],
          op: "create",
          prep: undefined,
          props: undefined,
        },
      }

      expect(fn.mock.calls).toEqual([[payload], [payload]])
    })
  })

  describe("onceEmitted", () => {
    test("one emit", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.op("create")
      await event.create().catch(console.error)

      event.onceEmitted("create", fn)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          keys: [":create:"],
          op: "create",
          prep: undefined,
          props: undefined,
        },
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })
  })
})
