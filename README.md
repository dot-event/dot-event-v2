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
import Events from "dot-event"
const events = new Events()

events.on(() => {})
events.emit()
```

Subscription listeners can be asynchronous:

```js
events.on(async () => {})
await events.emit()
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
events.op("create")
```

Defining an operation also creates a nifty shortcut function:

```js
events.on("create", () => {})
events.create() // emits
events.emit("create") // also emits, but not as cool
```

Shortcut functions take the same arguments as `emit`.

## Dot-props

Identify subscriptions by dot-prop string:

```js
events.on("hello.world", () => {})
events.emit("hello.world") // emits
events.emit() // doesn't emit
```

Dot-props come in handy with the `onAny` subscriber, which subscribes to a dot-prop **and its child props**:

```js
events.onAny("hello", () => {})
events.emit("hello") // emits
events.emit("hello.world") // emits
events.emit() // doesn't emit
```

## Subscription listener argument

Subscription listeners receive a single object argument.

Add an object to your emitter call to pass it along to the subscription listener:

```js
events.on(({ hello }) => {})
events.emit({ hello: "world" })
```

Passing an object into the subscriber has the same effect:

```js
events.on(({ hello }) => {}, { hello: "world" })
events.emit()
```

The object argument exists purely to pass along information to the listener. It does not change the signature of the subscribe or emit.

When you pass an object to both subscriber and emitter, they merge together.

The subscription listener argument also contains an `event` property with extra information.

## Prepositions (before or after)

Subscribe to before or after the main subscription listener:

```js
events.on("before", () => {})
events.on(() => {})
events.on("after", () => {})
events.emit()
```

## More subscribers

### On any

Subscribe to any emit:

```js
events.onAny(() => {})
events.emit() // emits
events.emit("hello") // emits
events.emit("hello.world") // emits
events.create() // emits
```

When used with a dot-prop, it subscribes to any child prop emit:

```js
events.onAny("hello", () => {})
events.emit("hello") // emits
events.emit("hello.world") // emits
events.emit() // doesn't emit
```

### On emitted

Like `on`, but emit immediately if a previous emit occurred:

```js
events.emit()
events.onEmitted(() => {}) // emits immediately
events.emit() // emits
```

### On any emitted

Like `onAny`, but emit immediately if a previous emit occurred:

```js
events.emit("hello.world")
events.onAnyEmitted("hello", () => {}) // emits immediately
events.emit("hello.world") // emits
events.emit() // doesn't emit
```

### Once

```js
events.once(() => {})
events.emit() // emits
events.emit() // doesn't emit
```

### Once emitted

Like `once`, but emit immediately if a previous emit occurred:

```js
events.emit()
events.onceEmitted(() => {}) // emits immediately
events.emit() // doesn't emit
```

### Once any

A combination of `once` and `onAny`:

```js
events.onceAny("hello", () => {})
events.emit("hello.world") // emits
events.emit("hello.world") // doesn't emit
```

### Once any emitted

A combination of `once`, `onAny`, and `onEmitted`:

```js
events.emit("hello.world")
events.onceAnyEmitted("hello", () => {}) // emits immediately
events.emit("hello.world") // doesn't emit
```

## Subscriber shorthand

Build lots of subscriptions at once:

```js
events.on([
  [() => {}],
  ["hello.world", () => {}],
  ["create", "hello.world", () => {}],
  ["after", "create", "hello.world", () => {}],
])
```

## All together now

```js
// Define operations
events.op("create")

// Subscriber
events.on(
  "before",         // Preposition
  "create",         // Operation
  "my.prop.id",     // Props
  { x: true }       // Subscription options
  ({ x, y }) => {}, // Subscription listener
)

// Emitter
events.create( // Operation
  "my.prop.id", // Props
  { y: true }   // Susbcription options
)
```
