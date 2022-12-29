import {
  debounce,
  events,
  init,
  measure,
  network,
  paint,
  profiler,
  vitals,
} from '@palette.dev/browser'
import { useEffect, useRef } from 'react'

init({
  key: 'cl9osspo10001jw089njbjsw4',
  // Collect ui, network, performance events, and profiles
  plugins: [events(), network(), profiler(), measure(), paint(), vitals()],
  version: process.env.NEXT_PUBLIC_COMMIT_SHA,
})

// Profile page load
//   * Sample every 10ms
//   * Start the profiler immediately
if (typeof window !== 'undefined') {
  profiler.start({ sampleInterval: 10, maxBufferSize: 100_000 })
  addEventListener('load', () => {
    performance.measure('load')
  })
}

// Debounce starting and stopping the profiler
export const usePalette = () => {
  const debounceProfiler = useRef(
    debounce(
      () => profiler.stop(),
      () => profiler.start({ sampleInterval: 10, maxBufferSize: 100_000 })
    )
  )

  useEffect(() => {
    const debounceProfilerRef = debounceProfiler.current

    // -------------------------------------------------------------------
    // Profile page interactions
    //   * Collect samples every 10ms
    //   * Start the profiler on click, keypress, mousemove, and wheel events
    //   * Stop the profiler after 1s of inactivity
    // -------------------------------------------------------------------
    addEventListener('click', debounceProfilerRef, {
      capture: true,
    })
    addEventListener('keypress', debounceProfilerRef, {
      capture: true,
    })
    addEventListener('mousemove', debounceProfilerRef, {
      capture: true,
    })
    addEventListener('wheel', debounceProfilerRef, {
      capture: true,
    })

    return () => {
      removeEventListener('click', debounceProfilerRef)
      removeEventListener('keypress', debounceProfilerRef)
      removeEventListener('mousemove', debounceProfilerRef)
      removeEventListener('wheel', debounceProfilerRef)
    }
  }, [])
}
