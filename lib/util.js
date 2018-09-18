export function isObject(arg) {
  return (
    arg &&
    typeof arg === "object" &&
    arg !== null &&
    arg.constructor === Object
  )
}
