import BulleGauche from "./bulleGauche.jsx";
import { useRef, createRef } from "react";

export default function Messagerie() {
  const reftextSaisie = useRef(null);

  const handleChangeTaille = () => {
    const textarea = reftextSaisie.current;
    textarea.style.height = "auto";
    const hauteur = textarea.scrollHeight;
    textarea.style.height = `${hauteur}px`;
  };

  return (
    <div className="w-full h-full bg-(--bg-main) overflow-x-hidden overflow-y-auto pb-21 flex-col flex justify-start gap-2">
      <div className="w-full p-4">
        <BulleGauche>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolores,
          consectetur reiciendis et blanditiis magnam fuga quia? Neque aliquam
          quo tempora illo harum magni nemo accusantium, recusandae odio ut sed
          laboriosam! Tempora quaerat illo molestias vitae, expedita aperiam
        </BulleGauche>
      </div>

      <div className="flex w-full fixed bottom-22">
        <textarea
          rows={1}
          type="text"
          onChange={handleChangeTaille}
          placeholder="Messages"
          name="Saisie"
          id="saisie"
          ref={reftextSaisie}
          className={`text-right min-h-10 rounded-4xl resize-none focus:border-blue-500/50 focus-within:border-2 focus:outline-none placeholder:text-xl placeholder:text-white/30 border flex bg-(--card-bg-soft) w-full p-3`}
        />
      </div>
    </div>
  );
}
