import { useState, useCallback, useEffect, useRef } from 'react'
import {
  ArrowSquareOut,
  House,
  SquaresFour,
  UsersThree,
  MagnifyingGlass,
  Toolbox,
  BookOpen,
  Lightning,
  Sparkle,
  Crown,
  CaretLeft,
  CaretRight,
  PencilSimple,
  ChatCircleDots,
  Headphones,
  Timer,
  ChatCircle,
  Bell,
  ClockCounterClockwise,
  CheckCircle,
  Plus,
  Kanban,
  Briefcase,
  MapPinLine,
  FileArrowUp,
  ImageSquare,
  FilePdf,
  TextAa,
  QrCode,
  Scissors,
  ArrowsOutSimple,
  Microphone,
  ClosedCaptioning,
  MagicWand,
  Star,
  Quotes,
  Pause,
  Play,
} from '@/components/slab'
import type { Icon } from '@/components/slab'

/**
 * Flagship - "Main build" callout. Used at the bottom of Projects and as the
 * body of the /showcase page. Showcases one product via a 5-tab carousel and
 * a horizontal marquee of user feedback.
 *
 * Architecture:
 *   - Tabs control the carousel slide. Click to switch instantly.
 *   - The active slide auto-advances every 6s but pauses on hover and
 *     when the carousel is offscreen (IntersectionObserver) so it does
 *     not chew CPU when the user is reading the rest of the page.
 *   - Feedback marquee is a CSS keyframe; the track is duplicated so
 *     the loop seams cleanly. Pauses on hover.
 *
 * The preview is NOT a screenshot. Every slide is a hand-built HTML/CSS
 * mock of an app UI rendered from the data below, so it stays crisp at any
 * size and ships zero image bytes. The mock sits on a container-query stage
 * (.flagship__stage) whose font-size is the single scale knob - every
 * dimension inside is in em, so the whole composition shrinks proportionally
 * on a phone instead of reflowing into a wireframe. That also means every
 * Phosphor icon in the mock takes an em size, never px.
 *
 * The mock runs its own BLUE accent, separate from the site accent, so it
 * reads as a separate product. To make it look like YOUR product, edit the
 * data arrays below (tabs, nav, board, features, listings, records).
 */

type TabId = 'announcement' | 'desk' | 'work' | 'tools' | 'leads'

/** Sidebar rows, in the order the mock app lists them. */
type NavId = 'announcement' | 'desk' | 'community' | 'work' | 'tools' | 'guides' | 'learn' | 'premium'

type FlagshipTab = {
  id: TabId
  label: string
  /** URL path echoed in the faux browser chrome. */
  path: string
  /** Page name in the app's own chrome strip. */
  pageTitle: string
  /** Which sidebar row lights up on this slide. */
  nav: NavId
  caption: string
  Icon: Icon
}

const TABS: FlagshipTab[] = [
  {
    id: 'announcement',
    label: 'Home',
    path: '/home',
    pageTitle: 'Home',
    nav: 'announcement',
    caption:
      'A focused home screen that shows the current state of the work, the next useful actions, and recent updates at a glance.',
    Icon: House,
  },
  {
    id: 'desk',
    label: 'Board',
    path: '/board',
    pageTitle: 'Board',
    nav: 'desk',
    caption:
      'A shared board for turning ideas into visible tasks, moving work forward, and keeping the next decision clear.',
    Icon: Kanban,
  },
  {
    id: 'work',
    label: 'Listings',
    path: '/listings',
    pageTitle: 'Listings',
    nav: 'work',
    caption:
      'A searchable list that keeps useful records together, with the source and status visible before anyone opens a detail view.',
    Icon: Briefcase,
  },
  {
    id: 'tools',
    label: 'Features',
    path: '/features',
    pageTitle: 'Features',
    nav: 'tools',
    caption:
      'A compact toolbox for the repeated actions around a project: upload, organize, transform, and share.',
    Icon: Toolbox,
  },
  {
    id: 'leads',
    label: 'Search',
    path: '/search',
    pageTitle: 'Search',
    nav: 'desk',
    caption:
      'A finder that turns a few filters into a ranked shortlist, so the useful results are easier to compare.',
    Icon: MapPinLine,
  },
]

