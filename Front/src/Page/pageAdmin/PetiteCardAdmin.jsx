import { useState } from "react";
import LinearBarProgress from "../../components/componentsIcone/LineaireBarProgress.jsx"

export default function PetiteCardAdmin({
  icone,
  nb = 10,
  detail = "Livreurs actifs",
  statut = "bleu",
}) {
  const Icone = icone;
  const [content, setContent] = useState(<LinearBarProgress progress={80} max={100} color1/>);

  const couleursParStatut = {
    bleu: "--primary",
    vert: "--success",
    orange: "--warning",
    rouge: "--danger",
  };

  return (
    <div
      className={`border border-(${couleursParStatut[statut]}) flex flex-col h-20 rounded-xl text-[0.6rem] bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(${couleursParStatut[statut]})_65%,transparent),transparent_80%)]`}
    >
      <div className="flex flex-col w-full pt-2 px-2">
        <div className="flex gap-2 items-center">
          <Icone
            height={18}
            width={18}
            color1="var(--primary)"
            className=""
            statut="rouge"
          />
          <span className="font-bold text-[1.2rem]">{nb}</span>
        </div>
      </div>
      <p className="flex w-full justify-end px-3 -mt-1">{detail}</p>
      <div className="w-full flex-1 p-2 flex items-center">{content}</div>
    </div>
  );
}
