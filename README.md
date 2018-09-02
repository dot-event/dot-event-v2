# dot-event

Prop-based asynchronous event emitter.

![dot event](dot.gif)

## Install

```bash
npm install --save dot-event
```

## Create emitter

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

## Prop emitter

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
