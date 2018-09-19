import Events from "../dist/core"

describe("prep", () => {
  describe("on", () => {
    test("emit once", async () => {
      const events = new Events()
      const order = []

      const timer = ms =>
        new Promise(res => setTimeout(res, ms))

      events.before().on(async () => {
        await timer(2)
        order.push(1)
      })

      events.on(async () => {
        await timer(1)
        order.push(2)
      })

      events.after().on(async () => {
        await timer(0)
        order.push(3)
      })

      await events.emit()

      expect(order).toEqual([1, 2, 3])
    })
  })
})
