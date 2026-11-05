import * as React from 'react'

const MOBILE_BREAKPOINT = 768

function subscribe(callback: () => void) {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

  mql.addEventListener('change', callback)

  return () => mql.removeEventListener('change', callback)
}

function getSnapshot() {
  return window.innerWidth < MOBILE_BREAKPOINT
}

// The server has no viewport, so it always renders the desktop sidebar. The first
// client render must do the same to avoid a hydration mismatch; after mounting,
// React re-reads the snapshot and switches to the mobile sheet when needed.
function getServerSnapshot() {
  return false
}

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
