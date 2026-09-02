type BoundariesInputProps = {
  wakeTime: string
  sleepTime: string
  onWakeTimeChange: (value: string) => void
  onSleepTimeChange: (value: string) => void
}

export default function BoundariesInput({
  wakeTime,
  sleepTime,
  onWakeTimeChange,
  onSleepTimeChange,
}: BoundariesInputProps) {
  return (
    <div className="boundaries-input">
      <h2 className="field-label">Daily boundaries</h2>
      <div className="boundaries-row">
        <label className="boundary-field">
          <span>Wake</span>
          <input type="time" value={wakeTime} onChange={(e) => onWakeTimeChange(e.target.value)} />
        </label>
        <label className="boundary-field">
          <span>Sleep</span>
          <input type="time" value={sleepTime} onChange={(e) => onSleepTimeChange(e.target.value)} />
        </label>
      </div>
    </div>
  )
}
