import Home from "../../components/Home.jsx";
import Camion from "../../components/Camion.jsx";
import LivraisonIcone from "../../components/LivraisonIcone.jsx";
import FactureIcone from "../../components/FactureIcone.jsx";
import DocumentIcone from "../../components/DocumentIcone.jsx";
import UserIcone from "../../components/UserIcone.jsx";
import { useContext } from "react";
import { MenuContext } from "../../contexte/menuContext.jsx";

export default function BarreNavigation() {
  const { setPage } = useContext(MenuContext);

  const listeIcones = [
    <Home
      height={30}
      width={30}
      onClick={() => setPage("Accueil")}
      titre="Accueil"
      className="flex justify-center items-center shrink-0 cursor-pointer"
    />,
    // <Camion
    //   height={30}
    //   width={30}
    //   onClick={() => {}}
    //   titre="Camion"
    //   className="flex justify-center items-center shrink-0 cursor-pointer"
    // />,
    <LivraisonIcone
      height={30}
      width={30}
      onClick={() => {}}
      titre="Livraisons"
      className="flex justify-center items-center shrink-0 cursor-pointer"
    />,
    // <FactureIcone
    //   height={30}
    //   width={30}
    //   onClick={() => {}}
    //   titre="Factures"
    //   className="flex justify-center items-center shrink-0 cursor-pointer"
    // />,
    // <DocumentIcone
    //   height={30}
    //   width={30}
    //   onClick={() => {}}
    //   titre="Documents"
    //   className="flex justify-center items-center shrink-0 cursor-pointer"
    // />,
    <UserIcone
      height={30}
      width={30}
      onClick={() => setPage("Profil")}
      titre="Profil"
      className="flex justify-center items-center shrink-0 cursor-pointer"
    />,
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-[10vh] w-screen overflow-x-auto overflow-y-hidden">
      <ul className="flex card flex-nowrap justify-evenly gap-2 px-4 py-3 min-w-max">
        {listeIcones.map((icone, index) => (
          <li key={index} className="shrink-0">
            {icone}
          </li>
        ))}
      </ul>
    </nav>
  );
}