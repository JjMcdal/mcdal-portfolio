/**
 * The systems tree shown in the Projects "systems" pop-up (and as chips on
 * Home and in the Projects bento card).
 *
 * This file is the ONLY place node copy lives. AIStack.tsx and AIStackGrid.tsx
 * render whatever shape they find here, so swapping in content is a data edit
 * and never a JSX edit. Keep the exported names and types stable.
 *
 * Every value below is a PLACEHOLDER. Shape rules:
 * - The root is you. Its children are the categories (branches).
 * - A branch with `status` is itself a system; a branch without one is a
 *   group whose children are the systems.
 * - Status is what the thing actually does today: "Live" (in use by others),
 *   "Internal" (works, you use it), "Beta".
 * - Logo marks in AIStackGrid.tsx are keyed by the node `id` below.
 */

import {
  Sparkle,
  Coffee,
  Robot,
  Article,
  FilmSlate,
  UsersThree,
  Database,
  SlackLogo,
  MagnifyingGlass,
  ChatCircleDots,
  FlowArrow,
  PhoneCall,
  Browser,
  Broadcast,
  Timer,
} from '@/components/slab'
import type { Icon } from '@/components/slab'
import { profile } from '@/data/profile'

export type StackStatus = 'Live' | 'Internal' | 'Beta'

/** A vendor mark, masked to a single ink colour so the row reads as one set
 *  rather than a rainbow of brand palettes. Only marks that already exist in
 *  public/icons are listed. */
export type StackLogo = { src: string; name: string }

export type StackNode = {
  id: string
  name: string
  /** One plain sentence a non-technical client understands. */
  what: string
  /** Real stack / model / where it runs. Rendered small and muted. */
  stack?: string
  status?: StackStatus
  /** Phosphor glyph for the card's mark tile. Every node has one. */
  Icon: Icon
  logos?: StackLogo[]
  children?: StackNode[]
}

const ANTHROPIC: StackLogo = { src: '/icons/anthropic.svg', name: 'Anthropic' }
const OPENAI: StackLogo = { src: '/icons/openai.svg', name: 'OpenAI' }
const SLACK: StackLogo = { src: '/icons/slack.svg', name: 'Slack' }
const NOUS: StackLogo = { src: '/icons/nousresearch.svg', name: 'Nous Research' }

const WHAT = 'A focused workflow that turns a repeated task into a useful tool.'
const STACK = 'TypeScript · Next.js · Supabase'

/** Single root: you. Branches are the categories. */
export const aiStack: StackNode = {
  id: 'root',
  Icon: Sparkle,
  name: profile.name,
  what: 'Practical software systems that combine product thinking, automation, and testing.',
  stack: 'Next.js · TypeScript · Supabase',
  children: [
    {
      id: 'project-a',
      Icon: Coffee,
      logos: [ANTHROPIC],
      name: 'Pandayo Coffee',
      what: WHAT,
      stack: STACK,
      status: 'Live',
    },
    {
      id: 'category-one',
      Icon: Robot,
      name: 'Product systems',
      what: 'Interfaces and services that make day-to-day operations easier to run.',
      children: [
        {
          id: 'project-b',
          Icon: Article,
          logos: [ANTHROPIC],
          name: 'POS workflow',
          what: WHAT,
          stack: STACK,
          status: 'Internal',
        },
        {
          id: 'project-c',
          Icon: FilmSlate,
          logos: [OPENAI],
          name: 'Inventory tracking',
          what: WHAT,
          stack: STACK,
          status: 'Internal',
        },
        {
          id: 'project-d',
          Icon: UsersThree,
          logos: [ANTHROPIC],
          name: 'Role-based access',
          what: WHAT,
          stack: STACK,
          status: 'Internal',
        },
      ],
    },
    {
      id: 'category-two',
      Icon: Database,
      name: 'Research and QA',
      what: 'Tools that help teams inspect requirements, verify behavior, and make better decisions.',
      children: [
        {
          id: 'project-e',
          Icon: SlackLogo,
          logos: [ANTHROPIC, SLACK],
          name: 'Compliance checks',
          what: WHAT,
          stack: STACK,
          status: 'Live',
        },
        {
          id: 'project-f',
          Icon: MagnifyingGlass,
          logos: [ANTHROPIC],
          name: 'Test case finder',
          what: WHAT,
          stack: STACK,
          status: 'Live',
        },
      ],
    },
    {
      id: 'category-three',
      Icon: ChatCircleDots,
      name: 'Automation tools',
      what: 'Small, focused automations that connect information and reduce repetitive work.',
      children: [
        {
          id: 'project-g',
          Icon: FlowArrow,
          logos: [ANTHROPIC],
          name: 'Workflow runner',
          what: WHAT,
          stack: STACK,
          status: 'Live',
        },
        {
          id: 'project-h',
          Icon: PhoneCall,
          logos: [ANTHROPIC],
          name: 'Call assistant',
          what: WHAT,
          stack: STACK,
          status: 'Beta',
        },
        {
          id: 'project-i',
          Icon: Browser,
          logos: [ANTHROPIC],
          name: 'Browser helper',
          what: WHAT,
          stack: STACK,
          status: 'Live',
        },
      ],
    },
    {
      id: 'project-j',
      Icon: Broadcast,
      logos: [NOUS],
      name: 'RCV System',
      what: WHAT,
      stack: STACK,
      status: 'Live',
      children: [
        {
          id: 'project-k',
          Icon: Timer,
          name: 'Verification timer',
          what: WHAT,
          stack: STACK,
          status: 'Live',
        },
      ],
    },
  ],
}
