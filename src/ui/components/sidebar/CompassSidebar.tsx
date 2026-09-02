import { useState } from 'react'
import PrioritiesInput from '../inputs/PrioritiesInput'
import BoundariesInput from '../inputs/BoundariesInput'
import RunCompassButton from '../RunCompassButton'
import ReviewCard from '../review/ReviewCard'
import WeeklyBalance from '../balance/WeeklyBalance'
import { OBSERVATIONS } from '../../mockData'
import type { CalendarEvent, ReviewStatus } from '../../types'

type CompassSidebarProps = {
  onPreview: (highlightIds: string[], ghostEvents: CalendarEvent[]) => void
  onCancelPreview: () => void
  onApply: (apply: (events: CalendarEvent[]) => CalendarEvent[]) => void
}

type ActivePreview = {
  observationId: string
  alternativeId: string
}

function findAlternative(observationId: string, alternativeId: string) {
  return OBSERVATIONS.find((observation) => observation.id === observationId)?.alternatives.find(
    (alternative) => alternative.id === alternativeId,
  )
}

export default function CompassSidebar({ onPreview, onCancelPreview, onApply }: CompassSidebarProps) {
  const [hasRun, setHasRun] = useState(false)
  const [cardStates, setCardStates] = useState<Record<string, ReviewStatus>>(() => {
    const initial: Record<string, ReviewStatus> = {}
    OBSERVATIONS.forEach((observation) => {
      initial[observation.id] = 'idle'
    })
    return initial
  })
  const [activePreview, setActivePreview] = useState<ActivePreview | null>(null)

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
    const isExploring = cardStates[observationId] === 'exploring'
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
          <BoundariesInput />
          <PrioritiesInput />
          <RunCompassButton onRun={() => setHasRun(true)} />
        </div>
      ) : (
        <div className="compass-review">
          <button type="button" className="back-link" onClick={handleBackToSetup}>
            ← Back to setup
          </button>
          <h2 className="field-label">Observations</h2>
          <div className="review-list">
            {OBSERVATIONS.map((observation) => (
              <ReviewCard
                key={observation.id}
                observation={observation}
                status={cardStates[observation.id]}
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
        </div>
      )}
    </aside>
  )
}
