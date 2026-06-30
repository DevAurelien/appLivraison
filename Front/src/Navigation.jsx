import Home from "./components/Home.jsx";
import LivraisonIcone from "./components/LivraisonIcone.jsx";
import UserIcone from "./components/UserIcone.jsx";
import { useContext } from "react";
import { MenuContext } from "./contexte/menuContext.jsx";

export default function BarreNavigation() {
  const { page, setPage } = useContext(MenuContext);

  const listeIcones = [
    {
      titre: "Accueil",
      page: "Accueil",
      composant: Home,
    },
    {
      titre: "Livraisons",
      page: "Livraisons",
      composant: LivraisonIcone,
    },
    {
      titre: "Profil",
      page: "Profil",
      composant: UserIcone,
    },
  ];

  return (
    <nav className="fixed text-white bottom-0 left-0 right-0 z-50 h-[10vh] w-screen overflow-x-auto overflow-y-hidden">
      <ul className="flex card flex-nowrap justify-evenly gap-2 px-4 py-3 min-w-max">
        {listeIcones.map((item) => {
          const Icone = item.composant;
          const actif = page === item.page;

          return (
            <li key={item.page} className="shrink-0">
              <Icone
                height={30}
                width={30}
                titre={item.titre}
                onClick={() => setPage(item.page)}
                color1={actif ? "#fde047" : "white"}
                className={`
                  flex justify-center items-center shrink-0 cursor-pointer
                  ${actif ? "text-yellow-300" : "text-white"}
                `}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}