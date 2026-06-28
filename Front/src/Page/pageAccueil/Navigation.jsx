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
    {
      1: (
        <Home
          height={30}
          width={30}
          onClick={() => {
            setPage("Accueil");
          }}
          titre="Accueil"
          className="flex justify-center items-center shrink-0 cursor-pointer"
        />
      ),
      2: (
        <Camion
          height={30}
          width={30}
          onClick={() => {}}
          titre="Camion"
          className="flex justify-center items-center shrink-0 cursor-pointer"
        />
      ),
      3: (
        <LivraisonIcone
          height={30}
          width={30}
          onClick={() => {}}
          titre="Livraisons"
          className="flex justify-center items-center shrink-0 cursor-pointer"
        />
      ),
      4: (
        <FactureIcone
          height={30}
          width={30}
          onClick={() => {}}
          titre="Factures"
          className="flex justify-center items-center shrink-0 cursor-pointer"
        />
      ),
      5: (
        <DocumentIcone
          height={30}
          width={30}
          onClick={() => {}}
          titre="Documents"
          className="flex justify-center items-center shrink-0 cursor-pointer"
        />
      ),
      6: (
        <UserIcone
          height={30}
          width={30}
          onClick={() => setPage("Profil")}
          titre="Profil"
          className="flex justify-center items-center shrink-0 cursor-pointer"
        />
      ),
    },
  ];
  const obj = listeIcones[0];
  
  return (
    <nav className="absolute bottom-0 left-0 right-0 z-50 h-[10vh] w-full overflow-x-auto overflow-y-hidden">
      <ul className="flex card flex-nowrap min-w-200 gap-4 px-4 py-3">
        {Object.values(obj).map((icone, index) => (
          <li key={index}>{icone}</li>
        ))}
      </ul>
    </nav>
  );
}

// <li><Home
//           height={30}
//           width={30}
//           titre="Accueil"
//           className="flex justify-center items-center shrink-0 cursor-pointer"
//         /></li>
//         <li><Camion
//           height={30}
//           width={30}
//           titre="Camion"
//           className="flex justify-center items-center shrink-0 cursor-pointer"
//         /></li>
//         <li><LivraisonIcone
//           height={30}
//           width={30}
//           titre="Livraisons"
//           className="flex justify-center items-center shrink-0 cursor-pointer"
//         /></li>
//         <li><FactureIcone
//           height={30}
//           width={30}
//           titre="Factures"
//           className="flex justify-center items-center shrink-0 cursor-pointer"
//         /></li>
//         <li><DocumentIcone
//           height={30}
//           width={30}
//           titre="Documents"
//           className="flex justify-center items-center shrink-0 cursor-pointer"
//         /></li>
//         <li><UserIcone
//           height={30}
//           width={30}
//           titre="Profil"
//           className="flex justify-center items-center shrink-0 cursor-pointer"
//         /></li>
