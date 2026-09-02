import { useState } from 'react'
import PrioritiesInput from '../inputs/PrioritiesInput'
import BoundariesInput from '../inputs/BoundariesInput'
import RunCompassButton from '../RunCompassButton'
import ReviewCard from '../review/ReviewCard'
import WeeklyBalance from '../balance/WeeklyBalance'
import type { CalendarEvent, ReviewResult, ReviewStatus } from '../../types'

type CompassSidebarProps = {
  priorities: string[]
  onPrioritiesChange: (priorities: string[]) => void
  wakeTime: string
  sleepTime: string
  onWakeTimeChange: (value: string) => void
  onSleepTimeChange: (value: string) => void
  review: ReviewResult
  onRunCompass: () => void
  onPreview: (highlightIds: string[], ghostEvents: CalendarEvent[]) => void
  onCancelPreview: () => void
  onApply: (apply: (events: CalendarEvent[]) => CalendarEvent[]) => void
}

type ActivePreview = {
  observationId: string
  alternativeId: string
}

export default function CompassSidebar({
  priorities,
  onPrioritiesChange,
  wakeTime,
  sleepTime,
  onWakeTimeChange,
  onSleepTimeChange,
  review,
  onRunCompass,
  onPreview,
  onCancelPreview,
  onApply,
}: CompassSidebarProps) {
  const [hasRun, setHasRun] = useState(false)
  const [cardStates, setCardStates] = useState<Record<string, ReviewStatus>>({})
  const [activePreview, setActivePreview] = useState<ActivePreview | null>(null)

  const findAlternative = (observationId: string, alternativeId: string) =>
    review.observations
      .find((observation) => observation.id === observationId)
      ?.alternatives.find((alternative) => alternative.id === alternativeId)

  const handleRunCompass = () => {
    setHasRun(true)
    setCardStates({})
    setActivePreview(null)
    onCancelPreview()
    onRunCompass()
  }

  const handleBackToSetup = () => {
    setHasRun(false)
    setActivePreview(null)
    onCancelPreview()
  }

  const handleKeepAsIs = (observationId: string) => {
    setCardStates((current) => ({ ...current, [observationId]: 'kept' }))
    if (activePreview?.observationId === observationId) {
      setActivePreview(null)
      onCancelPreview()
    }
  }

  const handleToggleExplore = (observationId: string) => {
    const isExploring = (cardStates[observationId] ?? 'idle') === 'exploring'
    setCardStates((current) => ({ ...current, [observationId]: isExploring ? 'idle' : 'exploring' }))
    if (activePreview?.observationId === observationId) {
      setActivePreview(null)
      onCancelPreview()
    }
  }

  const handlePreview = (observationId: string, alternativeId: string) => {
    const alternative = findAlternative(observationId, alternativeId)
    if (!alternative) return
    setActivePreview({ observationId, alternativeId })
    onPreview(alternative.highlightEventIds, alternative.previewEvents)
  }

  const handleCancelPreview = () => {
    setActivePreview(null)
    onCancelPreview()
  }

  const handleApply = (observationId: string, alternativeId: string) => {
    const alternative = findAlternative(observationId, alternativeId)
    if (!alternative) return
    onApply(alternative.apply)
    setCardStates((current) => ({ ...current, [observationId]: 'resolved' }))
    setActivePreview(null)
  }

  return (
    <aside className="compass-rail">
      <div className="compass-header">
        <h1>Compass</h1>
        <p className="compass-subtitle">A second look at the week you planned.</p>
      </div>

      <WeeklyBalance />

      {!hasRun ? (
        <div className="compass-setup">
          <BoundariesInput
            wakeTime={wakeTime}
            sleepTime={sleepTime}
            onWakeTimeChange={onWakeTimeChange}
            onSleepTimeChange={onSleepTimeChange}
          />
          <PrioritiesInput priorities={priorities} onChange={onPrioritiesChange} />
          <RunCompassButton onRun={handleRunCompass} disabled={review.phase === 'loading'} />
        </div>
      ) : (
        <div className="compass-review">
          <button type="button" className="back-link" onClick={handleBackToSetup}>
            ← Back to setup
          </button>
          <h2 className="field-label">Observations</h2>

          {review.phase === 'loading' && <p className="review-status-message">Reviewing your week…</p>}

          {review.phase === 'error' && (
            <p className="review-status-message">
              Compass couldn't complete this review. Try running it again.
            </p>
          )}

          {review.phase === 'done' && review.observations.length === 0 && (
            <p className="review-status-message">Nothing stood out this week — your plan looks steady.</p>
          )}

          {review.phase === 'done' && review.observations.length > 0 && (
            <div className="review-list">
              {review.observations.map((observation) => (
                <ReviewCard
                  key={observation.id}
                  observation={observation}
                  status={cardStates[observation.id] ?? 'idle'}
                  previewAlternativeId={
                    activePreview?.observationId === observation.id ? activePreview.alternativeId : null
                  }
                  onKeepAsIs={() => handleKeepAsIs(observation.id)}
                  onToggleExplore={() => handleToggleExplore(observation.id)}
                  onPreview={(alternativeId) => handlePreview(observation.id, alternativeId)}
                  onCancelPreview={handleCancelPreview}
                  onApply={(alternativeId) => handleApply(observation.id, alternativeId)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </aside>
  )
}
