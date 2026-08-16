import Home from "./components/componentsIcone/Home.jsx";
import LivraisonIcone from "./components/componentsIcone/LivraisonIcone.jsx";
import UserIcone from "./components/componentsIcone/UserIcone.jsx";
import MessagesIcone from "./components/componentsIcone/Messages.jsx";
import Engrenages from "./components/componentsIcone/Engrenages.jsx";

import {
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { UserContext } from "./contexte/userContext.jsx";

export default function BarreNavigation() {
  const { user } = useContext(UserContext);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const elementsRef = useRef({});
  const blobRef = useRef(null);

  const [positionCercle, setPositionCercle] = useState(0);

  const permissions = useMemo(
    () =>
      Array.isArray(user?.permissions)
        ? user.permissions
        : [],
    [user?.permissions],
  );

  const listeIcones = useMemo(
    () => [
      {
        titre: "Accueil",
        route: "/accueil",
        composant: Home,
        authentificationSeulement: true,
      },

      {
        titre: "Livraisons",
        route: "/livraisons",
        composant: LivraisonIcone,

        permissionsRequises: [
          "LIVRAISONS_LIRE_SOI",
          "LIVRAISONS_LIRE_AGENCE",
          "LIVRAISONS_LIRE_TOUTES",
        ],
      },

      {
        titre: "Messages",
        route: "/contacts",
        composant: MessagesIcone,

        permissionsRequises: [
          "MESSAGES_LIRE",
        ],
      },

      {
        titre: "Administration",
        route: "/administration",
        composant: Engrenages,

        permissionsRequises: [
          /*
           * Utilisateurs
           */
          "UTILISATEURS_LIRE",
          "UTILISATEURS_CREER",
          "UTILISATEURS_MODIFIER",
          "UTILISATEURS_SUPPRIMER",
          "UTILISATEURS_MODIFIER_ROLE",

          /*
           * Agences
           */
          "AGENCES_LIRE",
          "AGENCES_CREER",
          "AGENCES_MODIFIER",
          "AGENCES_SUPPRIMER",
          "AGENCES_AFFECTER_SALARIE",

          /*
           * Pointages
           */
          "POINTAGES_LIRE_AGENCE",
          "POINTAGES_LIRE_TOUS",
          "POINTAGES_MODIFIER",
          "POINTAGES_SUPPRIMER",

          /*
           * Camions
           */
          "CAMIONS_LIRE",
          "CAMIONS_CREER",
          "CAMIONS_MODIFIER",
          "CAMIONS_SUPPRIMER",
          "CAMIONS_AFFECTER_EQUIPAGE",

          /*
           * Secteurs
           */
          "SECTEURS_LIRE",
          "SECTEURS_CREER",
          "SECTEURS_MODIFIER",
          "SECTEURS_SUPPRIMER",

          /*
           * Planning
           */
          "PLANNING_LIRE",
          "PLANNING_CREER",
          "PLANNING_MODIFIER",
          "PLANNING_REPLANIFIER",
          "PLANNING_SUPPRIMER",

          /*
           * Incidents
           */
          "INCIDENTS_LIRE",
          "INCIDENTS_CREER",
          "INCIDENTS_MODIFIER",
          "INCIDENTS_CLOTURER",

          /*
           * Statistiques
           */
          "STATISTIQUES_LIRE",
          "STATISTIQUES_EXPORTER",

          /*
           * Factures
           */
          "FACTURES_LIRE",
          "FACTURES_CREER",
          "FACTURES_MODIFIER",
          "FACTURES_VALIDER",
          "FACTURES_SUPPRIMER",

          /*
           * Rôles
           */
          "ROLES_LIRE",
          "ROLES_MODIFIER",
          "ROLES_GERER_PERMISSIONS",

          /*
           * Super administrateur
           */
          "SYSTEME_ADMINISTRER",
        ],
      },

      {
        titre: "Profil",
        route: "/profil",
        composant: UserIcone,
        authentificationSeulement: true,
      },
    ],
    [],
  );

  const iconesAutorisees = useMemo(() => {
    if (!user?.id) {
      return [];
    }

    return listeIcones.filter((item) => {
      if (item.authentificationSeulement) {
        return true;
      }

      if (!Array.isArray(item.permissionsRequises)) {
        return false;
      }

      return item.permissionsRequises.some(
        (permission) =>
          permissions.includes(permission),
      );
    });
  }, [
    listeIcones,
    permissions,
    user?.id,
  ]);

  const routeEstActive = (route) => {
    return (
      pathname === route ||
      pathname.startsWith(`${route}/`)
    );
  };

  const routeNavigationActive =
    iconesAutorisees.find((item) =>
      routeEstActive(item.route),
    )?.route;

  const activeIndex =
    iconesAutorisees.findIndex(
      (item) =>
        item.route === routeNavigationActive,
    );

  useLayoutEffect(() => {
    const calculerPositionCercle = () => {
      if (!routeNavigationActive) {
        return;
      }

      const elementActif =
        elementsRef.current[
          routeNavigationActive
        ];

      const blob = blobRef.current;

      if (!elementActif || !blob) {
        return;
      }

      const centreElement =
        elementActif.offsetLeft +
        elementActif.offsetWidth / 2;

      setPositionCercle(
        centreElement -
          blob.offsetWidth / 2,
      );
    };

    const animationFrame =
      requestAnimationFrame(
        calculerPositionCercle,
      );

    window.addEventListener(
      "resize",
      calculerPositionCercle,
    );

    return () => {
      cancelAnimationFrame(
        animationFrame,
      );

      window.removeEventListener(
        "resize",
        calculerPositionCercle,
      );
    };
  }, [
    routeNavigationActive,
    iconesAutorisees.length,
  ]);

  if (
    !user?.id ||
    iconesAutorisees.length === 0
  ) {
    return null;
  }

  return (
    <nav
      className="
        fixed
        right-0
        bottom-0
        left-0
        z-50
        h-[10vh]
        w-full
        rounded-4xl
        bg-(--card-bg)
        text-white
      "
    >
      <div className="relative h-full w-full">

        {activeIndex >= 0 && (
          <div
            ref={blobRef}
            className={`
              nav-active-blob
              shape-${activeIndex}
            `}
            style={{
              width: "70px",
              height: "70px",
              transform:
                `translate(${positionCercle}px, -50%)`,
            }}
          />
        )}

        <ul
          className="
            cardLiv
            flex
            h-full
            w-full
            flex-nowrap
            items-center
            rounded-4xl
            bg-(--card-bg)
            px-1
          "
        >
          {iconesAutorisees.map(
            (item) => {
              const Icone =
                item.composant;

              const actif =
                routeEstActive(
                  item.route,
                );

              return (
                <li
                  key={item.route}
                  ref={(element) => {
                    elementsRef.current[
                      item.route
                    ] = element;
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
                    aria-label={item.titre}
                    onClick={() => {
                      if (!actif) {
                        navigate(item.route);
                      }
                    }}
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

                      ${
                        actif
                          ? "text-yellow-300"
                          : "text-white"
                      }
                    `}
                  >
                    <Icone
                      width={30}
                      height={30}
                      titre={item.titre}
                      color1={
                        actif
                          ? "#fde047"
                          : "#fff"
                      }
                    />
                  </button>
                </li>
              );
            },
          )}
        </ul>
      </div>
    </nav>
  );
}