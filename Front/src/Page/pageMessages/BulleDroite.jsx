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
      <path d="M12 0 L0 0 L16 12 Z" fill="currentColor" />
      
    </svg>
  );
}

export default function BulleDroite({ children }) {
  return (
    <div className="flex flex-col justify-end items-end">
      <div className="w-[75%] shrink-0 bg-(--card-bg-soft) rounded-xl p-2 text-[0.8rem] z-10">
        {children}
      </div>
      <TriangleBulle 
      className="text-(--card-bg-soft)" 
      // className="text-white" 
      />
    </div>
  );
}
