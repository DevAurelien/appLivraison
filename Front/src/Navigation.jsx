import Home from "./components/Home.jsx";
import LivraisonIcone from "./components/LivraisonIcone.jsx";
import UserIcone from "./components/UserIcone.jsx";
import MessagesIcone from "./components/Messages.jsx"
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
      titre: "Messages",
      page: "Messagerie",
      composant: MessagesIcone,
    },{
      titre: "Profil",
      page: "Profil",
      composant: UserIcone,
    },
  ];
  const activeIndex = listeIcones.findIndex((item) => item.page === page);
  const nbIcones = listeIcones.length;
  const segment = 100 / nbIcones;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-[10vh] w-screen text-white">
      <ul className="flex relative h-full card w-full flex-nowrap items-center bg-(--card-bg)">
        <div
          className={`absolute z-10 -top-5 h-16 w-16 rounded-full bg-(--card-bg) transition-all duration-700`}
          style={{
            left: `calc(${activeIndex * segment}% + ${segment / 2}% - 2rem)`,
          }}
        />
        {listeIcones.map((item) => {
          const Icone = item.composant;
          const actif = page === item.page;

          return (
            <li
              key={item.page}
              className={`flex flex-1 shrink-0 items-center justify-center pb-2 transition-translate duration-700 z-30 ${actif ? "-translate-y-6" : ""}`}
            >
              <button
                type="button"
                onClick={() => setPage(item.page)}
                className={`
              flex h-16 w-16 shrink-0 items-center justify-center rounded-full cursor-pointer
              ${actif ? "text-yellow-300" : "text-white"}
            `}
              >
                <Icone
                  height={30}
                  width={30}
                  titre={item.titre}
                  color1={actif ? "#fde047" : "white"}
                  className="block h-7.5 w-7.5 shrink-0"
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
