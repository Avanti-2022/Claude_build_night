import { useState } from 'react'

const defaultPriorities = ['Ship Compass MVP', 'Exercise 3x this week', 'Finish client proposal']

export default function PrioritiesInput() {
  const [priorities, setPriorities] = useState<string[]>(defaultPriorities)

  const updatePriority = (index: number, value: string) => {
    setPriorities((current) => current.map((priority, i) => (i === index ? value : priority)))
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
