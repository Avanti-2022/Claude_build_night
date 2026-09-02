type BalanceCategory = {
  id: string
  label: string
  value: number
}

const CATEGORIES: BalanceCategory[] = [
  { id: 'work', label: 'Work', value: 0.85 },
  { id: 'health', label: 'Health', value: 0.15 },
  { id: 'social', label: 'Social', value: 0.35 },
  { id: 'rest', label: 'Rest', value: 0.2 },
]

export default function WeeklyBalance() {
  return (
    <div className="weekly-balance">
      <h2 className="field-label">This week's balance</h2>
      <div className="balance-rows">
        {CATEGORIES.map((category) => (
          <div key={category.id} className="balance-row">
            <span className="balance-label">{category.label}</span>
            <span className="balance-track">
              <span className="balance-fill" style={{ width: `${category.value * 100}%` }} />
            </span>
          </div>
        ))}
      </div>
      <p className="balance-note">A visual mirror of how your week is allocated — not a score.</p>
    </div>
  )
}
