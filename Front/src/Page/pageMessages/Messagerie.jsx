import BulleGauche from "./BulleGauche.jsx";
import BulleDroite from "./BulleDroite.jsx";
import { useRef, createRef, useState } from "react";

export default function Messagerie() {
  const reftextSaisie = useRef(null);
  const [saisie, setSaisie] = useState("");
  const [content, setContent] = useState([]);

  const handleChangeTaille = () => {
    setSaisie(reftextSaisie.current.value);
    const textarea = reftextSaisie.current;
    textarea.style.height = "auto";
    const hauteur = textarea.scrollHeight;
    textarea.style.height = `${hauteur}px`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setContent((prev)=>([...prev, saisie]))
    setSaisie("");
  };

  return (
    <div className="w-full h-full bg-(--bg-main) overflow-x-hidden overflow-y-auto pb-21 flex-col-reverse flex justify-start gap-4">
      <div className="w-full p-4 pb-20 z-0">
        <BulleGauche>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolores,
          consectetur reiciendis et blanditiis magnam fuga quia? Neque aliquam
          
        </BulleGauche>
        {content.length > 0 && content.map((message, index)=>( 
           <BulleDroite key={index}>{message}</BulleDroite>)
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex w-full fixed bottom-22">
        <textarea
          rows={1}
          type="text"
          onChange={handleChangeTaille}
          placeholder="Messages"
          name="Saisie"
          id="saisie"
          value={saisie}
          type="submit"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.currentTarget.form.requestSubmit();
            }
          }}
          ref={reftextSaisie}
          className={`z-20 text-right min-h-10 rounded-4xl resize-none focus:border-blue-500/50 focus-within:border-2 focus:outline-none placeholder:text-xl placeholder:text-white/30 border flex bg-(--card-bg-soft) w-full p-3`}
        />
      </form>
    </div>
  );
}
