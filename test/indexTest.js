import * as lib from "../dist/dot-event"

test("export something", () => {
  expect(Object.keys(lib).length).toBeGreaterThan(0)
})
