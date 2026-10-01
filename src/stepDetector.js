export function createDetector({ threshold = 1.4, minGap = 300, onSteps }) {
  let base = 9.81
  let smooth = 0
  let above = false
  let last = 0
  let pending = 0

  return function push(mag, now) {
    base = 0.995 * base + 0.005 * mag // very slow drift correction
    smooth = 0.5 * smooth + 0.5 * (mag - base)

    if (!above && smooth > threshold && now - last > minGap) {
      above = true
      if (now - last > 1500) pending = 0 // long pause: restart the walking check
      last = now
      pending++
      // Require 4 steps in a rhythm before counting, so a single bump or shake is ignored
      if (pending === 4) onSteps(4)
      else if (pending > 4) onSteps(1)
    } else if (above && smooth < threshold * 0.4) {
      above = false
    }
  }
}