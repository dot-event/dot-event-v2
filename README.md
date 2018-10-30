# dot-event

Powerful event emitter.

![dot event](dot.gif)

## Install

```bash
npm install --save dot-event
```

## Start simple

Part of the beauty of the `dot-event` API is that it can shrink down to incredibly simple functionality.

Here we have the simplest possible subscriber and emitter:

```js
import dotEvent from "dot-event"

const events = dotEvent()
events.on(() => {
  /* do something */
})
events.emit()
```

Subscription listeners can be asynchronous:

```js
events.on(async () => {})
await events.emit()
```

The emitter returns a promise that waits for listeners to resolve.

## Dot-props

Use dot-props to maintain distinct subscriptions:

```js
events.on("emit.hello.world", () => {})
events.emit("hello.world") // emits
events.emit() // doesn't emit
```

Dot-props come in handy with the `onAny` subscriber, which subscribes to a dot-prop **and its child props**:

```js
events.onAny("emit.hello", () => {})
events.emit("hello") // emits
events.emit("hello.world") // emits
events.emit() // doesn't emit
```

## Operations

Why do we have to specify `emit` before the the prop in this example?

```js
events.on("emit.hello", () => {})
events.emit("hello")
```

Because `emit` is an "operation", and you can have more than one.

First, define the operation:

```js
events.setOp("create")
```

Then use it:

```js
events.on("create", () => {})
events.create() // emits the create operation
```

Operation functions take the same arguments and behave similar to `emit`.

## Subscription listener argument

Subscription listeners receive a single object argument. To add to that object, pass an object to the emitter:

```js
events.on(({ hello }) => {
  /* hello === "world" */
})
events.emit({ hello: "world" })
```

Or use `withOptions` on the subscriber:

```js
events.withOptions({ hello: "world" }).on(({ hello }) => {})
events.emit()
```

The listener argument also contains an `event` property with extra information, such as the emitter arguments:

```js
events.on(({ event }) => {
  event.args // [123, true]
})
events.emit(123, true)
```

## Prepositions (before or after)

Subscribe to before or after the main subscription listener:

```js
events.on("before", () => {
  /* 1 */
})
events.on(() => {
  /* 2 */
})
events.on("after", () => {
  /* 3 */
})
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
events.onAny("emit.hello", () => {})
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
events.onAnyEmitted("emit.hello", () => {}) // emits immediately
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
events.onceAny("emit.hello", () => {})
events.emit("hello.world") // emits
events.emit("hello.world") // doesn't emit
```

### Once any emitted

A combination of `once`, `onAny`, and `onEmitted`:

```js
events.emit("hello.world")
events.onceAnyEmitted("emit.hello", () => {}) // emits immediately
events.emit("hello.world") // doesn't emit
```

## Subscriber shorthand

Build lots of dot-prop subscriptions at once:

```js
events.on({
  "emit.hello": () => {},
  "emit.hello.world": () => {},
})
```

## Test matrix

| Function         | Features                                                                           | Empty | Props | Wildcard | Prop variable | Wildcard op |
| :--------------- | :--------------------------------------------------------------------------------- | :---: | :---: | :------: | :-----------: | :---------: |
| `after`          | Subscribes to after emit                                                           |   ✗   |   ✗   |    ✗     |       ✗       |      ✗      |
| `before`         | Subscribes to before emit                                                          |   ✗   |   ✗   |    ✗     |       ✗       |      ✗      |
| `emit`           | Emits                                                                              |   ✗   |   ✗   |    ✗     |       ✗       |      ✗      |
| `on`             | Subscribes                                                                         |   ✗   |   ✗   |    ✗     |       ✗       |      ✗      |
| `onAny`          | Subscribes to child props                                                          |   ✓   |   ✓   |    ✓     |       ✓       |      ✓      |
| `onAnyEmitted`   | Subscribes to child prop<br/>Emit immediately if emitted                           |   ✓   |   ✓   |    ✓     |       ✓       |      ✓      |
| `onEmitted`      | Emit immediately if emitted                                                        |   ✗   |   ✗   |    ✗     |       ✗       |      ✗      |
| `once`           | Subscribes once<br/>Returns promise                                                |   ✗   |   ✗   |    ✗     |       ✗       |      ✗      |
| `onceAny`        | Subscribes to child props once<br/>Returns promise                                 |   ✓   |   ✓   |    ✓     |       ✓       |      ✓      |
| `onceAnyEmitted` | Subscribes to child props once<br/>Emit immediately if emitted<br/>Returns promise |   ✓   |   ✓   |    ✓     |       ✓       |      ✓      |
| `onceEmitted`    | Subscribes to child props once<br/>Emit immediately if emitted<br/>Returns promise |   ✗   |   ✗   |    ✗     |       ✗       |      ✗      |
| `withOptions`    | Adds options to emit<br/>Adds options to subscribe                                 |   ✗   |   ✗   |    ✗     |       ✗       |      ✗      |
