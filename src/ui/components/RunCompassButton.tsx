type RunCompassButtonProps = {
  onRun: () => void
  disabled?: boolean
}

export default function RunCompassButton({ onRun, disabled }: RunCompassButtonProps) {
  return (
    <button className="run-compass-button" onClick={onRun} disabled={disabled}>
      {disabled ? 'Reviewing…' : 'Run Compass'}
    </button>
  )
}
