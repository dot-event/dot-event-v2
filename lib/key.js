// Helpers
export function eventKey({
  op = "",
  prep = "",
  props = "",
}) {
  return `${prep}:${op}:${props}`
}
