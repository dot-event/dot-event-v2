# dot-event

Design beautiful, extensible, and asynchronous eventing APIs.

![dot event](dot.gif)

## Install

```bash
npm install --save dot-event
```

## Start simple

Part of the beauty of the `dot-event` API is that it can shrink down to incredibly simple functionality.

Here we have the simplest possible subscriber and emitter:

```js
import Emitter from "dot-event"
const emitter = new Emitter()

emitter.on(() => {})
emitter.emit()
```

## Flexible arguments

Subscribers and emitters take **one**, **some**, or **none** of these arguments:

| Argument type | Description                                       | Emitter | Subscriber |
| :------------ | :------------------------------------------------ | :-----: | :--------: |
| `String`      | [Props](#props) (period-separated ids)            |    ✔    |     ✔      |
| `Object`      | [Subscription arguments](#subscription-arguments) |    ✔    |     ✔      |
| `String`      | [Operation](#operation)                           |    ✔    |     ✔      |
| `String`      | [Preposition](#preposition) (`before` or `after`) |         |     ✔      |
| `Function`    | [Subscription listener](#subscription-listener)   |         |     ✔      |

We'll examine each argument type one by one in the sections that follow.

## Props

Identify subscriptions by dot-prop string:

```js
emitter.on("hello.world", () => {})
emitter.emit("hello.world") // emits
emitter.emit() // doesn't emit
```

Dot-props come in handy with the `onAny` subscriber, which subscribes to a prop **and** its children:

```js
emitter.onAny("hello", () => {})
emitter.emit("hello") // emits
emitter.emit("hello.world") // emits
emitter.emit() // doesn't emit
```

## Subscription arguments

Add an object to your emitter call to pass it along to the subscriber:

```js
emitter.on(({ hello }) => {})
emitter.emit({ hello: "world" })
```

Passing an object into the subscriber has the same effect:

```js
emitter.on(({ hello }) => {}, { hello: "world" })
emitter.emit()
```

## Operations

An "operation" is a way, other than dot-props, to categorize your events.

Define your operation (only need to do this once):

```js
emitter.op("create")
```

Most importantly, defining an operation also creates a nifty shortcut function:

```js
emitter.on("create", () => {})
emitter.create() // emits
```

## Prepositions (before or after)

Subscribe to before or after the main emit:

```js
emitter.on("before", () => {})
emitter.on(() => {})
emitter.on("after", () => {})
emitter.emit()
```

## Subscription listeners

**Subscription listeners can be asynchronous.** Emitters return a promise that resolves once listeners resolve concurrently.

**Subscription listeners receive a single object argument.** The object contains [subscription arguments](#susbcription-arguments) and an `event` property with extra info.

## More subscribers

### Once

```js
emitter.once(() => {})
emitter.emit() // emits
emitter.emit() // doesn't emit
```

### Once emitted

Fire immediately if previously emitted:

```js
emitter.emit()
emitter.onceEmitted(() => {}) // emits immediately
```

### Any

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

### Once any

```js
emitter.onceAny("hello", () => {})
emitter.emit("hello.world") // emits
emitter.emit("hello.world") // doesn't emit
```

### Once any emitted

Subscribe to any prop change within a prop, and fire immediately if previously emitted:

```js
emitter.emit("hello.world")
emitter.onceAnyEmitted("hello", () => {}) // emits immediately
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

## All together now

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
emitter.create( // Operation
  "my.prop.id", // Props
  { y: true }   // Susbcription options
)
```
