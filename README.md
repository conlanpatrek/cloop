# cloop
A minimal frame looper.

## Installation
`npm install cloop`

## Usage
```
import { loop } from 'cloop'

let target = {
  x: 100,
  y: 50
}

let particle = {
  pixelsPerSecond = 10,
  x: 0,
  y 50
}

let cancel = loop(ms => {
  // Move the particle to the right towards the target
  particle.x = Math.max(
    particle.pixelsPerSecond * ms / 1000,
    target.x
  )

  // If the particle has made it to the target, stop looping
  if (particle.x === target.x) {
    cancel()
  }
})

```
