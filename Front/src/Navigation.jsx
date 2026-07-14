import Home from "./components/Home.jsx";
import LivraisonIcone from "./components/LivraisonIcone.jsx";
import UserIcone from "./components/UserIcone.jsx";
import MessagesIcone from "./components/Messages.jsx";
import Engrenages from "./components/Engrenages.jsx";
import { useContext, useLayoutEffect, useRef, useState } from "react";
import { MenuContext } from "./contexte/menuContext.jsx";
import { UserContext } from "./contexte/userContext.jsx";

export default function BarreNavigation() {
  const { page, setPage } = useContext(MenuContext);
  const { user } = useContext(UserContext);

  const elementsRef = useRef({});
  const [positionCercle, setPositionCercle] = useState(0);

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
    {
      titre: "Administration",
      page: "Administration",
      composant: Engrenages,
      roleOk: ["Livreur"],
    },
  ];

  const iconesAutorisees = listeIcones.filter((item) =>
    item.roleOk?.includes(user?.role),
  );

  useLayoutEffect(() => {
    const calculerPositionCercle = () => {
      const elementActif = elementsRef.current[page];

      if (!elementActif) return;

      const centreElement =
        elementActif.offsetLeft + elementActif.offsetWidth / 2;

      setPositionCercle(centreElement - 32);
    };

    calculerPositionCercle();

    window.addEventListener("resize", calculerPositionCercle);

    return () => {
      window.removeEventListener("resize", calculerPositionCercle);
    };
  }, [page, user?.role]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-[10vh] w-full overflow-x-auto bg-(--card-bg) text-white">
      <ul className="relative flex h-full w-max flex-nowrap items-center gap-x-0 bg-(--card-bg) px-1">
        <div
          className="
            pointer-events-none
            absolute
            left-0
            top-4
            z-10
            h-16
            w-16
            rounded-full
            bg-(--card-bg)
            shadow-[5px_5px_12px_rgba(0,0,0,0.45),-4px_-4px_10px_rgba(255,255,255,0.06),0_0_10px_rgba(250,204,21,0.16)]
            transition-transform
            duration-700
          "
          style={{
            transform: `translateX(${positionCercle}px)`,
          }}
        />

        {iconesAutorisees.map((item) => {
          const Icone = item.composant;
          const actif = page === item.page;

          return (
            <li
              key={item.page}
              ref={(element) => {
                elementsRef.current[item.page] = element;
              }}
              className="
                relative
                z-30
                flex
                w-18
                flex-none
                shrink-0
                items-center
                justify-center
                pb-2
              "
            >
              <button
                type="button"
                onClick={() => setPage(item.page)}
                className={`
                  relative
                  z-20
                  flex
                  h-16
                  w-16
                  shrink-0
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-full
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