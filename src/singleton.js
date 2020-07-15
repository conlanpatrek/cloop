import { Looper } from './Looper'

export function loop (cb) {
  return Looper.instance.addHandler(cb)
}
