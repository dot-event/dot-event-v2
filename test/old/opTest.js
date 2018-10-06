import Events from "../../dist/core"

describe("op", () => {
  describe("on", () => {
    test("one emit", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.withOp("create").on(fn)

      await events.create().catch(console.error)

      const payload = {
        event: {
          op: "create",
          signal: {},
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("two emits", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.withOp("create").on(fn)

      await events.create().catch(console.error)
      await events.create().catch(console.error)

      const payload = {
        event: {
          op: "create",
          signal: {},
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload], [payload]])
    })

    test("emit with prop cases", async () => {
      const events = new Events()
      const fn = jest.fn()
      const fn2 = jest.fn()

      events.withOp("create").on("hi", fn)
      await events.emit("hi").catch(console.error)

      expect(fn.mock.calls.length).toBe(0)

      events.on("hi", fn2)
      await events.create("hi").catch(console.error)

      expect(fn2.mock.calls.length).toBe(0)

      events.withOp("*").on("hi", fn2)
      await events.create("hi").catch(console.error)

      expect(fn2.mock.calls.length).toBe(1)
    })

    test("no emits", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.withOp("create").on("hi", fn)
      await events.create().catch(console.error)

      expect(fn.mock.calls.length).toBe(0)
    })

    test("subscriber options", async () => {
      const events = new Events()
      const fn = jest.fn()
      const options = { opt: true }

      events
        .withOp("create")
        .withOptions(options)
        .on(fn)

      await events.create().catch(console.error)

      const payload = {
        event: {
          op: "create",
          options: options,
          signal: {},
        },
        events: expect.any(Events),
        opt: true,
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("emit args", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.withOp("create").on(fn)

      await events.create(true).catch(console.error)

      const payload = {
        event: {
          args: [true],
          op: "create",
          signal: {},
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("emit extras and options", async () => {
      const events = new Events()
      const fn = jest.fn()

      events
        .withOp("create")
        .withOptions({ opt: true })
        .on(fn)

      await events.create(true).catch(console.error)

      const payload = {
        event: {
          args: [true],
          op: "create",
          options: {
            opt: true,
          },
          signal: {},
        },
        events: expect.any(Events),
        opt: true,
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })
  })

  describe("onAny", () => {
    test("two emits (subscribe without op)", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.withOp("create")
      events.onAny(fn)

      await events.emit().catch(console.error)
      await events.create().catch(console.error)

      const payload = {
        event: { signal: {} },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("two emits (subscribe with op)", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.withOp("create").onAny(fn)

      await events.emit().catch(console.error)
      await events.create("hello").catch(console.error)

      const payload = {
        event: {
          op: "create",
          props: ["hello"],
          signal: {},
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })
  })

  describe("once", () => {
    test("two emits", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.withOp("create").once(fn)

      await events.create().catch(console.error)
      await events.create().catch(console.error)

      expect(fn.mock.calls.length).toBe(1)
    })

    test("two emits with promise", async () => {
      const events = new Events()
      const fn = jest.fn()

      events
        .withOp("create")
        .once()
        .then(fn)

      await events.create()
      await events.create()

      expect(fn.mock.calls.length).toBe(1)
    })

    test("two emits with promise and callback", async () => {
      const events = new Events()
      const fn = jest.fn()

      events
        .withOp("create")
        .once(fn)
        .then(fn)

      await events.create()
      await events.create()
      await events.create()

      expect(fn.mock.calls.length).toBe(2)
    })
  })

  describe("onceEmitted", () => {
    test("one emit", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.withOp("create")

      await events.create().catch(console.error)

      events.withOp("create").onceEmitted(fn)

      expect(fn.mock.calls.length).toBe(1)
    })
  })
})