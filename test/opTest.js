import Events from "../dist/core"

describe("op", () => {
  describe("on", () => {
    test("one emit", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.setOps("create")
      events.on("create", fn)

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

      events.setOps("create")
      events.on("create", fn)

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

    test("no emits", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.setOps("create")
      events.on("create", "hi", fn)

      await events.create("hello").catch(console.error)

      expect(fn.mock.calls.length).toBe(0)
    })

    test("subscriber options", async () => {
      const events = new Events()
      const fn = jest.fn()
      const option = { opt: true }

      events.setOps("create")
      events.on("create", fn, option)

      await events.create().catch(console.error)

      const payload = {
        event: {
          extras: [option],
          op: "create",
          options: option,
          signal: {},
        },
        events: expect.any(Events),
        opt: true,
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("emit options", async () => {
      const events = new Events()
      const fn = jest.fn()
      const option = { opt: true }

      events.setOps("create")
      events.on("create", fn)

      await events.create(option).catch(console.error)

      const payload = {
        event: {
          extras: [option],
          op: "create",
          options: option,
          signal: {},
        },
        events: expect.any(Events),
        opt: true,
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("emit extras", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.setOps("create")
      events.on("create", fn)

      await events.create(true).catch(console.error)

      const payload = {
        event: {
          extras: [true],
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

      events.setOps("create")
      events.on("create", fn)

      await events
        .create(true, { opt: true })
        .catch(console.error)

      const payload = {
        event: {
          extras: [true, { opt: true }],
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

    test("emit extras and options with subscriber options", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.setOps("create")
      events.on("create", fn, { opt2: true })

      await events
        .create(true, { opt: true })
        .catch(console.error)

      const payload = {
        event: {
          extras: [true, { opt: true }, { opt2: true }],
          op: "create",
          options: {
            opt: true,
            opt2: true,
          },
          signal: {},
        },
        events: expect.any(Events),
        opt: true,
        opt2: true,
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })
  })

  describe("onAny", () => {
    test("two emits", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.setOps("create")
      events.onAny("create", fn)

      await events.create().catch(console.error)
      await events.create("hello").catch(console.error)

      const payload = {
        event: {
          op: "create",
          signal: {},
        },
        events: expect.any(Events),
      }

      const payload2 = {
        event: {
          op: "create",
          props: "hello",
          propsArray: ["hello"],
          signal: {},
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })
  })

  describe("once", () => {
    test("two emits", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.setOps("create")
      events.once("create", fn)

      await events.create().catch(console.error)
      await events.create().catch(console.error)

      expect(fn.mock.calls.length).toBe(1)
    })

    test("two emits with promise", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.setOps("create")
      events.once("create").then(fn)

      await events.create()
      await events.create()

      expect(fn.mock.calls.length).toBe(1)
    })

    test("two emits with promise and callback", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.setOps("create")
      events.once("create", fn).then(fn)

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

      events.setOps("create")
      await events.create().catch(console.error)

      events.onceEmitted("create", fn)

      expect(fn.mock.calls.length).toBe(1)
    })
  })
})
