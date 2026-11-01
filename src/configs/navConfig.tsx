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
}

export type MenuGroupSubItem = {
  label: string
  childItems: MenuLeafSubItem[]
}

export type MenuSubItem = MenuLeafSubItem | MenuGroupSubItem

export type MenuItem = {
  icon: IconName
  label: string
} & (
  | {
      href: string
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
        label: 'Ringkasan Situs',
        href: '/cms?tab=dashboard'
      }
    ]
  },
  {
    groupLabel: 'Manajemen Konten',
    items: [
      {
        icon: 'FileText',
        label: 'Artikel Blog',
        href: '/cms?tab=posts'
      },
      {
        icon: 'Briefcase',
        label: 'Portofolio Klien',
        href: '/cms?tab=portfolios'
      },
      {
        icon: 'Sparkles',
        label: 'Layanan',
        href: '/cms?tab=services'
      },
      {
        icon: 'Image',
        label: 'Gambar & Berkas',
        href: '/cms?tab=media'
      }
    ]
  },
  {
    groupLabel: 'Calon Klien & Pelengkap',
    items: [
      {
        icon: 'Users',
        label: 'Calon Klien Masuk',
        href: '/cms?tab=crm'
      },
      {
        icon: 'Layers',
        label: 'Konten Pendukung',
        childItems: [
          {
            label: 'Testimonial Klien',
            href: '/cms?tab=structured&sub=testimonials'
          },
          {
            label: 'Tanya Jawab (FAQ)',
            href: '/cms?tab=structured&sub=faqs'
          },
          {
            label: 'Halaman Statis',
            href: '/cms?tab=structured&sub=pages'
          },
          {
            label: 'Pengalihan Alamat',
            href: '/cms?tab=structured&sub=redirects'
          }
        ]
      }
    ]
  },
  {
    groupLabel: 'Pengaturan',
    items: [
      {
        icon: 'ShieldAlert',
        label: 'Penanganan Darurat',
        href: '/cms?tab=emergency'
      },
      {
        icon: 'UserCheck',
        label: 'Profil Saya',
        href: '/cms?tab=profile'
      }
    ]
  }
]
