import dotEvent, { Events } from "../../dist/core"

describe("name", () => {
  describe("on", () => {
    test("one emit", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.setName("store")
      events.on(fn)

      await events.emit().catch(console.error)

      const payload = {
        event: {
          op: "emit",
          props: [],
          signal: {},
        },
        props: [],
        store: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })
  })
})
