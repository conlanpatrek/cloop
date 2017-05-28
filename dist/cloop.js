(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.cloop = global.cloop || {})));
}(this, (function (exports) { 'use strict';

// Adapted from the Paul Irish gist at https://gist.github.com/paulirish/1579671
// MIT license
var lastTime = 0;
var vendors = ['ms', 'moz', 'webkit', 'o'];
var raf = window.requestAnimationFrame;
var caf = window.cancelAnimationFrame;

for (var i = 0; i < vendors.length && (!raf || !caf); i++) {
  raf = window[vendors[i] + 'RequestAnimationFrame'];
  caf = window[vendors[i] + 'CancelAnimationFrame'] ||
    window[vendors[i] + 'CancelRequestAnimationFrame'];
}

var now = Date.now || function () { return new Date().getTime() };

if (!raf || !caf) {
  raf = function (callback) {
    var currTime = now();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    lastTime = currTime + timeToCall;
    return window.setTimeout(
      function() { callback(lastTime); },
      timeToCall
    )
  };

  caf = function(id) { clearTimeout(id); };
} else {
  raf = raf.bind(window);
  caf = caf.bind(window);
}

function onFrame (cb) {
  var id = raf(cb);
  return function () { caf(id); }
}

function Looper () {
  this._handlers = [];
  this._last = now();
  this._now = this._last;
  this._hasSetNextFrame = false;
  this._cancelNextFrame = null;

  this.loop = this.loop.bind(this);
  this.nextFrame();
}

Looper.prototype.loop = function loop () {
  this._now = now();
  var delta = this._now - this._last;
  for (var i = 0; i < this._handlers.length; i++) {
    this._handlers[i](delta);
  }
  this._last = this._now;
  this._hasSetNextFrame = false;
  this.nextFrame();
};

Looper.prototype.nextFrame = function nextFrame () {
  if (this._handlers.length && this._hasSetNextFrame === false) {
    this._hasSetNextFrame = true;
    this._cancelNextFrame = onFrame(this.loop);
  }
};

Looper.prototype.clearNextFrame = function clearNextFrame () {
  this._cancelNextFrame && this._cancelNextFrame();
};

Looper.prototype.addHandler = function addHandler (handler) {
  this._handlers.push(handler);
  this.nextFrame();
  return this.removeHandler.bind(this, handler)
};

Looper.prototype.removeHandler = function removeHandler (handler) {
  this._handlers = this._handlers.filter(function(h) { return h !== handler });
  if (this._handlers.length === 0) {
    this.clearNextFrame();
  }
};

exports.Looper = Looper;
exports.onFrame = onFrame;

Object.defineProperty(exports, '__esModule', { value: true });

})));
