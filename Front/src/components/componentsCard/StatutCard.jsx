import React from "react";

export default function StatutCard({
  statut,
  couleur = "var(--primary)",
  couleurFond = "var(--primary-soft)",
  couleurBordure = "var(--primary-border)",
  couleurStatut = "var(--success)",
  onClick,
}) {
  return (
    <div className="flex h-1/5 w-full justify-end">
      <div
        style={{
          "--couleur-card": couleur,
          "--fond-accent-card": couleurFond,
          "--bordure-card": couleurBordure,
          "--couleur-statut": couleurStatut,
        }}
        className="
                flex
                items-center
                gap-2
                rounded-full
                border
                border-white/10
                px-3
                py-1.5
                text-[0.6rem]
                text-(--text-secondary)
                bg-(--fond-accent-card)/10
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
    </div>
  );
}
