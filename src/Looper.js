import { onFrame } from './onFrame'

export class Looper {
  /**
   * Get singleton instance
   *
   * @type { Looper }
   */
  static get instance () {
    if (!this._instance) this._instance = new Looper()
    return this._instance
  }

  constructor () {
    this._handlers = []
    this._lastFrame = null
    this._hasSetNextFrame = false
    this._cancelNextFrame = null
    this.loop = this.loop.bind(this)
  }

  /**
   * Called once per frame. Calculates the time between last frame and
   * this frame and calls all of the handlers.
   *
   * Schedules the next frame.
   */
  loop () {
    const now = Date.now()
    const delta = now - (this._lastFrame || now)
    this.callHandlers(delta)
    this._lastFrame = now
    this._hasSetNextFrame = false
    this.nextFrame()
  }

  /**
   * Call each handler with a delta.
   *
   * @param  {Number} delta The time differenc ebetween last frame and this one.
   */
  callHandlers (delta) {
    for (const handler of this._handlers) {
      try {
        handler(delta)
      } catch (e) {
        console.error(`Error in loop handler: ${e}`)
      }
    }
  }

  /**
   * Schedule the next frame.
   */
  nextFrame () {
    if (this._handlers.length && this._hasSetNextFrame === false) {
      this._hasSetNextFrame = true
      this._cancelNextFrame = onFrame(this.loop)
    }
  }

  /**
   * Cancel the next frame
   */
  clearNextFrame () {
    this._cancelNextFrame && this._cancelNextFrame()
    this._cancelNextFrame = null
    this._hasSetNextFrame = false
  }

  /**
   * Add a job to run on frame
   *
   * @param {Function} handler
   *
   * @return {Function} a function that unsubscribes the handler.
   */
  addHandler (handler) {
    this._handlers.push(handler)
    this.nextFrame()
    return this.removeHandler.bind(this, handler)
  }

  /**
   * Remove a handler from the list. Stops the loop if there
   * are no more listeners.
   *
   * @param {Function} handler
   */
  removeHandler (handler) {
    this._handlers = this._handlers.filter(function (h) { return h !== handler })
    if (this._handlers.length === 0) {
      this._lastFrame = null
      this.clearNextFrame()
    }
  }
}
