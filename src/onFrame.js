// Adapted from the Paul Irish gist at https://gist.github.com/paulirish/1579671
// MIT license
var lastTime = 0
var vendors = ['ms', 'moz', 'webkit', 'o']
var raf = window.requestAnimationFrame
var caf = window.cancelAnimationFrame

for (var i = 0; i < vendors.length && (!raf || !caf); i++) {
  raf = window[vendors[i] + 'RequestAnimationFrame']
  caf = window[vendors[i] + 'CancelAnimationFrame'] ||
    window[vendors[i] + 'CancelRequestAnimationFrame']
}

export var now = Date.now || function () { return new Date().getTime() }

if (!raf || !caf) {
  raf = function (callback) {
    var currTime = now()
    var timeToCall = Math.max(0, 16 - (currTime - lastTime))
    lastTime = currTime + timeToCall
    return window.setTimeout(
      function() { callback(lastTime) },
      timeToCall
    )
  }

  caf = function(id) { clearTimeout(id) }
} else {
  raf = raf.bind(window)
  caf = caf.bind(window)
}

export function onFrame (cb) {
  var id = raf(cb)
  return function () { caf(id) }
}
