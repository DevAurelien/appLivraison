import { useContext } from "react";
import ZesteoLogo from "../components/Zesteo_Logo.jsx";
import CardMetierHeader from "./pageAccueil/CardMetierHeader.jsx";
import Notif from "./pageAccueil/Notif.jsx";
import { UserContext } from "../contexte/userContext.jsx";
import { MenuContext } from "../contexte/menuContext.jsx";

export const CardTitre = ({children})=>{
  return(<p className="cardLiv rounded-2xl flex justify-center items-center w-fit text-sm whitespace-nowrap px-4 py-1 shadow-[0_0_10px_color-mix(in_srgb,var(--yellow-zesteo)_10%,transparent)]">{children}</p>)
}

export default function HeaderLogo({ children, bg, notif = 0 }) {
  const { user } = useContext(UserContext);
  const { role, prenom } = user;
  const { page } = useContext(MenuContext);
  const displayPrenom = prenom
  ? prenom.charAt(0).toUpperCase() + prenom.slice(1).toLowerCase()
  : "";

  const content = {
    Accueil: (
      <CardMetierHeader className="px-4 flex justify-start items-start cursor-default text-[1rem]">
        {displayPrenom}, {role}
      </CardMetierHeader>
    ),
    Livraisons: (<CardTitre>Livraisons</CardTitre>),
    Profil: (<CardTitre>Profil</CardTitre>),
    Messagerie: (<CardTitre>Discussions</CardTitre>),
    Contacts: (<CardTitre>Discussions</CardTitre>), 
    Administration: (<CardTitre>Administration</CardTitre>),
    AdminLivreurs: (<CardTitre>Gestion des Equipes</CardTitre>),
  };

  return (
    <div
      className={`flex shrink-0 items-end justify-around px-4 pb-4 w-full h-[10%] overflow-hidden ${bg ? bg : "bg-(--bg-main)"}`}
    >
      <div className="w-7/8 flex items-end text-xl gap-2">
        <ZesteoLogo className="w-[40%] h-10 shrink-0 text-yellow-300" />
        {content[page]}
      </div>
      <div className="relative size-8 aspect-square shadow-xs shadow-olive-500 shrink-0 items-center flex justify-center rounded-full border border-white/20 p-1">
        <Notif
          height={35}
          width={35}
          className="object-contain flex cursor-pointer"
        />
        {notif > 0 && <p className="absolute rounded-full size-2 right-0 top-0 bg-(--yellow-zesteo)"/>}
      </div>
    </div>
  );
}
