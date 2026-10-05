export type QA = { q: string; a: string }

/**
 * The questions people ask before they email. One list, used by the FAQ
 * accordion on the Contact view (and the legacy long-scroll FAQ section).
 * Five questions, two or three sentences each: the accordion sits in a
 * fixed panel and more than that pushes the email row off the plate.
 */
export const FAQS: QA[] = [
  {
    q: 'What do you do?',
     a: 'I build full-stack web apps, internal tools, and practical automations. I am especially interested in projects that need both thoughtful implementation and careful testing.',
  },
  {
    q: 'How fast can you start?',
     a: 'Availability depends on the scope. Share the goal, current state, and timeline in your message and I will tell you what is realistic.',
  },
  {
    q: 'How much do you charge?',
     a: 'I scope work around the outcome, complexity, and timeline. After a short conversation, I can suggest a practical next step and estimate.',
  },
  {
    q: 'Where are you based?',
     a: 'I am based in Metro Manila, Philippines (GMT+8), and can coordinate asynchronously with teams in other timezones.',
  },
  {
    q: 'What happens after I write?',
     a: 'Send a short note through the form. I will review it, reply with questions or a suggested next step, and we can take it from there.',
  },
]