/* ---- Mock data. Decorative only (the device is aria-hidden). Replace the
   labels with the real screens of your product so the preview is honest. */

const NAV: { id: NavId; label: string; Icon: Icon; sub?: boolean; pro?: boolean }[] = [
  { id: 'announcement', label: 'Home', Icon: House },
  { id: 'desk', label: 'Board', Icon: SquaresFour, sub: true },
  { id: 'community', label: 'Community', Icon: UsersThree, sub: true },
  { id: 'work', label: 'Listings', Icon: MagnifyingGlass, sub: true },
  { id: 'tools', label: 'Features', Icon: Toolbox, sub: true },
  { id: 'guides', label: 'Docs', Icon: BookOpen, sub: true },
  { id: 'learn', label: 'Learn', Icon: Lightning, sub: true },
  { id: 'premium', label: 'Premium', Icon: Sparkle, pro: true },
]

/* Two-zone clock card in the sidebar. Times are static - a live clock would
   be a timer running behind a decorative screenshot. */
const CLOCKS = [
  { time: '9:00', meridiem: 'AM', zone: 'Zone A GMT+0' },
  { time: '5:00', meridiem: 'AM', zone: 'Zone B GMT-4' },
]

const CHROME_ICONS: Icon[] = [Headphones, Timer, ChatCircle, Bell, ClockCounterClockwise]

const GO_TO = ['Board', 'Features', 'Search', 'Settings']

type Update = {
  date: string
  year: string
  ago: string
  kind: 'New' | 'Improved'
  title: string
  text: string
}

const UPDATES: Update[] = [
  {
    date: 'Jan 5',
    year: '2026',
    ago: '2 days ago',
    kind: 'New',
    title: 'Clearer project overview',
    text: 'The home view now puts current work, next actions, and recent updates in one calm starting point.',
  },
  {
    date: 'Jan 3',
    year: '2026',
    ago: '4 days ago',
    kind: 'Improved',
    title: 'Faster task handoff',
    text: 'Board cards carry their status and owner together, making the next handoff easier to understand.',
  },
  {
    date: 'Jan 1',
    year: '2026',
    ago: '6 days ago',
    kind: 'New',
    title: 'Search that stays useful',
    text: 'Filters and result context stay visible so people can compare options without losing their place.',
  },
]

type Task = { title: string; tag: string; mine?: boolean }

const BOARD: { name: string; tasks: Task[] }[] = [
  {
    name: 'To do',
    tasks: [
      { title: 'Map the user flow', tag: 'Research', mine: true },
      { title: 'Review requirements', tag: 'Planning' },
      { title: 'Prepare test cases', tag: 'QA', mine: true },
      { title: 'Confirm launch notes', tag: 'Docs' },
    ],
  },
  {
    name: 'In progress',
    tasks: [
      { title: 'Build the first screen', tag: 'Build' },
      { title: 'Connect the data', tag: 'Backend', mine: true },
      { title: 'Check empty states', tag: 'QA' },
    ],
  },
  {
    name: 'Review',
    tasks: [
      { title: 'Run responsive checks', tag: 'QA' },
      { title: 'Polish the handoff', tag: 'Review' },
      { title: 'Verify the happy path', tag: 'QA', mine: true },
    ],
  },
  {
    name: 'Done',
    tasks: [
      { title: 'Ship the tested build', tag: 'Release', mine: true },
      { title: 'Document the decisions', tag: 'Docs' },
      { title: 'Review the next step', tag: 'Planning' },
    ],
  },
]

type Tool = { name: string; note: string; Icon: Icon; pro?: boolean }

const TOOLS: Tool[] = [
  { name: 'Upload files', note: 'Bring source material into the workspace', Icon: FileArrowUp },
  { name: 'Visual review', note: 'Keep important details easy to inspect', Icon: ImageSquare },
  { name: 'Export reports', note: 'Share a clear record of the work', Icon: FilePdf },
  { name: 'Write notes', note: 'Capture decisions while they are fresh', Icon: TextAa },
  { name: 'Generate codes', note: 'Create scannable handoff details', Icon: QrCode },
  { name: 'Trim content', note: 'Remove noise from the final result', Icon: Scissors },
  { name: 'Expand views', note: 'Give complex work room to breathe', Icon: ArrowsOutSimple },
  { name: 'Record context', note: 'Leave a useful voice note for the team', Icon: Microphone },
  { name: 'Add captions', note: 'Make shared media easier to follow', Icon: ClosedCaptioning, pro: true },
  { name: 'Polish output', note: 'Finish the details before handoff', Icon: MagicWand },
]

