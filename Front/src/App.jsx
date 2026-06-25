import { useContext } from "react"
import SeConnecter from "./Page/SeConnecter.jsx"
import { MenuContext } from "./contexte/menuContext.jsx"
import Inscription from "./Page/Inscription.jsx";
import Accueil from "./Page/pageAccueil/Accueil.jsx"

export default function App() {

  const {page} = useContext(MenuContext);
 
  return (
    <div className="flex text-white w-full h-full">
      {page === "connection" && <SeConnecter />}
      {page === "inscription" && <Inscription />}
      {page === "Accueil" && <Accueil/>}
      {/* <Accueil></Accueil> */}
    </div>
  )
}
 