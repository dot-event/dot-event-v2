import Events from "../dist/core"

describe("prep", () => {
  describe("on", () => {
    test("synchronous emit once", () => {
      const events = new Events()
      const order = []

      events.before().on(() => order.push("a"))
      events.on(() => order.push("b"))
      events.after().on(() => order.push("c"))

      events.emitSync()

      expect(order).toEqual(["a", "b", "c"])
    })

    test("emit once", async () => {
      const events = new Events()
      const timer = ms =>
        new Promise(res => setTimeout(res, ms))

      let after, before, during

      events.before().on(async () => {
        await timer(2)
        before = new Date().getTime()
      })

      events.on(async () => {
        await timer(1)
        during = new Date().getTime()
      })

      events.after().on(async () => {
        await timer(0)
        after = new Date().getTime()
      })

      await events.emit()

      expect(before && during && after).toBeTruthy()
      expect(before < during < after).toBeTruthy()
    })
  })
})
