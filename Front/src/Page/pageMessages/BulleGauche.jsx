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
      <div className="max-w-[75%] min-w-0 break-words [overflow-wrap:anywhere] whitespace-pre-wrap bg-(--primary) rounded-xl p-2 leading-tight z-10">
        {children}
      </div>
      <TriangleBulle className="text-(--primary)" />
    </div>
  );
}
