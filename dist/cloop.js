(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.cloop = {}));
}(this, function (exports) { 'use strict';

  // Adapted from the Paul Irish gist at https://gist.github.com/paulirish/1579671
  // MIT license
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  var glob = typeof window === 'undefined' ? {} : window;
  var raf = glob.requestAnimationFrame;
  var caf = glob.cancelAnimationFrame;

  for (var i = 0; i < vendors.length && (!raf || !caf); i++) {
    raf = glob[vendors[i] + 'RequestAnimationFrame'];
    caf = glob[vendors[i] + 'CancelAnimationFrame'] ||
    glob[vendors[i] + 'CancelRequestAnimationFrame'];
  }

  var now = Date.now || function () { return new Date().getTime() };

  if (!raf || !caf) {
    raf = function (callback) {
      var currTime = now();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      lastTime = currTime + timeToCall;
      return glob.setTimeout(
        function() { callback(lastTime); },
        timeToCall
      )
    };

    caf = function(id) { clearTimeout(id); };
  } else {
    raf = raf.bind(glob);
    caf = caf.bind(glob);
  }

  function onFrame (cb) {
    var id = raf(cb);
    return function () { caf(id); }
  }

  async function frame ()
  {
    return new Promise(onFrame)
  }

  function Looper () {
    this._handlers = [];
    this._now = this._last;
    this._hasSetNextFrame = false;
    this._cancelNextFrame = null;

    this.loop = this.loop.bind(this);
    this.nextFrame();
  }

  Looper.prototype.loop = function loop () {
    this._now = now();
    var delta = this._now - (this._last || this._now);
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
      this._last = null;
      this.clearNextFrame();
    }
  };

  var singleton;
  function getInstance() {
    if (!singleton) {
      singleton = new Looper();
    }
    return singleton
  }

  function loop(cb) {
    return getInstance().addHandler(cb)
  }

  exports.Looper = Looper;
  exports.frame = frame;
  exports.loop = loop;
  exports.now = now;
  exports.onFrame = onFrame;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
