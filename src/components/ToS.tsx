import { ArrowLeft } from '@/components/slab'
import { useNavigate } from 'react-router-dom'
import { profile } from '@/data/profile'

/**
 * Terms of Service - PLACEHOLDER. Legal text has to fit YOUR business, so
 * none is supplied. Paste your own terms into the sections below.
 */
export default function ToS() {
  const navigate = useNavigate()

  return (
    <main className="legal-page" aria-label="Terms of Service">
      <div className="legal-page__card">
        <button
          className="legal-page__back"
          onClick={() => navigate('/')}
          aria-label="Back to home"
        >
          <ArrowLeft weight="bold" size={15} aria-hidden="true" />
          Back to home
        </button>

        <h1 className="legal-page__title">Terms of Service</h1>
        <p className="legal-page__updated">Last updated: October 5, 2026</p>

        <div className="legal-page__body">
          <h2>Using this site</h2>
          <p>You may browse this portfolio for personal and professional evaluation. Please do not copy, scrape, or republish its content without permission.</p>

          <h2>Work and payment</h2>
          <p>Any project discussed through this site is scoped, priced, and delivered through a separate written agreement.</p>

          <h2>Ownership</h2>
          <p>The portfolio content and visual work remain the property of their respective owners unless a project agreement says otherwise.</p>

          <h2>Liability</h2>
          <p>This site is provided as-is. Project responsibilities and liability are defined in the agreement for that project.</p>

          <h2>Contact</h2>
          <p>
            Questions about these terms: <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </p>
        </div>
      </div>
    </main>
  )
}
