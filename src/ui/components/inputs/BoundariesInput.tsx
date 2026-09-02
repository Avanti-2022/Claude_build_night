import { useState } from 'react'

export default function BoundariesInput() {
  const [wakeTime, setWakeTime] = useState('07:00')
  const [sleepTime, setSleepTime] = useState('23:00')

  return (
    <div className="boundaries-input">
      <h2 className="field-label">Daily boundaries</h2>
      <div className="boundaries-row">
        <label className="boundary-field">
          <span>Wake</span>
          <input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} />
        </label>
        <label className="boundary-field">
          <span>Sleep</span>
          <input type="time" value={sleepTime} onChange={(e) => setSleepTime(e.target.value)} />
        </label>
      </div>
    </div>
  )
}
