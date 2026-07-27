import { useContext } from "react";
import { MenuContext } from "../../contexte/menuContext";

export default function CardAdministration({
  icone,
  titre,
  description,
  statut,
  couleur = "var(--primary)",
  couleurFond = "var(--primary-soft)",
  couleurBordure = "var(--primary-border)",
  couleurStatut = "var(--success)",
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
        "--fond-accent-card": couleurFond,
        "--bordure-card": couleurBordure,
        "--couleur-statut": couleurStatut,
      }}
      className={`
        cardAdmin
        group
        relative
        flex
        min-h-10
        w-full
        overflow-hidden
        rounded-3xl
        p-2
        text-left
        transition
        duration-300
        hover:-translate-y-1
        active:scale-[0.98]
        ${className}
      `}
    >
      {/* Accent coloré de la catégorie */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_top_left,var(--fond-accent-card),transparent_72%)]
        "
      />

      {/* Liseré coloré discret */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          rounded-[inherit]
          border
          border-(--bordure-card)
        "
      />

      <div className="relative z-10 flex w-full flex-col">
        <div className="flex items-start gap-2">
          {/* Icône */}
          <div
            className="
              flex
              size-12
              shrink-0
              items-center
              justify-center
              rounded-2xl
              border
              border-(--bordure-card)
              bg-(--fond-accent-card)
              text-(--couleur-card)
              shadow-[inset_0_0_18px_color-mix(in_srgb,var(--couleur-card)_18%,transparent)]
            "
          >
            {icone}
          </div>

          {/* Textes */}
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[0.8rem] font-semibold text-(--text-main)">
              {titre}
            </h2>

            <p className="mt-1 line-clamp-2 text-[0.6rem] text-(--text-muted)">
              {description}
            </p>
          </div>
        </div>

        <div
          className={`
            mt-auto
            flex
            items-end
            pt-2
            ${statut ? "justify-between" : "justify-end"}
          `}
        >
          {/* Badge */}
          {statut && (
            <div
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
                text-(--text-secondary)
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
            </div>
          )}

          {/* Flèche */}
          <span
            className="
              text-3xl
              font-light
              leading-none
              text-(--text-muted)
              transition-transform
              duration-300
              group-hover:translate-x-1
              group-hover:text-(--text-main)
            "
          >
            ›
          </span>
        </div>
      </div>
    </button>
  );
}