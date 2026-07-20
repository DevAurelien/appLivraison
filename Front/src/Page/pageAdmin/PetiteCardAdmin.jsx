import { useEffect, useState } from "react";
import LinearBarProgress from "../../components/componentsIcone/LineaireBarProgress.jsx";

export default function PetiteCardAdmin({
  icone,
  nb = 0,
  detail = "",
  statut = "bleu",
  max = 100,
  afficherBarre = false,
  afficherLivreur =false,
  nbAbsents = 0,
}) {
  const Icone = icone;
  const [content, setContent] = useState("");

  const couleursParStatut = {
    bleu: "--primary",
    success: "--success",
    warning: "--warning",
    danger: "--danger",
    couleurLivreurs: "--couleurLivreurs",
    couleurAgences: "--couleurAgences",
    couleurCamions: "--couleurCamions",
    couleurSecteurs: "--couleurSecteurs",
    couleurPlannings: "--couleurPlannings",
    couleurIncidents: "--couleurIncidents",
    couleurStatistiques: "--couleurStatistiques",
    couleurGestions: "--couleurGestions",
  };
  const couleurStatut = couleursParStatut[statut] ?? couleursParStatut.bleu;

  useEffect(() => {
   afficherBarre && setContent(<LinearBarProgress progress={nb} max={max} />);
   afficherLivreur && setContent(String(nbAbsents)+" absent"+(nbAbsents < 2 ? "": "s"));
 
}, [afficherBarre, afficherLivreur, nbAbsents, nb, max]);

  return (
    <div
      style={{ "--couleur-statut": `var(${couleurStatut})` }}
      className="border border-(--couleur-statut) flex flex-col h-20 rounded-xl text-[0.6rem] bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--couleur-statut)_20%,transparent),transparent_80%)]"
    >
      <div className="flex flex-col w-full pt-2 px-2">
        <div className="flex gap-2 items-center">
          <Icone
            height={18}
            width={18}
            color1="var(--couleur-statut)"
            className=""
          />
          <span className="font-bold text-[1.2rem]">{nb}</span>
        </div>
      </div>
      <p className="flex w-full justify-end px-3 -mt-1">{detail}</p>
      <div className="w-full flex-1 p-2 flex items-center justify-center">{content}</div>
    </div>
  );
}
