import DotEvent from "../dist/core"

describe("root subscriber emit", () => {
  test("once", async () => {
    const event = new DotEvent()
    const fn = jest.fn()

    event.op("create")
    event.on("create", fn)

    await event.create().catch(console.error)

    const payload = {
      event: {
        emitter: expect.any(DotEvent),
        keys: ["create"],
        op: "create",
        prep: undefined,
        props: undefined,
      },
    }

    expect(fn.mock.calls).toEqual([[payload]])
  })

  test("twice", async () => {
    const event = new DotEvent()
    const fn = jest.fn()

    event.op("create")
    event.on("create", fn)

    await event.create().catch(console.error)
    await event.create().catch(console.error)

    const payload = {
      event: {
        emitter: expect.any(DotEvent),
        keys: ["create"],
        op: "create",
        prep: undefined,
        props: undefined,
      },
    }

    expect(fn.mock.calls).toEqual([[payload], [payload]])
  })

  test("shouldn't emit", async () => {
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
        keys: ["create"],
        op: "create",
        prep: undefined,
        props: undefined,
      },
      opt: true,
    }

    expect(fn.mock.calls).toEqual([[payload]])
  })

  test("options", async () => {
    const event = new DotEvent()
    const fn = jest.fn()

    event.op("create")
    event.on("create", fn)

    await event.create({ opt: true }).catch(console.error)

    const payload = {
      event: {
        emitter: expect.any(DotEvent),
        keys: ["create"],
        op: "create",
        prep: undefined,
        props: undefined,
      },
      opt: true,
    }

    expect(fn.mock.calls).toEqual([[payload]])
  })

  test("extras", async () => {
    const event = new DotEvent()
    const fn = jest.fn()

    event.op("create")
    event.on("create", fn)

    await event.create(true).catch(console.error)

    const payload = {
      event: {
        emitter: expect.any(DotEvent),
        extras: [true],
        keys: ["create"],
        op: "create",
        prep: undefined,
        props: undefined,
      },
    }

    expect(fn.mock.calls).toEqual([[payload]])
  })

  test("extras and options", async () => {
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
        keys: ["create"],
        op: "create",
        prep: undefined,
        props: undefined,
      },
      opt: true,
    }

    expect(fn.mock.calls).toEqual([[payload]])
  })

  test("extras, options, and subscriber options", async () => {
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
        keys: ["create"],
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
