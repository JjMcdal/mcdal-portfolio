export type AppStat = { value: string; label: string }

export type AppProject = {
  name: string
  tagline: string
  description: string
  /** Optional - omit for gradient placeholder cards */
  imageSrc?: string
  /** CSS object-position override. Defaults to 'top center'. */
  imagePosition?: string
  /** External brand color - not a site token. Passed via --app-color inline prop. */
  accentColor: string
  stats: AppStat[]
  badge: string
}

/** @deprecated use AppProject */
export type MobileApp = AppProject

/**
 * Mcdal's projects. Add a screenshot (960x514 works well) in public/ and set
 * imageSrc to replace the gradient card.
 */
export const mobileApps: MobileApp[] = [
  {
    name: 'Pandayo Coffee',
    tagline: 'POS and inventory system for a coffee shop.',
    description:
      'Owners, cashiers and staff sign in and see only what their role allows. Covers login, the POS screen, stock tracking and an admin dashboard. Built with Next.js, TypeScript, Tailwind CSS and Supabase.',
    accentColor: '#0A0A0A',
    stats: [
      { value: '3', label: 'User roles' },
      { value: '4', label: 'Core modules' },
      { value: 'Supabase', label: 'Auth + Postgres' },
    ],
    badge: 'Full-stack',
  },
  {
    name: 'RCV System',
    tagline: 'Regulatory Compliance Verification System.',
    description:
      'My thesis project for the Bureau of Animal Industry. It helps verify regulatory compliance in one place. The frontend is deployed on Vercel.',
    accentColor: '#555555',
    stats: [
      { value: 'Thesis', label: 'Project type' },
      { value: 'BAI', label: 'Client agency' },
      { value: 'Vercel', label: 'Frontend host' },
    ],
    badge: 'Thesis',
  },
]

export const webApps: AppProject[] = []
