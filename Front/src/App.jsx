import { useContext } from "react"
import SeConnecter from "./Page/SeConnecter.jsx"
import { MenuContext } from "./contexte/menuContext.jsx"
import Inscription from "./Page/Inscription.jsx";
import Accueil from "./Page/pageAccueil/Accueil.jsx"
import Profil from "./Page/pageProfil/Profil.jsx";
import Livraisons from "./Page/pageLivraisons/Livraisons.jsx";
import Messagerie from "./Page/pageMessages/Messagerie.jsx";
import HeaderLogo from "./Page/HeaderLogo.jsx";

export default function App() {

  const {page} = useContext(MenuContext);
 
  return (
    <div className="flex flex-col text-white w-full h-full">
      {((page !== "connection") && (page !== "inscription")) && <HeaderLogo/> } 
      {page === "connection" && <SeConnecter />}
      {page === "inscription" && <Inscription />}
      {page === "Accueil" && <Accueil/>}
      {page === "Profil" && <Profil/>}
      {page === "Livraisons" && <Livraisons/>}
      {page === "Messagerie" && <Messagerie/>}
      {/* <Accueil></Accueil> */}
    </div>
  )
}
 