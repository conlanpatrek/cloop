import { onFrame, now } from './onFrame'

export class Looper {
  static get instance () {
    if (!this._instance) this._instance = new Looper()
    return this._instance
  }

  constructor () {
    this._handlers = []
    this._now = this._last
    this._hasSetNextFrame = false
    this._cancelNextFrame = null
    this.loop = this.loop.bind(this)
    this.nextFrame()
  }

  loop () {
    this._now = now()
    var delta = this._now - (this._last || this._now)
    for (var i = 0; i < this._handlers.length; i++) {
      this._handlers[i](delta)
    }
    this._last = this._now
    this._hasSetNextFrame = false
    this.nextFrame()
  }

  nextFrame () {
    if (this._handlers.length && this._hasSetNextFrame === false) {
      this._hasSetNextFrame = true
      this._cancelNextFrame = onFrame(this.loop)
    }
  }

  clearNextFrame () {
    this._cancelNextFrame && this._cancelNextFrame()
    this._cancelNextFrame = null
    this._hasSetNextFrame = false
  }

  addHandler (handler) {
    this._handlers.push(handler)
    this.nextFrame()
    return this.removeHandler.bind(this, handler)
  }

  removeHandler (handler) {
    this._handlers = this._handlers.filter(function (h) { return h !== handler })
    if (this._handlers.length === 0) {
      this._last = null
      this.clearNextFrame()
    }
  }
}
