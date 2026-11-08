'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ArrowUpIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSmoothScroll } from '@/components/providers/SmoothScrollProvider'
import { cn } from '@/lib/utils'

const WORKSPACE_PREFIXES = ['/cms', '/crm', '/dashboard', '/pengaturan']

const ScrollToTop = () => {
  const pathname = usePathname()
  const { scrollTo } = useSmoothScroll()
  const [showScrollButton, setShowScrollButton] = useState(false)

  const isWorkspace = WORKSPACE_PREFIXES.some(
    prefix => pathname === prefix || pathname?.startsWith(`${prefix}/`)
  )

  const handleScrollToTop = () => {
    scrollTo(0, { duration: 1.0 })
  }

  useEffect(() => {
    if (isWorkspace) return

    let frame = 0
    const updateVisibility = () => {
      frame = 0
      setShowScrollButton(window.scrollY > 320)
    }

    const handleScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateVisibility)
    }

    updateVisibility()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [isWorkspace])

  if (isWorkspace) return null

  return (
    <Button
      size='icon'
      aria-label='Kembali ke atas halaman'
      className={cn(
        'fixed right-5 bottom-6 z-40 size-11 cursor-pointer rounded-full bg-[#005090] text-white shadow-[0_10px_25px_-5px_rgba(0,80,144,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#003E70] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005090]',
        showScrollButton
          ? 'translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none translate-y-3 scale-75 opacity-0'
      )}
      onClick={handleScrollToTop}
    >
      <ArrowUpIcon className='size-5' />
      <span className='sr-only'>Kembali ke atas halaman</span>
    </Button>
  )
}

export default ScrollToTop
