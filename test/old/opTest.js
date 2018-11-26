import dotEvent, { Events } from "../../"

describe("op", () => {
  describe("on", () => {
    test("one emit", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.on("create", fn)

      await events.create().catch(console.error)

      const payload = {
        event: {
          op: "create",
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

      events.on("create", fn)

      await events.create().catch(console.error)
      await events.create().catch(console.error)

      const payload = {
        event: {
          op: "create",
          props: [],
          signal: {},
        },
        events: expect.any(Events),
        props: [],
      }

      expect(fn.mock.calls).toEqual([[payload], [payload]])
    })

    test("emit with prop cases", async () => {
      const events = dotEvent()
      const fn = jest.fn()
      const fn2 = jest.fn()

      events.on("create.hi", fn)
      await events.emit("hi").catch(console.error)

      expect(fn.mock.calls.length).toBe(0)

      events.on("hi", fn2)
      await events.create("hi").catch(console.error)

      expect(fn2.mock.calls.length).toBe(0)

      events.on("*.hi", fn2)
      await events.create("hi").catch(console.error)

      expect(fn2.mock.calls.length).toBe(1)
    })

    test("no emits", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.on("create.hi", fn)
      await events.create().catch(console.error)

      expect(fn.mock.calls.length).toBe(0)
    })

    test("subscriber options", async () => {
      const events = dotEvent()
      const fn = jest.fn()
      const options = { opt: true }

      events.withOptions(options).on("create", fn)
      await events.create().catch(console.error)

      const payload = {
        event: {
          op: "create",
          options: options,
          props: [],
          signal: {},
        },
        events: expect.any(Events),
        opt: true,
        props: [],
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("emit args", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.on("create", fn)

      await events.create(true).catch(console.error)

      const payload = {
        event: {
          args: [true],
          op: "create",
          props: [],
          signal: {},
        },
        events: expect.any(Events),
        props: [],
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("emit extras and options", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.withOptions({ opt: true }).on("create", fn)

      await events.create(true).catch(console.error)

      const payload = {
        event: {
          args: [true],
          op: "create",
          options: {
            opt: true,
          },
          props: [],
          signal: {},
        },
        events: expect.any(Events),
        opt: true,
        props: [],
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })
  })

  describe("onAny", () => {
    test("two emits (subscribe without op)", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.setOp("create")
      events.onAny(fn)

      await events.emit().catch(console.error)
      await events.create().catch(console.error)

      const payload = {
        event: { op: "emit", props: [], signal: {} },
        events: expect.any(Events),
        props: [],
      }

      const payload2 = {
        event: { op: "create", props: [], signal: {} },
        events: expect.any(Events),
        props: [],
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })

    test("two emits (subscribe with op)", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.onAny("create", fn)

      await events.emit().catch(console.error)
      await events.create("hello").catch(console.error)

      const payload = {
        event: {
          op: "create",
          props: ["hello"],
          signal: {},
        },
        events: expect.any(Events),
        props: ["hello"],
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })
  })

  describe("once", () => {
    test("two emits", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.once("create", fn)

      await events.create().catch(console.error)
      await events.create().catch(console.error)

      expect(fn.mock.calls.length).toBe(1)
    })

    test("two emits with promise", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.once("create").then(fn)

      await events.create()
      await events.create()

      expect(fn.mock.calls.length).toBe(1)
    })

    test("two emits with promise and callback", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.once("create", fn).then(fn)

      await events.create()
      await events.create()
      await events.create()

      expect(fn.mock.calls.length).toBe(2)
    })
  })

  describe("onceEmitted", () => {
    test("one emit", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.setOp("create")
      await events.create().catch(console.error)
      events.onceEmitted("create", fn)

      expect(fn.mock.calls.length).toBe(1)
    })
  })
})
