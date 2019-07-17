// Adapted from the Paul Irish gist at https://gist.github.com/paulirish/1579671
// MIT license
var lastTime = 0
var vendors = ['ms', 'moz', 'webkit', 'o']
var glob = typeof window === 'undefined' ? {} : window
var raf = glob.requestAnimationFrame
var caf = glob.cancelAnimationFrame

for (var i = 0; i < vendors.length && (!raf || !caf); i++) {
  raf = glob[vendors[i] + 'RequestAnimationFrame']
  caf = glob[vendors[i] + 'CancelAnimationFrame'] ||
  glob[vendors[i] + 'CancelRequestAnimationFrame']
}

export var now = Date.now || function () { return new Date().getTime() }

if (!raf || !caf) {
  raf = function (callback) {
    var currTime = now()
    var timeToCall = Math.max(0, 16 - (currTime - lastTime))
    lastTime = currTime + timeToCall
    return glob.setTimeout(
      function() { callback(lastTime) },
      timeToCall
    )
  }

  caf = function(id) { clearTimeout(id) }
} else {
  raf = raf.bind(glob)
  caf = caf.bind(glob)
}

export function onFrame (cb) {
  var id = raf(cb)
  return function () { caf(id) }
}

export async function frame ()
{
  return new Promise(onFrame)
}
