import DotEvent from "../dist/core"

describe("op", () => {
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
          op: "create",
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
          op: "create",
        },
      }

      expect(fn.mock.calls).toEqual([[payload], [payload]])
    })

    test("no emits", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.op("create")
      event.on("create", "hi", fn)

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
          op: "create",
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
          op: "create",
          options: {
            opt: true,
          },
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
          op: "create",
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
          op: "create",
          options: {
            opt: true,
          },
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
          op: "create",
          options: {
            opt: true,
          },
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
          op: "create",
        },
      }

      const payload2 = {
        event: {
          emitter: expect.any(DotEvent),
          op: "create",
          props: "hello",
          propsArray: ["hello"],
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

      expect(fn.mock.calls.length).toBe(1)
    })

    test("two emits with promise", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.op("create")
      event.once("create").then(fn)

      await event.create()
      await event.create()

      expect(fn.mock.calls.length).toBe(1)
    })

    test("two emits with promise and callback", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.op("create")
      event.once("create", fn).then(fn)

      await event.create()
      await event.create()
      await event.create()

      expect(fn.mock.calls.length).toBe(2)
    })
  })

  describe("onceEmitted", () => {
    test("one emit", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.op("create")
      await event.create().catch(console.error)

      event.onceEmitted("create", fn)

      expect(fn.mock.calls.length).toBe(1)
    })
  })
})
