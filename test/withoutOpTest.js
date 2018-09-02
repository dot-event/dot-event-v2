import DotEvent from "../dist/core"

describe("without op", () => {
  describe("on", () => {
    test("two emits", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.on(fn)

      await event.emit("create").catch(console.error)
      await event.emit("fetch").catch(console.error)

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
          keys: [":fetch:"],
          op: "fetch",
          prep: undefined,
          props: undefined,
        },
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })
  })
})
