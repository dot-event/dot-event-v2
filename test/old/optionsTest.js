import dotEvent, { Events } from "../../"

describe("options", () => {
  test("subscriber and listener options", async () => {
    const events = dotEvent()
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
        props: [],
        signal: {},
      },
      events: expect.any(Events),
      opt: true,
      opt2: true,
      props: [],
    }

    expect(fn.mock.calls).toEqual([[payload]])
  })

  test("emit options", async () => {
    const events = dotEvent()
    const fn = jest.fn()

    events.on(fn)

    await events.emit({ opt: true }).catch(console.error)

    const payload = {
      event: {
        args: [{ opt: true }],
        op: "emit",
        options: { opt: true },
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
