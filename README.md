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

## Cheatsheet

| Terms       | Functions                                                         |
| :---------- | :---------------------------------------------------------------- |
| Operations  | `op`                                                              |
| Emitters    | `emit`, `emitAny`, `emitOn`, `emitAnyOn`                          |
| Subscribers | `on`, `onAny`, `once`, `onceEmitted`, `onceAny`, `onceAnyEmitted` |

Subscribers and emitters take **one**, **some**, or **none** of these arguments:

| Argument type | Description                     | Emitter | Subscriber |
| :------------ | :------------------------------ | :-----: | :--------: |
| `Function`    | Subscription listener           |         |     ✔      |
| `Object`      | Subscription options            |    ✔    |     ✔      |
| `String`      | Props (period-separated ids)    |    ✔    |     ✔      |
| `String`      | [Operation](#emit-operation)    |    ✔    |     ✔      |
| `String`      | Preposition (`before`, `after`) |    ✔    |            |

All the features together:

```js
// Define operations
emitter.op("create")

// Subscriber
emitter.on(
  "before",         // Preposition
  "create",         // Operation
  "my.prop.id",     // Props
  { x: true }       // Subscription option
  ({ x, y }) => {}, // Subscription listener
)

// Emitter
emitter.emit("create", "my.prop.id", { y: true })

// Emitter operation shortcut
emitter.create("my.prop.id", { y: true })
```

Subscription listeners receive an object with subscription options and an `event` property that has some useful info.

Now, back to the examples...

## Emit options

```js
emitter.on(({ hello }) => {})
emitter.emit({ hello: "world" })
```

Define default options from the subscriber as well:

```js
emitter.on(({ hello }) => {}, { hello: "world" })
emitter.emit()
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
emitter.emit("hello")
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

An "operation" is another way to segment your events.

Define your operation (only do this once):

```js
emitter.op("create")
```

Use the operation:

```js
emitter.on("create", () => {})
emitter.create()
```

## All together

Here we use a [preposition](#emit-before-or-after), [operation](#emit-operation),

Define the `create` operation, then subscribe to `before` `create` `hello.world`:

```js
emitter.op("create")
emitter.on(
  "before",
  "create",
  "hello.world",
  ({ hi }) => {},
  { hola: true }
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
