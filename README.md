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

Subscription listeners receive a single object argument. To add to that object, use the `withOptions` function on emit:

```js
events.on(({ hello }) => {})
events.withOptions({ hello: "world" }).emit()
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

## Operation

An "operation" is a way to namespace your events and make a custom emitter function:

```js
events.withOp("create").on(() => {})
events.create() // emits
```

Operation functions take the same arguments and behave similar to `emit`.

## Prepositions (before or after)

Subscribe to before or after the main subscription listener:

```js
events.before().on(() => {})
events.on(() => {})
events.after().on(() => {})
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

Build lots of dot-prop subscriptions at once:

```js
events.on({
  hello: () => {},
  "hello.world": () => {},
})
```

## Test matrix

| Function       | Features                                                                           | Empty | Props | Wildcard | Prop variable | Wildcard op |
| :------------- | :--------------------------------------------------------------------------------- | :---: | :---: | :------: | :-----------: | :---------: |
| after          | Subscribes to after emit                                                           |   ✗   |   ✗   |    ✗     |       ✗       |      ✗      |
| before         | Subscribes to before emit                                                          |   ✗   |   ✗   |    ✗     |       ✗       |      ✗      |
| emit           | Emits                                                                              |   ✗   |   ✗   |    ✗     |       ✗       |      ✗      |
| on             | Subscribes                                                                         |   ✗   |   ✗   |    ✗     |       ✗       |      ✗      |
| onAny          | Subscribes to child props                                                          |   ✓   |   ✓   |    ✓     |       ✓       |      ✓      |
| onAnyEmitted   | Subscribes to child prop, emit immediately if previous emit                        |   ✓   |   ✓   |    ✓     |       ✓       |      ✓      |
| onEmitted      | Emit immediately if previous emit                                                  |   ✗   |   ✗   |    ✗     |       ✗       |      ✗      |
| once           | Subscribes once, returns promise                                                   |   ✗   |   ✗   |    ✗     |       ✗       |      ✗      |
| onceAny        | Subscribes to child props once, returns promise                                    |   ✗   |   ✗   |    ✗     |       ✗       |      ✗      |
| onceAnyEmitted | Subscribes to child props once, emit immediately if previous emit, returns promise |   ✗   |   ✗   |    ✗     |       ✗       |      ✗      |
| onceEmitted    | Subscribes to child props once, emit immediately if previous emit, returns promise |   ✗   |   ✗   |    ✗     |       ✗       |      ✗      |
| withOptions    | Adds options to emit, adds options to subscribe                                    |   ✗   |   ✗   |    ✗     |       ✗       |      ✗      |