const TOOL_FILTERS = ['All 10', 'Group A', 'Group B', 'Group C', 'Group D', 'Group E']

type Job = {
  source: string
  /** Picks one of the three source pill colours. */
  tone: 'olj' | 'linkedin' | 'jobstreet'
  title: string
  rate: string
  posted: string
  state: 'Applied' | 'Saved' | 'New'
}

const JOBS: Job[] = [
  { source: 'GitHub', tone: 'olj', title: 'Frontend Engineer · React and TypeScript', rate: 'Remote', posted: '2h ago', state: 'Applied' },
  { source: 'LinkedIn', tone: 'linkedin', title: 'QA Automation Intern', rate: 'Hybrid', posted: '5h ago', state: 'Saved' },
  { source: 'JobStreet', tone: 'jobstreet', title: 'Full-stack Developer · Next.js', rate: 'Metro Manila', posted: '6h ago', state: 'New' },
  { source: 'GitHub', tone: 'olj', title: 'Product Engineer · Internal Tools', rate: 'Remote', posted: '9h ago', state: 'Saved' },
  { source: 'LinkedIn', tone: 'linkedin', title: 'Software Tester · Web Applications', rate: 'Hybrid', posted: '1d ago', state: 'New' },
]

type Lead = {
  name: string
  place: string
  rating: string
  reviews: string
  score: number
  angle: string
}

const LEADS: Lead[] = [
  { name: 'Pandayo Coffee', place: 'Cebu City', rating: '4.8', reviews: '212', score: 91, angle: 'POS' },
  { name: 'RCV System', place: 'Quezon City', rating: '4.6', reviews: '148', score: 84, angle: 'Compliance' },
  { name: 'QA Helper', place: 'Metro Manila', rating: '4.4', reviews: '96', score: 72, angle: 'Testing' },
  { name: 'Workflow Capture', place: 'Remote', rating: '4.9', reviews: '61', score: 65, angle: 'Research' },
  { name: 'Portfolio build', place: 'Metro Manila', rating: '4.2', reviews: '44', score: 58, angle: 'Showcase' },
]

/* ---- The app shell. Every slide renders inside this, so switching tabs
   moves the active pill in the sidebar and retitles the chrome strip the
   way a real navigation does. Pure markup, no images, no network. The
   parent device is aria-hidden, so none of this reaches the a11y tree. */

