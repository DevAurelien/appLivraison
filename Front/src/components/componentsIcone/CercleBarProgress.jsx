export default function BarProgress({
  progress,
  label = "Progress Bar",
  width = 300,
  className = "",
}) {
  const strokeWidth = 6;
  const radius = 50 - strokeWidth * 2;
  const circumference = radius * 2 * Math.PI;

  const progressionLimitee = Math.min(Math.max(progress, 0), 100);

  const offset =
    circumference - (progressionLimitee / 100) * circumference;

  return (
    <div className={`relative inline-block ${className}`}>
      <svg
        aria-label={label}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={progressionLimitee}
        height={width}
        width={width}
        role="progressbar"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          strokeWidth={strokeWidth}
          className="
            fill-transparent
            stroke-[hsla(225,20%,92%,0.9)]
            [stroke-linecap:round]
          "
        />

        <circle
          cx="50"
          cy="50"
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          data-testid="progress-bar-bar"
          className="
            origin-center
            -rotate-90
            fill-transparent
            stroke-[hsla(225,23%,72%,0.9)]
            transition-[stroke-dashoffset]
            duration-500
            ease-out
            [stroke-linecap:round]
          "
        />
      </svg>

      <div
        data-testid="progress-bar-text"
        className="
          absolute
          inset-0
          z-10
          mb-4
          flex
          items-center
          justify-center
          font-bold
          tracking-wide
          text-[hsla(225,23%,62%,1)]
        "
      >
        {progressionLimitee}
      </div>
    </div>
  );
}
