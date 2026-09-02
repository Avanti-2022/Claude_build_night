type RunCompassButtonProps = {
  onRun: () => void
}

export default function RunCompassButton({ onRun }: RunCompassButtonProps) {
  return (
    <button className="run-compass-button" onClick={onRun}>
      Run Compass
    </button>
  )
}
