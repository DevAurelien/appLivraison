import { useEffect, useRef, useState } from "react";
import ChevronIcone from "../componentAdminCamion/Chevron.jsx";

export default function SelectCustom({
  label,
  liste = [],
  value,
  onChange,
  Icone,
  required = false,
  placeholder = "Sélectionner",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          w-full
          flex
          items-center
          gap-3
          border
          border-white/20
          px-3
          py-2
          rounded-xl
          cursor-pointer
          text-left
        "
      >
        {Icone && <Icone className="size-6 shrink-0" height={30} width={30} />}

        <div className="flex flex-1 flex-col gap-1">
          <span className="text-[0.6rem] text-white/50">
            {label}
            {required && " *"}
          </span>

          <span className="text-[0.9rem]">
            {value || placeholder}
          </span>
        </div>

        <ChevronIcone
          className={`size-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className="
            absolute
            top-[calc(100%+0.3rem)]
            left-0
            z-50
            w-full
            overflow-hidden
            rounded-xl
            border
            border-white/20
            bg-[#0c1728]
            shadow-xl
          "
        >
          {liste.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                onChange(item);
                setOpen(false);
              }}
              className="
                w-full
                px-4
                py-2
                text-left
                cursor-pointer
                hover:bg-white/10
              "
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}