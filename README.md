# dot-event

Prop-based asynchronous event emitter.

![dot event](dot.gif)

## Install

```bash
npm install --save dot-event
```

## Emitter

```js
import Emitter from "dot-event"
const emitter = new Emitter()
```

## Emit

```js
emitter.on(() => {})
emitter.emit()
```

## Emit options

```js
emitter.on(({ hello }) => {})
emitter.emit({ hello: "world" })
```

## Emit once

```js
emitter.once(() => {})
emitter.emit()
```

## Emit once emitted

Fire immediately if previously emitted:

```js
emitter.emit()
emitter.onceEmitted(() => {})
```

## Emit before or after

Subscribe to before or after the main emit:

```js
emitter.on("before", () => {})
emitter.on(() => {})
emitter.on("after", () => {})
emitter.emit()
```

## Emit prop

Any subscriber can use a prop identifier:

```js
emitter.on("hello", () => {})
emitter.emit("hello")
```

## Emit any

Subscribe to any prop change:

```js
emitter.onAny(() => {})
emitter.emit("hello.world")
```

Subscribe to any prop change within a prop:

```js
emitter.onAny("hello", () => {})
emitter.emit("hello.world")
```

## Emit once any emitted

Subscribe to any prop change within a prop, and fire immediately if previously emitted:

```js
emitter.emit("hello.world")
emitter.onceAnyEmitted("hello", () => {})
```

## Emit operation

Define your operation (only do this once):

```js
emitter.op("create")
```

Use the operation:

```js
emitter.on("create", () => {})
emitter.create()
```

## Emit before operation with props and options

Define the `create` operation, then subscribe to `before` `create` `hello.world`:

```js
emitter.op("create")
emitter.on(
  "before",
  "create",
  "hello.world",
  ({ hi }) => {}
)
emitter.create("hello.world", { hi: true })
```

## Subscriber shorthand

Build lots of subscribers at once:

```js
emitter.on([
  [() => {}],
  ["hello.world", () => {}],
  ["create", "hello.world", () => {}],
  ["after", "create", "hello.world", () => {}],
])
```

## Universal arguments

Subscriber and emitter functions all take a similar set of arguments.

All arguments are optional and order doesn't matter:

| Type       | Description                                         |
| ---------- | --------------------------------------------------- |
| `String`   | Preposition (`before` or `after`)                   |
| `String`   | Operation (see ["Emit operation"](#emit-operation)) |
| `String`   | Props (period-separated ids)                        |
| `Function` | Subscription listener                               |

The subscription receives any extra arguments via `event.extras`.
