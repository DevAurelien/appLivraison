export function TriangleBulles({
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
      <path d="M12 0 L0 0 L16 12 Z" fill="currentColor" />
      
    </svg>
  );
}

export default function BulleDroite({ children }) {
  return (
    <div className="flex flex-col items-end w-full">
      <div className="max-w-[75%] min-w-0 break-words [overflow-wrap:anywhere] whitespace-pre-wrap bg-(--primary) rounded-xl p-2 leading-tight z-10">
        {children}
      </div>

      <TriangleBulles className="text-(--primary)" />
    </div>
  );
}
