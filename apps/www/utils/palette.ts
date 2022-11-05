import { events, frames, init, measure, network, profiler, vitals } from '@palette.dev/browser'
import { useEffect, useRef } from 'react'

init({
  key: 'cl9osspo10001jw089njbjsw4',
  // Collect click, web vitals, network, performance events, and profiles
  plugins: [events(), vitals(), network(), profiler(), measure(), frames()],
})

let interactionProfilingStarted = false

// -------------------------------------------------------------------
// Profile page load
//   * Collect samples every 10ms
//   * Start the profiler immediately to capture the initial page load
// -------------------------------------------------------------------
if (typeof window !== 'undefined') {
  profiler.start({ sampleInterval: 10, maxBufferSize: 100_000 })
  addEventListener('load', () => {
    performance.measure('load')
    setTimeout(() => {
      if (!interactionProfilingStarted) profiler.stop()
    }, 1_000)
  })
}

// A debounce util for profiling and labeling
const debounce = (start: () => void, stop: () => void, opts = { timeout: 1_000 }) => {
  let timeoutId: number
  return () => {
    if (typeof timeoutId === 'number') {
      clearTimeout(timeoutId)
    } else {
      start()
    }
    timeoutId = window.setTimeout(() => {
      stop()
      timeoutId = undefined
    }, opts.timeout)
  }
}

// Debounce profiler start/stop and key events
export const usePalette = () => {
  const debounceProfiler = useRef(
    debounce(
      () => {
        interactionProfilingStarted = true
        profiler.start({ sampleInterval: 10, maxBufferSize: 100_000 })
      },
      () => {
        interactionProfilingStarted = false
        profiler.stop()
      }
    )
  )

  useEffect(() => {
    // -------------------------------------------------------------------
    // Profile page interactions
    //   * Collect samples every 10ms
    //   * Start the profiler on click, keypress, pointermove, and wheel events
    //   * Stop the profiler after 1s of inactivity
    // -------------------------------------------------------------------
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
