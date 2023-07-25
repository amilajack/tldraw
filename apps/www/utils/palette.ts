import {
  debounce,
  events,
  init,
  markers,
  network,
  paint,
  profiler,
  vitals,
} from '@palette.dev/browser'
import { useEffect, useRef } from 'react'

init({
  key: 'cl9osspo10001jw089njbjsw4',
  // Collect ui, network, performance events, and profiles
  plugins: [events(), network(), profiler(), markers(), paint(), vitals()],
  version: process.env.NEXT_PUBLIC_COMMIT_SHA,
  debug: true,
})

// Start the profiler on the following events:
profiler.on(
  [
    'paint.click',
    'paint.keydown',
    'paint.scroll',
    'paint.mousemove',
    'markers.measure',
    'events.load',
    'events.dcl',
  ],
  {
    sampleInterval: 1,
    maxBufferSize: 100_000,
  }
)
