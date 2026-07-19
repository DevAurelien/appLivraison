import { useContext } from "react";
import { MenuContext } from "../../contexte/menuContext";
export default function CardAdministration({
  icone,
  titre,
  description,
  statut,
  couleur = "#2563eb",
  couleurFond = "#07152f",
  couleurStatut = "#10b981",
  onClick,
  className = "",
}) {
  const { setPage } = useContext(MenuContext);
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        "--couleur-card": couleur,
        "--fond-card": couleurFond,
        "--couleur-statut": couleurStatut,
      }}
      className={`
        relative
        flex
        min-h-10
        w-full
        overflow-hidden
        rounded-3xl
        border
        border-(--couleur-card)
        bg-(--fond-card)
        p-2
        text-left
        shadow-[0_0_18px_color-mix(in_srgb,var(--couleur-card)_20%,transparent)]
        transition
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_0_28px_color-mix(in_srgb,var(--couleur-card)_35%,transparent)]
        active:scale-[0.98]
        ${className}
      `}
    >
      {/* Halo coloré de fond */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--couleur-card)_65%,transparent),transparent_80%)]
        "
      />

      <div className="relative z-10 flex w-full flex-col">
        <div className="flex items-start gap-2">
          {/* Conteneur de l’icône */}
          <div
            className="
              flex
              size-12
              shrink-0
              items-center
              justify-center
              rounded-2xl
              border
              border-(--couleur-card)
              bg-[color-mix(in_srgb,var(--couleur-card)_25%,transparent)]
              shadow-[inset_0_0_18px_color-mix(in_srgb,var(--couleur-card)_20%,transparent)]
            "
          >
            {icone}
          </div>

          {/* Textes */}
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[1rem] font-semibold text-white">
              {titre}
            </h2>

            <p className="mt-1 line-clamp-2 text-[0.6rem] text-slate-400">
              {description}
            </p>
          </div>
        </div>

        <div className={`mt-auto flex items-end ${statut ? "justify-between" : "justify-end"} pt-2`}>
          {/* Badge */}
          {statut && <div
            className="
              flex
              items-center
              gap-2
              rounded-full
              border
              border-white/10
              bg-black/15
              px-3
              py-1.5
              text-[0.6rem]
              text-slate-300
            "
          >
            <span
              className="
                size-2
                rounded-full
                bg-(--couleur-statut)
                shadow-[0_0_8px_var(--couleur-statut)]
              "
            />

             <span>{statut}</span>
          </div>}

          {/* Flèche */}
          <span
            className="
              text-3xl
              font-light
              leading-none
              text-slate-400
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          >
            ›
          </span>
        </div>
      </div>
    </button>
  );
}
