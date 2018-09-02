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

| Terms      | Functions                                                         |
| :--------- | :---------------------------------------------------------------- |
| Emitter    | `emit`, `emitAny`, `emitOn`, `emitAnyOn`                          |
| Subscriber | `on`, `onAny`, `once`, `onceEmitted`, `onceAny`, `onceAnyEmitted` |
| Setter     | `op`                                                              |

Subscribers and emitters take **one**, **some**, or **none** of these arguments:

| Argument type | Description                     | Emitter | Subscriber |
| :------------ | :------------------------------ | :-----: | :--------: |
| `String`      | Preposition (`before`, `after`) |         |     ✔      |
| `String`      | [Operation](#emit-operation)    |    ✔    |     ✔      |
| `String`      | Props (period-separated ids)    |    ✔    |     ✔      |
| `Object`      | Subscription options            |    ✔    |     ✔      |
| `Function`    | Subscription listener           |         |     ✔      |

All the features together:

```js
// Define operations
emitter.op("create")

// Subscriber
emitter.on(
  "before",         // Preposition
  "create",         // Operation
  "my.prop.id",     // Props
  { x: true }       // Subscription options
  ({ x, y }) => {}, // Subscription listener
)

// Emitter
emitter.emit(
  "create",     // Operation
  "my.prop.id", // Props
  { y: true }   // Susbcription options
)

// Emitter shortcut
emitter.create("my.prop.id", { y: true })
```

| Subscription listeners           |                                                      |
| :------------------------------- | ---------------------------------------------------- |
| Can be asynchronous              | ⇢ Emitters wait for concurrent resolution            |
| Receive a single object argument | ⇢ Argument contains subscription options             |
|                                  | ⇢ Argument contains `event` property with extra info |

| Emitters         |                                                    |
| :--------------- | -------------------------------------------------- |
| Return a promise | ⇢ Resolves once all listeners concurrently resolve |

There are some features we haven't covered, so keep reading...

## Emit options

```js
emitter.on(({ hello }) => {})
emitter.emit({ hello: "world" })
```

You may define default options from the subscriber as well:

```js
emitter.on(({ hello }) => {}, { hello: "world" })
emitter.emit()
```

## Emit once

```js
emitter.once(() => {})
emitter.emit() // emits
emitter.emit() // doesn't emit
```

## Emit once emitted

Fire immediately if previously emitted:

```js
emitter.emit()
emitter.onceEmitted(() => {}) // emits immediately
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
emitter.emit("hello") // emits
emitter.emit() // doesn't emit
```

## Emit any

Subscribe to any prop change:

```js
emitter.onAny(() => {})
emitter.emit("hello") // emits
emitter.emit("hello.world") // emits
```

Subscribe to any prop change within a prop:

```js
emitter.onAny("hello", () => {})
emitter.emit("hello.world") // emits
emitter.emit() // doesn't emit
```

## Emit once any

```js
emitter.onceAny("hello", () => {})
emitter.emit("hello.world") // emits
emitter.emit("hello.world") // doesn't emit
```

## Emit once any emitted

Subscribe to any prop change within a prop, and fire immediately if previously emitted:

```js
emitter.emit("hello.world")
emitter.onceAnyEmitted("hello", () => {}) // emits immediately
```

## Emit operation

An "operation" is another way to segment your events.

Define your operation (only do this once):

```js
emitter.op("create")
```

Operations add a nifty shortcut function:

```js
emitter.on("create", () => {})
emitter.emit("create") // emits
emitter.create() // emit with shortcut
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
