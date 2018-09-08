import Events from "../dist/core"

describe("name", () => {
  describe("on", () => {
    test("one emit", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.name("store")
      events.on(fn)

      await events.emit().catch(console.error)

      const payload = {
        event: {},
        store: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })
  })
})
