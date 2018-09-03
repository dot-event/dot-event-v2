# dot-event

Build beautiful and extensible eventing APIs.

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

Subscription listeners can be asynchronous:

```js
emitter.on(async () => {})
await emitter.emit()
```

The emitter returns a promise that waits for listeners to resolve.

## Flexible arguments

Emitters and subscribers take **any combination** of these arguments:

| Argument type | Description                                                       | Emitter | Subscriber |
| :------------ | :---------------------------------------------------------------- | :-----: | :--------: |
| `String`      | [Operation](#operation)                                           |    ✔    |     ✔      |
| `String`      | [Dot-props](#dot-props) (period-separated ids)                    |    ✔    |     ✔      |
| `Object`      | [Subscription listener argument](#subscription-listener-argument) |    ✔    |     ✔      |
| `String`      | [Preposition](#preposition) (`before` or `after`)                 |         |     ✔      |
| `Function`    | [Subscription listener](#subscription-listener)                   |         |     ✔      |

We'll examine each argument type in the following sections.

## Operation

An "operation" is a way to categorize your events and build your API.

Define your operation (only need to do this once):

```js
emitter.op("create")
```

Defining an operation also creates a nifty shortcut function:

```js
emitter.on("create", () => {})
emitter.create() // emits
emitter.emit("create") // also emits, but not as cool
```

## Subscription listener argument

Subscription listeners receive a single object argument.

Add an object to your emitter call to pass it along to the subscription listener:

```js
emitter.on(({ hello }) => {})
emitter.emit({ hello: "world" })
```

Passing an object into the subscriber has the same effect:

```js
emitter.on(({ hello }) => {}, { hello: "world" })
emitter.emit()
```

When you pass an object to both subscriber and emitter, they merge together.

The subscription listener argument also contains an `event` property with extra information.

## Dot-props

Identify subscriptions by dot-prop string:

```js
emitter.on("hello.world", () => {})
emitter.emit("hello.world") // emits
emitter.emit() // doesn't emit
```

Dot-props come in handy with the `onAny` subscriber, which subscribes to a dot-prop **and its children**:

```js
emitter.onAny("hello", () => {})
emitter.emit("hello") // emits
emitter.emit("hello.world") // emits
emitter.emit() // doesn't emit
```

## Prepositions (before or after)

Subscribe to before or after the main subscription listener:

```js
emitter.on("before", () => {})
emitter.on(() => {})
emitter.on("after", () => {})
emitter.emit()
```

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

Build lots of subscriptions at once:

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
