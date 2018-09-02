import DotEvent from "../dist/core"

describe("without op", () => {
  describe("on", () => {
    test("two emits", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.on(fn)

      await event.emit().catch(console.error)
      await event.emit().catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          keys: new Set(["::"]),
          op: undefined,
          prep: undefined,
          props: undefined,
        },
      }

      expect(fn.mock.calls).toEqual([[payload], [payload]])
    })

    test("no emits", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.on(fn)

      await event.emit("hello").catch(console.error)
      await event.emit("hello.world").catch(console.error)

      expect(fn.mock.calls.length).toBe(0)
    })

    test("options", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.on(fn)

      await event
        .emit({ hello: "world" })
        .catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          keys: new Set(["::"]),
          op: undefined,
          options: {
            hello: "world",
          },
          prep: undefined,
          props: undefined,
        },
        hello: "world",
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })
  })
})
