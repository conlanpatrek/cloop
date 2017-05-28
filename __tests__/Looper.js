/* eslint-env jest */

let Looper = require('../dist/cloop').Looper

describe('Looper', () => {
  let looper
  let handler

  const fastForward = (frames = 1) => {
    while (frames--) {
      jest.runOnlyPendingTimers()
    }
  }

  beforeEach(() => {
    jest.useFakeTimers()
    looper = new Looper()
    looper.loop = jest.fn(looper.loop)
    handler = jest.fn()
  })

  describe('addHandler', () => {
    it('should add a handler to the list', () => {
      looper.addHandler(handler)
      expect(looper._handlers.length).toBe(1)
    })

    it('should return an unsubscribe function', () => {
      let unsub = looper.addHandler(handler)
      unsub()
      expect(looper._handlers.length).toBe(0)
    })
  })

  describe('looping', () => {
    describe('with zero handlers', () => {
      it('should not run the loop callback', () => {
        fastForward()
        expect(looper.loop).not.toHaveBeenCalled()
      })
    })

    describe('with handlers', () => {
      it('should run the loop callback per frame', () => {
        looper.addHandler(handler)
        fastForward()
        expect(looper.loop).toHaveBeenCalled()
      })

      it('should run the handlers per frame', () => {
        looper.addHandler(handler)
        fastForward()
        expect(handler).toHaveBeenCalled()
      })
    })
  })

  describe('removeHandler', () => {
    let one, two
    beforeEach(() => {
      one = jest.fn()
      two = jest.fn()
      looper.addHandler(one)
      looper.addHandler(handler)
      looper.addHandler(two)
    })
    it('should remove a handler from the list by reference', () => {
      looper.removeHandler(handler)
      expect(looper._handlers.length).toBe(2)
    })
    it('should noop when there isn\'t a matching handler', () => {
      looper.removeHandler('monkey')
      expect(looper._handlers.length).toBe(3)
    })
    it('should cancel the next frame when removing to zero', () => {
      looper.removeHandler(handler)
      looper.removeHandler(one)
      looper.removeHandler(two)
      expect(looper._handlers.length).toBe(0)
      fastForward()
      expect(looper.loop).not.toHaveBeenCalled()
    })
  })
})
