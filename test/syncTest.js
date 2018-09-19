import Events from "../dist/core"

describe("sync", () => {
  describe("on", () => {
    test("one emit", async () => {
      const events = new Events()
      const order = []

      const timer = ms =>
        new Promise(res => setTimeout(res, ms))

      const fn = async () => {
        await timer(100)
        order.push(1)
      }
      const fn2 = () => order.push(2)

      events.sync().on(fn)
      events.sync().on(fn2)

      await events.emit().catch(console.error)

      expect(order).toEqual([1, 2])
    })
  })
})
