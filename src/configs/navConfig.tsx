// Third-party Imports
import type * as Icon from 'lucide-react'

type IconName = keyof typeof Icon

export type MenuLeafSubItem = {
  label: string
  href: string
  activePath?: string
  badge?: string
  badgeClassName?: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  adminOnly?: boolean
}

export type MenuGroupSubItem = {
  label: string
  childItems: MenuLeafSubItem[]
}

export type MenuSubItem = MenuLeafSubItem | MenuGroupSubItem

export type MenuItem = {
  icon: IconName
  label: string
  adminOnly?: boolean
} & (
  | {
      href: string
      activePath?: string
      badge?: string
      badgeClassName?: string
      childItems?: never
      target?: '_blank' | '_self' | '_parent' | '_top'
    }
  | {
      href?: never
      badge?: string
      badgeClassName?: string
      childItems: MenuSubItem[]
    }
)

export type NavItem = {
  groupLabel?: string
  items: MenuItem[]
}

export const navItems: NavItem[] = [
  {
    groupLabel: 'Ringkasan',
    items: [
      {
        icon: 'Package',
        label: 'Dashboard',
        href: '/dashboard'
      }
    ]
  },
  {
    groupLabel: 'Manajemen Konten',
    items: [
      {
        icon: 'FileText',
        label: 'Artikel Blog',
        href: '/cms/artikel',
        activePath: '/cms/artikel'
      },
      {
        icon: 'Briefcase',
        label: 'Portofolio Klien',
        href: '/cms/portofolio'
      },
      {
        icon: 'Sparkles',
        label: 'Layanan',
        href: '/cms/layanan'
      },
      {
        icon: 'Image',
        label: 'Gambar & Berkas',
        href: '/cms/media'
      },
      {
        icon: 'Layers',
        label: 'Konten Pendukung',
        childItems: [
          {
            label: 'Testimonial Klien',
            href: '/cms/konten-pendukung/testimoni'
          },
          {
            label: 'Tanya Jawab (FAQ)',
            href: '/cms/konten-pendukung/faq'
          },
          {
            label: 'Halaman Statis',
            href: '/cms/konten-pendukung/halaman'
          },
          {
            label: 'Pengalihan Alamat',
            href: '/cms/konten-pendukung/pengalihan'
          }
        ]
      }
    ]
  },
  {
    groupLabel: 'CRM',
    items: [
      {
        icon: 'Users',
        label: 'Calon Klien Masuk',
        href: '/crm/calon-klien'
      },
      {
        icon: 'CalendarClock',
        label: 'Jadwal & Agenda',
        href: '/crm/jadwal'
      }
    ]
  },
  {
    groupLabel: 'Pengaturan',
    items: [
      {
        icon: 'ShieldAlert',
        label: 'Penanganan Darurat',
        href: '/pengaturan/darurat'
      },
      {
        icon: 'UserCog',
        label: 'Anggota Tim',
        href: '/pengaturan/anggota',
        adminOnly: true
      },
      {
        icon: 'UserCheck',
        label: 'Profil Saya',
        href: '/pengaturan/profil'
      }
    ]
  }
]
