import {
  init,
  events,
  paint,
  measure,
  network,
  profiler,
  vitals,
  debounce,
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
    // Profile page interactions
    //   * Collect samples every 10ms
    //   * Start the profiler on click, keypress, pointermove, and wheel events
    //   * Stop the profiler after 1s of inactivity
    addEventListener('click', debounceProfiler.current)
    addEventListener('keypress', debounceProfiler.current)
    addEventListener('pointermove', debounceProfiler.current)
    addEventListener('wheel', debounceProfiler.current)

    return () => {
      removeEventListener('click', debounceProfiler.current)
      removeEventListener('keypress', debounceProfiler.current)
      removeEventListener('pointermove', debounceProfiler.current)
      removeEventListener('wheel', debounceProfiler.current)
    }
  }, [])
}