function Shell({ tab, children }: { tab: FlagshipTab; children: React.ReactNode }) {
  return (
    <div className="flagship__app">
      <aside className="flagship__side" style={{ ['--i' as string]: 0 }}>
        <div className="flagship__side-head">
          <span className="flagship__logo">
            <Sparkle weight="fill" size="1.05em" />
          </span>
          <span className="flagship__wordmark">
            Product<span className="flagship__wordmark-accent">Name</span>
          </span>
          <span className="flagship__collapse">
            <CaretLeft weight="bold" size="0.8em" />
          </span>
        </div>

        <div className="flagship__clock">
          {CLOCKS.map((c) => (
            <span key={c.zone} className="flagship__clock-row">
              <span className="flagship__clock-time">
                {c.time}
                <span className="flagship__clock-meridiem">{c.meridiem}</span>
              </span>
              <span className="flagship__clock-zone">{c.zone}</span>
            </span>
          ))}
        </div>

        <div className="flagship__nav">
          {NAV.map((n) => {
            const NavIcon = n.Icon
            const active = n.id === tab.nav
            return (
              <span
                key={n.id}
                className={`flagship__navrow${active ? ' is-active' : ''}`}
              >
                <NavIcon weight={active ? 'fill' : 'regular'} size="1em" />
                <span className="flagship__navrow-label">{n.label}</span>
                {n.pro ? (
                  <Crown weight="fill" size="0.85em" className="flagship__navrow-crown" />
                ) : n.sub ? (
                  <CaretRight weight="bold" size="0.7em" className="flagship__navrow-caret" />
                ) : null}
              </span>
            )
          })}
        </div>

        <div className="flagship__side-foot">
          <div className="flagship__shortcuts">
            <span className="flagship__shortcuts-head">
              Shortcuts
              <PencilSimple weight="bold" size="0.85em" />
            </span>
            <span className="flagship__shortcuts-btn">Pick your shortcuts</span>
          </div>
          <span className="flagship__side-link">
            <SquaresFour weight="regular" size="1em" />
            Layout
          </span>
          <span className="flagship__side-link">
            <ChatCircleDots weight="regular" size="1em" />
            Feedback
          </span>
        </div>
      </aside>

      <div className="flagship__main">
        <div className="flagship__chrome" style={{ ['--i' as string]: 1 }}>
          <span className="flagship__page-title">{tab.pageTitle}</span>
          <div className="flagship__chrome-right">
            <span className="flagship__search">
              <MagnifyingGlass weight="bold" size="1em" />
              <span>Search...</span>
              <span className="flagship__kbd">Ctrl K</span>
            </span>
            {CHROME_ICONS.map((ChromeIcon, i) => (
              <span key={i} className="flagship__chrome-icon">
                <ChromeIcon weight="regular" size="1em" />
                {i === 3 && <span className="flagship__ping" />}
              </span>
            ))}
            <span className="flagship__pro">
              <Crown weight="fill" size="0.85em" />
              Plan
            </span>
            <span className="flagship__fx">
              <span className="flagship__fx-dot" />
              All systems normal
            </span>
            <span className="flagship__avatar" />
          </div>
        </div>

        <div className="flagship__canvas">{children}</div>
      </div>
    </div>
  )
}

/** Small reusable page heading, matching the app's own greeting stack. */
function PageHead({ kicker, title, sub }: { kicker: string; title: string; sub: string }) {
  return (
    <div className="flagship__pagehead" style={{ ['--i' as string]: 2 }}>
      <span className="flagship__kicker">{kicker}</span>
      <span className="flagship__greeting">{title}</span>
      <span className="flagship__sub">{sub}</span>
    </div>
  )
}

function AnnouncementMock() {
  return (
    <>
      <PageHead
        kicker="Monday, January 5"
        title="Good morning, User."
        sub="Your next clear step is ready."
      />

      <div className="flagship__card" style={{ ['--i' as string]: 3 }}>
        <div className="flagship__card-head">
          <span className="flagship__label">Today</span>
          <span className="flagship__card-link">View all</span>
        </div>
        <div className="flagship__card-body">
          <CheckCircle weight="fill" size="1.15em" className="flagship__ok" />
          <span>
            Nothing is blocked. Keep the useful work moving.
          </span>
        </div>
        <div className="flagship__card-foot">
          <span className="flagship__label">Go to</span>
          {GO_TO.map((g) => (
            <span key={g} className="flagship__goto">
              {g}
            </span>
          ))}
        </div>
      </div>

      <div className="flagship__news" style={{ ['--i' as string]: 4 }}>
        <span className="flagship__news-title">What&rsquo;s new</span>
        <span className="flagship__ghostbtn">
          <Plus weight="bold" size="0.9em" />
          New update
        </span>
      </div>

      {UPDATES.map((u, i) => (
        <div
          key={u.title}
          className="flagship__update"
          style={{ ['--i' as string]: i + 5 }}
        >
          <div className="flagship__update-when">
            <span className="flagship__update-date">{u.date}</span>
            <span className="flagship__update-year">{u.year}</span>
            <span className="flagship__update-ago">{u.ago}</span>
          </div>
          <div className="flagship__update-body">
            <span
              className={`flagship__tag flagship__tag--${u.kind === 'New' ? 'new' : 'improved'}`}
            >
              {u.kind}
            </span>
            <span className="flagship__update-title">{u.title}</span>
            <span className="flagship__update-text">{u.text}</span>
          </div>
        </div>
      ))}
    </>
  )
}

