import { 
  LayoutDashboard, Wand2, FileText, Target,
  FolderOpen, Image as ImageIcon, CheckSquare, Calendar,
  Users, DollarSign, TrendingUp, BarChart3,
  Palette, Settings, LucideIcon
} from 'lucide-react'

export type NavSection = 'WORKSPACE' | 'OPERATIONS' | 'BUSINESS' | 'SYSTEM'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  section: NavSection
  mobilePriority: boolean // true = bottom nav, false = more sheet
  desktopVisible: boolean
  mobileVisible: boolean
}

export const NAVIGATION_CONFIG: NavItem[] = [
  // WORKSPACE
  { label: 'Home', href: '/app', icon: LayoutDashboard, section: 'WORKSPACE', mobilePriority: true, desktopVisible: true, mobileVisible: true },
  { label: 'Studio', href: '/app/studio', icon: Wand2, section: 'WORKSPACE', mobilePriority: true, desktopVisible: true, mobileVisible: true },
  { label: 'Content', href: '/app/content', icon: FileText, section: 'WORKSPACE', mobilePriority: true, desktopVisible: true, mobileVisible: true },
  { label: 'Campaigns', href: '/app/campaigns', icon: Target, section: 'WORKSPACE', mobilePriority: false, desktopVisible: true, mobileVisible: true },

  // OPERATIONS
  { label: 'Projects', href: '/app/projects', icon: FolderOpen, section: 'OPERATIONS', mobilePriority: true, desktopVisible: true, mobileVisible: true },
  { label: 'Assets', href: '/app/assets', icon: ImageIcon, section: 'OPERATIONS', mobilePriority: false, desktopVisible: true, mobileVisible: true },
  { label: 'Review', href: '/app/review', icon: CheckSquare, section: 'OPERATIONS', mobilePriority: false, desktopVisible: true, mobileVisible: true },
  { label: 'Calendar', href: '/app/calendar', icon: Calendar, section: 'OPERATIONS', mobilePriority: false, desktopVisible: true, mobileVisible: true },

  // BUSINESS
  { label: 'Clients', href: '/app/clients', icon: Users, section: 'BUSINESS', mobilePriority: false, desktopVisible: true, mobileVisible: true },
  { label: 'Costs', href: '/app/costs', icon: DollarSign, section: 'BUSINESS', mobilePriority: false, desktopVisible: true, mobileVisible: true },
  { label: 'Profit', href: '/app/profit', icon: TrendingUp, section: 'BUSINESS', mobilePriority: false, desktopVisible: true, mobileVisible: true },
  { label: 'Analytics', href: '/app/analytics', icon: BarChart3, section: 'BUSINESS', mobilePriority: false, desktopVisible: true, mobileVisible: true },

  // SYSTEM
  { label: 'Brand', href: '/app/brand', icon: Palette, section: 'SYSTEM', mobilePriority: false, desktopVisible: true, mobileVisible: true },
  { label: 'Settings', href: '/app/settings', icon: Settings, section: 'SYSTEM', mobilePriority: false, desktopVisible: true, mobileVisible: true },
]
