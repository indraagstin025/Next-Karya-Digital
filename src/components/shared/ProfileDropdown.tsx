'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Third-party Imports
import { LogOutIcon, SettingsIcon, UserIcon, ShieldAlertIcon } from 'lucide-react'

// Component Imports
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

interface StaffUserData {
  id: string
  fullName: string
  email: string
  jobTitle?: string
  role?: string
}

function getInitials(name?: string): string {
  if (!name || typeof name !== 'string') return 'NK'
  return (
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase() || '')
      .join('') || 'NK'
  )
}

const ProfileDropdown = () => {
  const router = useRouter()
  const [user, setUser] = useState<StaffUserData | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    let isMounted = true
    async function fetchMe() {
      try {
        const res = await fetch('/api/cms/auth/me', { cache: 'no-store' })
        if (res.ok) {
          const json = await res.json()
          const data = json?.data?.user ?? json?.data
          if (isMounted && data && typeof data.fullName === 'string') {
            setUser(data)
          }
        }
      } catch {
        // Fallback gracefully
      }
    }
    fetchMe()
    return () => {
      isMounted = false
    }
  }, [])

  const handleSignOut = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await fetch('/api/cms/auth/logout', { method: 'POST' })
    } catch {
      // Ignore network errors on signout
    } finally {
      window.location.href = '/'
    }
  }

  const displayName = user?.fullName || 'Staff Next Karya'
  const displayEmail = user?.email || 'staff@nextkarya.web.id'
  const displayRole = user?.jobTitle || 'Command Center Staff'
  const initials = getInitials(displayName)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant='ghost' size='icon' className='relative rounded-full hover:bg-transparent' />}
      >
        <Avatar>
          <AvatarImage src='/images/avatars/avatar-1.webp' alt={displayName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className='ring-card absolute right-0 bottom-0 block size-2 rounded-full bg-green-600 ring-2' />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-64'>
        <DropdownMenuGroup>
          <DropdownMenuLabel className='flex items-center gap-4 px-2 py-2.5 font-normal'>
            <div className='relative'>
              <Avatar className='size-10'>
                <AvatarImage src='/images/avatars/avatar-1.webp' alt={displayName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className='ring-card absolute right-0 bottom-0 block size-2 rounded-full bg-green-600 ring-2' />
            </div>
            <div className='flex flex-1 flex-col items-start min-w-0'>
              <span className='text-foreground text-sm font-semibold truncate w-full'>{displayName}</span>
              <span className='text-muted-foreground text-xs truncate w-full'>{displayEmail}</span>
              <span className='text-[10px] text-primary font-medium uppercase mt-0.5'>{displayRole}</span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href='/cms?tab=profile' />}>
            <UserIcon className='size-4' />
            <span>Profil Akun</span>
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href='/cms?tab=emergency' />}>
            <ShieldAlertIcon className='size-4' />
            <span>Emergency Recovery</span>
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href='/' target='_blank' />}>
            <SettingsIcon className='size-4' />
            <span>Buka Website Publik</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            variant='destructive'
            disabled={isLoggingOut}
            onClick={handleSignOut}
            className='cursor-pointer'
          >
            <LogOutIcon className='size-4' />
            <span>{isLoggingOut ? 'Sedang keluar...' : 'Keluar Sistem'}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileDropdown
