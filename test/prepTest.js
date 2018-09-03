import DotEvent from "../dist/core"

describe("prep", () => {
  describe("on", () => {
    test("synchronous emit once", () => {
      const event = new DotEvent()
      let order = []

      event.opSync("get")

      event.on("before", "get", () => order.push("a"))
      event.on("get", () => order.push("b"))
      event.on("after", "get", () => order.push("c"))

      event.get()
      expect(order).toEqual(["a", "b", "c"])
    })

    test("emit once", async () => {
      const event = new DotEvent()
      const timer = ms =>
        new Promise(res => setTimeout(res, ms))

      let after, before, during

      event.on("before", async () => {
        await timer(1)
        before = new Date().getTime()
      })

      event.on(async () => {
        await timer(1)
        during = new Date().getTime()
      })

      event.on("after", async () => {
        await timer(1)
        after = new Date().getTime()
      })

      await event.emit()

      expect(before && during && after).toBeTruthy()
      expect(before < during < after).toBeTruthy()
    })
  })
})