function DeskMock() {
  return (
    <>
      <PageHead
        kicker="Monday, January 5"
        title="Build board"
        sub="A simple view of what needs attention next."
      />
      <div className="flagship__board">
        {BOARD.map((col, i) => (
          <div
            key={col.name}
            className="flagship__col"
            style={{ ['--i' as string]: i + 3 }}
          >
            <div className="flagship__col-head">
              <span className="flagship__col-name">{col.name}</span>
              <span className="flagship__col-count">{col.tasks.length}</span>
            </div>
            <div className="flagship__col-list">
              {col.tasks.map((t) => (
                <div key={t.title} className="flagship__task">
                  <span className="flagship__task-title">{t.title}</span>
                  <span className="flagship__task-foot">
                    <span className="flagship__chip">{t.tag}</span>
                    <span
                      className={`flagship__who${t.mine ? ' flagship__who--mine' : ''}`}
                    />
                  </span>
                </div>
              ))}
            </div>
            <span className="flagship__col-add">
              <Plus weight="bold" size="0.9em" />
              <span>Add task</span>
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

function ToolsMock() {
  return (
    <>
      <PageHead
        kicker="Features"
        title="Useful tools"
        sub="Small actions that keep a project moving."
      />
      <div className="flagship__filters" style={{ ['--i' as string]: 3 }}>
        {TOOL_FILTERS.map((f, i) => (
          <span key={f} className={`flagship__filter${i === 0 ? ' is-active' : ''}`}>
            {f}
          </span>
        ))}
      </div>
      <div className="flagship__grid">
        {TOOLS.map((tool, i) => {
          const ToolIcon = tool.Icon
          return (
            <div
              key={tool.name}
              className="flagship__tile"
              style={{ ['--i' as string]: i + 4 }}
            >
              <span className="flagship__tile-icon">
                <ToolIcon weight="fill" size="1em" />
              </span>
              <span className="flagship__tile-name">{tool.name}</span>
              <span className="flagship__tile-note">{tool.note}</span>
              {tool.pro && <span className="flagship__tile-pro">Pro</span>}
            </div>
          )
        })}
      </div>
    </>
  )
}

function JobsMock() {
  return (
    <>
      <PageHead
        kicker="Listings"
        title="Opportunities"
        sub="A focused list of roles and project leads worth a closer look."
      />
      <div className="flagship__filters" style={{ ['--i' as string]: 3 }}>
        {['All sources', 'Source A', 'Source B', 'Source C'].map((f, i) => (
          <span key={f} className={`flagship__filter${i === 0 ? ' is-active' : ''}`}>
            {f}
          </span>
        ))}
      </div>
      <div className="flagship__list">
        {JOBS.map((job, i) => (
          <div
            key={job.title}
            className="flagship__job"
            style={{ ['--i' as string]: i + 4 }}
          >
            <span className={`flagship__source flagship__source--${job.tone}`}>
              {job.source}
            </span>
            <span className="flagship__job-main">
              <span className="flagship__job-title">{job.title}</span>
              <span className="flagship__job-meta">
                {job.rate} · posted {job.posted}
              </span>
            </span>
            <span
              className={`flagship__state flagship__state--${job.state.toLowerCase()}`}
            >
              {job.state}
            </span>
            <CaretRight weight="bold" size="0.85em" className="flagship__job-caret" />
          </div>
        ))}
      </div>
      <span className="flagship__foot" style={{ ['--i' as string]: 9 }}>
        Showing 5 of 100 · Synced 3 minutes ago
      </span>
    </>
  )
}

function LeadsMock() {
  return (
    <>
      <div className="flagship__leadbar" style={{ ['--i' as string]: 2 }}>
        <span className="flagship__field">
          <span className="flagship__field-label">Category</span>
          <span className="flagship__field-value">Full-stack work</span>
        </span>
        <span className="flagship__field">
          <span className="flagship__field-label">Location</span>
          <span className="flagship__field-value">Metro Manila</span>
        </span>
        <span className="flagship__leadgo">
          <MapPinLine weight="fill" size="0.95em" />
          Search
        </span>
      </div>

      <span className="flagship__leadmeta" style={{ ['--i' as string]: 3 }}>
        30 results found · 19 with a detail · 7 with another detail
      </span>

      <div className="flagship__list">
        {LEADS.map((lead, i) => (
          <div
            key={lead.name}
            className="flagship__lead"
            style={{ ['--i' as string]: i + 4 }}
          >
            <span className="flagship__lead-main">
              <span className="flagship__lead-name">{lead.name}</span>
              <span className="flagship__lead-place">{lead.place}</span>
            </span>
            <span className="flagship__lead-rating">
              <Star weight="fill" size="0.85em" />
              {lead.rating}
              <span className="flagship__lead-reviews">({lead.reviews})</span>
            </span>
            <span className="flagship__lead-score">
              <span className="flagship__score-track">
                <span
                  className="flagship__score-fill"
                  style={{ ['--pct' as string]: `${lead.score}%` }}
                />
              </span>
              <span className="flagship__score-num">{lead.score}</span>
            </span>
            <span className="flagship__lead-angle">{lead.angle}</span>
          </div>
        ))}
      </div>

      <span className="flagship__foot" style={{ ['--i' as string]: 9 }}>
        Results are ranked by fit, clarity, and the information available.
      </span>
    </>
  )
}

const MOCKS: Record<TabId, React.ComponentType> = {
  announcement: AnnouncementMock,
  desk: DeskMock,
  work: JobsMock,
  tools: ToolsMock,
  leads: LeadsMock,
}

type Feedback = {
  name: string
  date: string
  rating: number
  context: string
  quote: string
}

/* Use real quotes only, kept verbatim, with the person's permission. */
const FEEDBACKS: Feedback[] = [
  {
    name: 'Portfolio note',
    date: 'Jan 5, 2026',
    rating: 5,
    context: 'Build note',
    quote:
      'This showcase is a product concept for exploring interface decisions, workflow states, and responsive behavior.',
  },
  {
    name: 'Portfolio note',
    date: 'Jan 4, 2026',
    rating: 5,
    context: 'Build note',
    quote:
      'The mock keeps the important context close to each action so the interface can be scanned quickly.',
  },
  {
    name: 'Portfolio note',
    date: 'Jan 3, 2026',
    rating: 5,
    context: 'Build note',
    quote:
      'Every screen is designed to show a useful next step, not just fill space.',
  },
  {
    name: 'Portfolio note',
    date: 'Jan 2, 2026',
    rating: 5,
    context: 'Build note',
    quote:
      'The visual language is deliberately calm: clear hierarchy, visible states, and restrained motion.',
  },
  {
    name: 'Portfolio note',
    date: 'Jan 1, 2026',
    rating: 4,
    context: 'Build note',
    quote: 'Built to make the work easier to understand before it gets complicated.',
  },
  {
    name: 'Portfolio note',
    date: 'Dec 31, 2025',
    rating: 5,
    context: 'Build note',
    quote:
      'This is a living interface study, not a client testimonial wall. The work above shows the thinking in context.',
  },
]

const AUTO_ADVANCE_MS = 6000

type FlagshipProps = {
  /** Overrides the eyebrow. Projects numbers its sections; the Services
   *  page does not, so it passes its own label. */
  eyebrow?: string
}

export default function Flagship({ eyebrow = '12 / Flagship build' }: FlagshipProps = {}) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(true)
  // WCAG 2.2.2: any auto-moving content over 5 seconds needs a pause
  // mechanism that works for keyboard users. CSS-only hover-pause does not
  // help anyone tabbing through the page, so we ship a real button.
  const [feedbackPaused, setFeedbackPaused] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  // Pause auto-advance when the carousel is offscreen so we are not
  // running an interval the user cannot see.
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (paused || !inView) return
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % TABS.length)
    }, AUTO_ADVANCE_MS)
    return () => window.clearInterval(id)
  }, [paused, inView])

  const onTabKey = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault()
        const dir = e.key === 'ArrowRight' ? 1 : -1
        const next = (index + dir + TABS.length) % TABS.length
        setActive(next)
        const buttons = e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
          'button[role="tab"]',
        )
        buttons?.[next]?.focus()
      }
    },
    [],
  )

  const current = TABS[active]
  const Mock = MOCKS[current.id]

  return (
    <aside className="flagship" aria-labelledby="flagship-heading" ref={ref}>
      <header className="flagship__header">
        <span className="flagship__eyebrow">{eyebrow}</span>
        <h3 className="flagship__title" id="flagship-heading">
          Workflow Desk
        </h3>
        <p className="flagship__desc">
          Workflow Desk is a product concept for organizing projects, records, and repeatable work.
          I use it to explore clear information architecture, useful states, and responsive interaction patterns.
        </p>
        <a className="flagship__cta" href="#">
          Open product
          <ArrowSquareOut weight="bold" size={16} aria-hidden="true" />
        </a>
      </header>

      <div
        className="flagship__showcase"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div className="flagship__device" aria-hidden="true">
          <div className="flagship__device-bar">
            <span className="flagship__dot flagship__dot--red" />
            <span className="flagship__dot flagship__dot--amber" />
            <span className="flagship__dot flagship__dot--green" />
            <span className="flagship__device-url">
              <span className="flagship__device-url-host">example.com</span>
              <span className="flagship__device-url-path">{current.path}</span>
            </span>
          </div>
          <div className="flagship__device-screen">
            {/* Re-keyed on tab change so the stage remounts and replays the
                staggered entrance instead of swapping content in place. */}
            <div className="flagship__stage" key={current.id}>
              <Shell tab={current}>
                <Mock />
              </Shell>
            </div>
          </div>
        </div>

        <div className="flagship__panel">
          <div className="flagship__tabs" role="tablist" aria-label="Product screens">
            {TABS.map((tab, i) => {
              const TabIcon = tab.Icon
              const selected = i === active
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  tabIndex={selected ? 0 : -1}
                  className={`flagship__tab${selected ? ' is-active' : ''}`}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onTabKey(e, i)}
                >
                  <span className="flagship__tab-icon" aria-hidden="true">
                    <TabIcon size={16} weight="bold" />
                  </span>
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
          <p className="flagship__caption" key={current.id}>
            {current.caption}
          </p>
          <div className="flagship__progress" aria-hidden="true">
            {TABS.map((_, i) => (
              <span
                key={i}
                className={`flagship__progress-bar${i === active ? ' is-active' : ''}${paused || !inView ? ' is-paused' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flagship__feedback" aria-labelledby="flagship-feedback-heading">
        <header className="flagship__feedback-header">
          <span className="flagship__feedback-eyebrow">What people say about it</span>
          <h4 className="flagship__feedback-title" id="flagship-feedback-heading">
            Build notes from the showcase.
          </h4>
          <button
            type="button"
            className="flagship__feedback-pause"
            onClick={() => setFeedbackPaused((v) => !v)}
            aria-pressed={feedbackPaused}
            aria-label={
              feedbackPaused
                ? 'Resume scrolling testimonials'
                : 'Pause scrolling testimonials'
            }
          >
            {feedbackPaused ? (
              <Play weight="fill" size={14} aria-hidden="true" />
            ) : (
              <Pause weight="fill" size={14} aria-hidden="true" />
            )}
            <span>{feedbackPaused ? 'Play' : 'Pause'}</span>
          </button>
        </header>
        <div className={`flagship__feedback-marquee${feedbackPaused ? ' is-paused' : ''}`}>
          <div
            className="flagship__feedback-track"
            style={feedbackPaused ? { animationPlayState: 'paused' } : undefined}
          >
            {[...FEEDBACKS, ...FEEDBACKS].map((f, i) => (
              <figure key={`${f.name}-${i}`} className="flagship__feedback-card">
                <Quotes
                  className="flagship__feedback-quotemark"
                  weight="fill"
                  size={28}
                  aria-hidden="true"
                />
                <div
                  className="flagship__feedback-rating"
                  role="img"
                  aria-label={`${f.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      weight={idx < f.rating ? 'fill' : 'regular'}
                      size={14}
                      className={
                        idx < f.rating
                          ? 'flagship__feedback-star is-filled'
                          : 'flagship__feedback-star'
                      }
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <blockquote className="flagship__feedback-quote">{f.quote}</blockquote>
                <figcaption className="flagship__feedback-author">
                  <span className="flagship__feedback-name">{f.name}</span>
                  <span className="flagship__feedback-meta">
                    <span className="flagship__feedback-context">{f.context}</span>
                    <span className="flagship__feedback-dot" aria-hidden="true">
                      ·
                    </span>
                    <span className="flagship__feedback-date">{f.date}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
