// Adapted from the Paul Irish gist at https://gist.github.com/paulirish/1579671
// MIT license
const VENDORS = ['ms', 'moz', 'webkit', 'o']
const glob = typeof window === 'undefined' ? {} : window
let raf = glob.requestAnimationFrame
let caf = glob.cancelAnimationFrame
let lastTime = 0

// Try looping through vendors
if (!raf || !caf) {
  for (const vendor of VENDORS) {
    raf = glob[`${vendor}RequestAnimationFrame`]
    caf = glob[`${vendor}CancelAnimationFrame`] || glob[`${vendor}CancelRequestAnimationFrame`]
  }
}

// Create setTimeout fallback
if (!raf || !caf) {
  raf = (callback) => {
    const currTime = Date.now()
    const timeToCall = Math.max(0, 16 - (currTime - lastTime))
    lastTime = currTime + timeToCall
    return setTimeout(() => callback(lastTime), timeToCall)
  }
  caf = id => clearTimeout(id)
}

/**
 * Wait a frame, then call the provided callback.
 *
 * @param {Function} cb
 *
 * @returns {Function} Function that cancels the frame.
 */
export function onFrame (cb) {
  const id = raf(cb)
  return () => caf(id)
}

/**
 * Awaitable frame.
 *
 * @returns {Promise}
 */
export async function frame () {
  return new Promise(onFrame)
}
