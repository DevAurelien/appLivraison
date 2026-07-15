import BulleGauche from "./BulleGauche.jsx";
import BulleDroite from "./BulleDroite.jsx";
import { useRef, createRef, useState } from "react";
import Fleche from "../../components/componentsIcone/Fleche.jsx";
import { MenuContext } from "../../contexte/menuContext.jsx";
import { useContext } from "react";

export default function Messagerie() {
  const reftextSaisie = useRef(null);
  const [saisie, setSaisie] = useState("");
  const [content, setContent] = useState([]);
  const { setPage } = useContext(MenuContext);

  const handleChangeTaille = () => {
    setSaisie(reftextSaisie.current.value);
    const textarea = reftextSaisie.current;
    textarea.style.height = "auto";
    const hauteur = textarea.scrollHeight;
    textarea.style.height = `${hauteur}px`;
  };

 const handleSubmit = (e) => {
  e.preventDefault();

  if (saisie.trim() === "") return;

  setContent((prev) => [...prev, saisie]);
  setSaisie("");

  reftextSaisie.current.style.height = "auto";
};

const envoyerMessage = () => {
  const message = reftextSaisie.current?.textContent?.trim();

  if (!message) return;

  setContent((prev) => [...prev, message]);
  setSaisie("");

  reftextSaisie.current.textContent = "";
};

  return (
    <>
      <div
        onClick={() => setPage("Contacts")}
        className="h-[5vh] flex justify-start items-center rounded-xl border w-fit px-2 gap-2 ml-2"
      >
        <Fleche color="white" />
        Retour
      </div>
      <div className="w-full h-full bg-(--bg-main) overflow-x-hidden overflow-y-auto pb-21 flex-col-reverse flex justify-start gap-4">
        <div className="w-full p-4 pb-20 z-0">
          <BulleGauche>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolores,
            consectetur reiciendis et blanditiis magnam fuga quia? Neque aliquam
          </BulleGauche>
          {content.length > 0 &&
            content.map((message, index) => (
              <BulleDroite key={index}>{message}</BulleDroite>
            ))}
        </div>

         <form
    onSubmit={(e) => {
      e.preventDefault();
      envoyerMessage();
    }}
    className="flex w-full fixed bottom-22"
  >
    <div
      ref={reftextSaisie}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-multiline="false"
      enterKeyHint="send"
      data-placeholder="Messages"
      onInput={(e) => {
        setSaisie(e.currentTarget.textContent);
      }}
      onBeforeInput={(e) => {
        const inputType = e.nativeEvent.inputType;

        if (
          inputType === "insertParagraph" ||
          inputType === "insertLineBreak"
        ) {
          e.preventDefault();
          envoyerMessage();
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          envoyerMessage();
        }
      }}
      className="
        z-20 min-h-10 w-full rounded-4xl
        border bg-(--card-bg-soft) p-3 text-right
        outline-none focus:border-2 focus:border-blue-500/50
        empty:before:content-[attr(data-placeholder)]
        empty:before:text-xl
        empty:before:text-white/30
      "
    />
  </form>
      </div>
    </>
  );
}
