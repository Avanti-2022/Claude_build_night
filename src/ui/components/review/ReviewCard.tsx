import type { Observation, ReviewStatus } from '../../types'

type ReviewCardProps = {
  observation: Observation
  status: ReviewStatus
  previewAlternativeId: string | null
  onKeepAsIs: () => void
  onToggleExplore: () => void
  onPreview: (alternativeId: string) => void
  onCancelPreview: () => void
  onApply: (alternativeId: string) => void
}

function statusLabel(status: ReviewStatus): string | null {
  if (status === 'kept') return 'Kept as is'
  if (status === 'resolved') return 'Resolved'
  return null
}

export default function ReviewCard({
  observation,
  status,
  previewAlternativeId,
  onKeepAsIs,
  onToggleExplore,
  onPreview,
  onCancelPreview,
  onApply,
}: ReviewCardProps) {
  const isMuted = status === 'kept' || status === 'resolved'
  const label = statusLabel(status)

  return (
    <div className={`review-card${isMuted ? ' review-card--muted' : ''}`}>
      <h3>{observation.title}</h3>
      <p>{observation.message}</p>

      {label ? (
        <p className="review-card-status">{label}</p>
      ) : (
        <div className="review-card-actions">
          <button type="button" className="review-action secondary" onClick={onKeepAsIs}>
            Keep as is
          </button>
          <button
            type="button"
            className={`review-action primary${status === 'exploring' ? ' active' : ''}`}
            onClick={onToggleExplore}
          >
            {status === 'exploring' ? 'Close' : 'Explore'}
          </button>
        </div>
      )}

      {status === 'exploring' && (
        <div className="alternatives-list">
          {observation.alternatives.map((alternative) => {
            const isPreviewing = previewAlternativeId === alternative.id
            const disablePreview = previewAlternativeId !== null && !isPreviewing

            return (
              <div
                key={alternative.id}
                className={`alternative-item${isPreviewing ? ' alternative-item--previewing' : ''}`}
              >
                <div className="alternative-info">
                  <h4>{alternative.title}</h4>
                  <p>{alternative.tradeoff}</p>
                </div>
                {isPreviewing ? (
                  <div className="alternative-preview-actions">
                    <button
                      type="button"
                      className="review-action primary"
                      onClick={() => onApply(alternative.id)}
                    >
                      Apply change
                    </button>
                    <button type="button" className="review-action secondary" onClick={onCancelPreview}>
                      Cancel preview
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="review-action secondary"
                    disabled={disablePreview}
                    onClick={() => onPreview(alternative.id)}
                  >
                    Preview
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
