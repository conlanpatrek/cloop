import { Looper } from './Looper'

var singleton
function getInstance() {
  if (!singleton) {
    singleton = new Looper()
  }
  return singleton
}

export function loop(cb) {
  return getInstance().addHandler(cb)
}
