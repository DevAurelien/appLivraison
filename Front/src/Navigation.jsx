import Home from "./components/Home.jsx";
import LivraisonIcone from "./components/LivraisonIcone.jsx";
import UserIcone from "./components/UserIcone.jsx";
import MessagesIcone from "./components/Messages.jsx";
import { useContext } from "react";
import { MenuContext } from "./contexte/menuContext.jsx";
import { UserContext } from "./contexte/userContext.jsx";

export default function BarreNavigation() {
  const { page, setPage } = useContext(MenuContext);
const { user } = useContext(UserContext);

  const listeIcones = [
    {
      titre: "Accueil",
      page: "Accueil",
      composant: Home,
      roleOk: ["Client", "Livreur"],
    },
    {
      titre: "Livraisons",
      page: "Livraisons",
      composant: LivraisonIcone,
      roleOk: ["Livreur"],
    },
    {
      titre: "Messages",
      page: "Contacts",
      composant: MessagesIcone,
      roleOk: ["Client", "Livreur"],
    },
    {
      titre: "Profil",
      page: "Profil",
      composant: UserIcone,
      roleOk: ["Client", "Livreur"],
    },
  ];
  const activeIndex = listeIcones.findIndex((item) => item.page === page);
  const nbIcones = listeIcones.length;
  const segment = 100 / nbIcones;
  // shadow-[inset_5px_5px_10px_rgba(0,0,0,0.45),inset_-3px_-3px_6px_rgba(255,255,255,0.04),0_0_8px_rgba(250,204,21,0.18)]
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-[10vh] w-screen text-white">
      <ul className="flex relative h-full card w-full flex-nowrap items-center bg-(--card-bg)">
        <div
          className={`absolute
          h-16
          w-16
          rounded-full
          bg-(--card-bg)
          shadow-[5px_5px_12px_rgba(0,0,0,0.45),-4px_-4px_10px_rgba(255,255,255,0.06),0_0_10px_rgba(250,204,21,0.16)]
          top-4
          transition-all
          duration-700`}
          style={{
            left: `calc(${activeIndex * segment}% + ${segment / 2}% - 2rem)`,
          }}
        />
        {listeIcones.map((item) => {
          const Icone = item.composant;
          const actif = page === item.page;
          const roleAutorise = item.roleOk?.includes(user?.role);

          if (!roleAutorise) return null;

          return (
            <li
              key={item.page}
              className="flex flex-1 shrink-0 items-center justify-center pb-2 transition-transform duration-700 z-30"
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
