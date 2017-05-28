import { onFrame, now } from './onFrame'

export function Looper () {
  this._handlers = []
  this._now = this._last
  this._hasSetNextFrame = false
  this._cancelNextFrame = null

  this.loop = this.loop.bind(this)
  this.nextFrame()
}

Looper.prototype.loop = function loop () {
  this._now = now()
  var delta = this._now - (this._last || this._now)
  for (var i = 0; i < this._handlers.length; i++) {
    this._handlers[i](delta)
  }
  this._last = this._now
  this._hasSetNextFrame = false
  this.nextFrame()
}

Looper.prototype.nextFrame = function nextFrame () {
  if (this._handlers.length && this._hasSetNextFrame === false) {
    this._hasSetNextFrame = true
    this._cancelNextFrame = onFrame(this.loop)
  }
}

Looper.prototype.clearNextFrame = function clearNextFrame () {
  this._cancelNextFrame && this._cancelNextFrame()
}

Looper.prototype.addHandler = function addHandler (handler) {
  this._handlers.push(handler)
  this.nextFrame()
  return this.removeHandler.bind(this, handler)
}

Looper.prototype.removeHandler = function removeHandler (handler) {
  this._handlers = this._handlers.filter(function(h) { return h !== handler })
  if (this._handlers.length === 0) {
    this._last = null
    this.clearNextFrame()
  }
}
