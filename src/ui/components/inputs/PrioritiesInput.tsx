type PrioritiesInputProps = {
  priorities: string[]
  onChange: (priorities: string[]) => void
}

export default function PrioritiesInput({ priorities, onChange }: PrioritiesInputProps) {
  const updatePriority = (index: number, value: string) => {
    onChange(priorities.map((priority, i) => (i === index ? value : priority)))
  }

  return (
    <div className="priorities-input">
      <h2 className="field-label">Top 3 priorities</h2>
      {priorities.map((priority, index) => (
        <input
          key={index}
          className="priority-field"
          value={priority}
          onChange={(e) => updatePriority(index, e.target.value)}
          placeholder={`Priority ${index + 1}`}
        />
      ))}
    </div>
  )
}
