export default function LinearBarProgress({
  progress,
  label = "Progress Bar",
  width = "100%",
  height = "40%",
  max = 120,
  className = "flex flex-col w-full",
  info = false,
  colorBar = "--primary",
  colorFond = "--linearBar-bg-transparent"
}) {
  const maxValue = max ?? 100;
  const percent = Math.min(Math.max((progress / maxValue) * 100, 0), 100);

  return (
    <div
      aria-label={label}
      aria-valuemax={max}
      aria-valuemin={0}
      aria-valuenow={percent}
      role="progressbar"
      style={{ width, height }}
      className={className}
    >
      {info && (
        <div
          data-testid="progress-bar-text"
          className={`
          mb-4
          w-full
          text-center
          font-bold
          tracking-wide
          text-(${colorFond})
        `}
        >
          {percent}%
        </div>
      )}

      <div
        className={`
          h-3
          w-full
          overflow-hidden
          rounded-lg
          bg-(${colorFond})
        `}
      >
        <div
          data-testid="progress-bar-bar"
          style={{ width: `${percent}%` }}
          className={`
            h-full
            rounded-lg
            bg-(${colorBar})
            transition-[width]
            duration-500
            ease-out
        `}
        />
      </div>
    </div>
  );
}
