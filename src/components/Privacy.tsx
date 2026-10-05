import { ArrowLeft } from '@/components/slab'
import { useNavigate } from 'react-router-dom'
import { profile } from '@/data/profile'

/**
 * Privacy Policy - PLACEHOLDER. Legal text has to describe YOUR site and what
 * it collects, so none is supplied. Write it (or have a lawyer or a policy
 * generator write it) and paste it into the sections below.
 */
export default function Privacy() {
  const navigate = useNavigate()

  return (
    <main className="legal-page" aria-label="Privacy Policy">
      <div className="legal-page__card">
        <button
          className="legal-page__back"
          onClick={() => navigate('/')}
          aria-label="Back to home"
        >
          <ArrowLeft weight="bold" size={15} aria-hidden="true" />
          Back to home
        </button>

        <h1 className="legal-page__title">Privacy Policy</h1>
        <p className="legal-page__updated">Last updated: October 5, 2026</p>

        <div className="legal-page__body">
          <h2>Who this covers</h2>
          <p>This portfolio is operated by JJ Mcdal Nabong and covers this website and its contact form.</p>

          <h2>What is collected</h2>
          <p>The contact form collects the name, email address, and message that you choose to send. This site does not currently use analytics cookies.</p>

          <h2>How it is used</h2>
          <p>Submitted details are used only to reply to your inquiry. They are not sold or shared for advertising.</p>

          <h2>How long it is kept</h2>
          <p>Messages are kept only as long as needed for communication and basic project records. Email me to ask about a message associated with you.</p>

          <h2>Contact</h2>
          <p>
            Questions about this policy: <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </p>
        </div>
      </div>
    </main>
  )
}
