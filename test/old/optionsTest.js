import Events from "../../dist/core"

describe("options", () => {
  test("subscriber and listener options", async () => {
    const events = new Events()
    const fn = jest.fn()
    const options = { opt: true }
    const options2 = { opt2: true }

    events.withOptions(options).on(fn)

    await events
      .withOptions(options2)
      .emit()
      .catch(console.error)

    const payload = {
      event: {
        op: "emit",
        options: Object.assign({}, options, options2),
        signal: {},
      },
      events: expect.any(Events),
      opt: true,
      opt2: true,
    }

    expect(fn.mock.calls).toEqual([[payload]])
  })

  test("emit options", async () => {
    const events = new Events()
    const fn = jest.fn()

    events.on(fn)

    await events.emit({ opt: true }).catch(console.error)

    const payload = {
      event: {
        args: [{ opt: true }],
        op: "emit",
        options: { opt: true },
        signal: {},
      },
      events: expect.any(Events),
      opt: true,
    }

    expect(fn.mock.calls).toEqual([[payload]])
  })
})
