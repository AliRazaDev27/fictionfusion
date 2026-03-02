interface ProgressBarProps {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100

  return (
    <div className="w-full">
      <div className="h-2 bg-card rounded-full overflow-hidden border border-border">
        <div
          className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-500 ease-out"
          style={{ 
            width: `${percentage}%`,
            maskImage: 'linear-gradient(to right, black 0%, black 50%, transparent 100%)'
           }}
        />
      </div>
    </div>
  )
}
