export function TriangleBulle({
  currentColor = "white",
  width = 18,
  height = 12,
  className = "",
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 18 12"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 0 L18 0 L2 12 Z" fill="currentColor" />
    </svg>
  );
}

export default function BulleGauche({ children }) {
  return (
    <div className="">
      <div className="w-[75%] shrink-0 bg-(--card-bg) rounded-xl p-2 text-[0.8rem]">
        {children}
      </div>
      <TriangleBulle className="text-(--card-bg)" />
    </div>
  );
}
