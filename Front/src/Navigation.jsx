import Home from "./components/componentsIcone/Home.jsx";
import LivraisonIcone from "./components/componentsIcone/LivraisonIcone.jsx";
import UserIcone from "./components/componentsIcone/UserIcone.jsx";
import MessagesIcone from "./components/componentsIcone/Messages.jsx";
import Engrenages from "./components/componentsIcone/Engrenages.jsx";
import { useContext, useLayoutEffect, useRef, useState } from "react";
import { MenuContext } from "./contexte/menuContext.jsx";
import { UserContext } from "./contexte/userContext.jsx";

export default function BarreNavigation() {
  const { page, setPage } = useContext(MenuContext);
  const { user } = useContext(UserContext);

  const elementsRef = useRef({});
  const blobRef = useRef(null);

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
      titre: "Administration",
      page: "Administration",
      composant: Engrenages,
      roleOk: ["Livreur"],
    },
    {
      titre: "Profil",
      page: "Profil",
      composant: UserIcone,
      roleOk: ["Client", "Livreur"],
    },
  ];

  const iconesAutorisees = listeIcones.filter((item) =>
    item.roleOk?.includes(user?.role),
  );

  const activeIndex = iconesAutorisees.findIndex((item) => item.page === page);

  useLayoutEffect(() => {
    const calculerPositionCercle = () => {
      const elementActif = elementsRef.current[page];
      const blob = blobRef.current;

      if (!elementActif || !blob) return;

      const centreElement =
        elementActif.offsetLeft + elementActif.offsetWidth / 2;

      setPositionCercle(centreElement - blob.offsetWidth / 2);
    };

    calculerPositionCercle();

    window.addEventListener("resize", calculerPositionCercle);

    return () => {
      window.removeEventListener("resize", calculerPositionCercle);
    };
  }, [page, user?.role]);

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 h-[10vh] w-full bg-(--card-bg) text-white rounded-4xl">
      
      <ul className="relative flex h-full w-full flex-nowrap items-center bg-(--card-bg) cardLiv px-1 rounded-4xl">
        <div
          ref={blobRef}
          className={`nav-active-blob shape-${activeIndex}`}
          style={{
            width: "70px",
            height: "70px",
            transform: `translate(${positionCercle}px, -50%)`,
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
                min-w-0
                flex-1
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
                  width={30}
                  height={30}
                  titre={item.titre}
                  color1={actif ? "#fde047" : "#fff"}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
