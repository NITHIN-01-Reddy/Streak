import { useCallback, useEffect, useRef, useState } from 'react'
import { createDetector } from '../stepDetector'
import { useStore } from '../store'
import { dateKey } from '../utils'

export function useStepCounter() {
  const addSteps = useStore((s) => s.addSteps)
  const [active, setActive] = useState(false)
  const [error, setError] = useState('')
  const buffer = useRef(0)
  const gotData = useRef(false)
  const wake = useRef(null)

  // Steps are batched and saved every 2 seconds instead of on every step
  const flush = useCallback(() => {
    if (buffer.current > 0) {
      addSteps(dateKey(), buffer.current)
      buffer.current = 0
    }
  }, [addSteps])

  const start = async () => {
    setError('')
    if (!('DeviceMotionEvent' in window)) {
      setError('Motion sensors are not available on this device. Use your phone, or add steps manually.')
      return
    }
    // iOS requires an explicit permission prompt triggered by a tap
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const res = await DeviceMotionEvent.requestPermission()
        if (res !== 'granted') {
          setError('Motion access was denied. Allow it in Safari settings, then try again.')
          return
        }
      } catch {
        setError('Could not ask for motion access. Open the app over HTTPS and try again.')
        return
      }
    }
    setActive(true)
  }

  const stop = () => setActive(false)

  useEffect(() => {
    if (!active) return
    gotData.current = false

    const detect = createDetector({ onSteps: (n) => (buffer.current += n) })
    const onMotion = (e) => {
      const a = e.accelerationIncludingGravity
      if (!a || a.x == null) return
      gotData.current = true
      detect(Math.hypot(a.x, a.y, a.z), performance.now())
    }
    window.addEventListener('devicemotion', onMotion)

    const timer = setInterval(flush, 2000)
    const check = setTimeout(() => {
      if (!gotData.current) {
        setError('No motion data received. Try on a phone over HTTPS.')
        setActive(false)
      }
    }, 3000)

    // Keep the screen on, because browsers pause sensors when the page is hidden
    const lock = () =>
      navigator.wakeLock?.request('screen').then((l) => (wake.current = l)).catch(() => {})
    lock()
    const onVisible = () => document.visibilityState === 'visible' && lock()
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      window.removeEventListener('devicemotion', onMotion)
      document.removeEventListener('visibilitychange', onVisible)
      clearInterval(timer)
      clearTimeout(check)
      flush()
      wake.current?.release().catch(() => {})
      wake.current = null
    }
  }, [active, flush])

  return { active, error, start, stop }
}