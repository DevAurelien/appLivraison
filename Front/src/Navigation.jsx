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
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-[10vh] w-screen text-white">
      <ul className="flex h-full card min-w-max flex-nowrap items-center justify-evenly gap-2 bg-(--card-bg) px-4">
        {listeIcones.map((item) => {
          const Icone = item.composant;
          const actif = page === item.page;

          return (
            <li
              key={item.page}
              className={`flex shrink-0 items-center justify-center pb-2 transition-translate duration-700 ${actif ? "-translate-y-6" : ""}`}
            >
              <button
                type="button"
                onClick={() => setPage(item.page)}
                className={`
              flex h-18 w-20 shrink-0 items-center justify-center rounded-full cursor-pointer bg-(--card-bg)
              ${actif ? "text-yellow-300" : "text-white"}
            `}
              >
                <Icone
                  height={30}
                  width={30}
                  titre={item.titre}
                  color1={actif ? "#fde047" : "white"}
                  className="block h-[30px] w-[30px] shrink-0"
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
