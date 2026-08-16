import {
  createContext,
  useCallback,
  useMemo,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";


export const MenuContext = createContext({
  page: "connection",
  setPage: () => {},
});


const routesParPage = {
  connection: "/connection",
  inscription: "/inscription",

  Accueil: "/accueil",
  Profil: "/profil",
  Livraisons: "/livraisons",
  Contacts: "/contacts",
  Messagerie: "/messagerie",

  Administration: "/administration",

  AdminLivreurs: "/administration/livreurs",
  AdminAgences: "/administration/agences",
  AdminCamions: "/administration/camions",
  AdminSecteurs: "/administration/secteurs",
  AdminPlannings: "/administration/plannings",
  AdminIncidents: "/administration/incidents",
  AdminStatistiques: "/administration/statistiques",
  AdminGestions: "/administration/gestions",
};


export function MenuContextProvider({
  children,
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();


  const setPage = useCallback(
    (nouvellePage) => {
      const route =
        routesParPage[nouvellePage];

      if (!route) {
        console.error(
          `Route inconnue : ${nouvellePage}`,
        );

        return;
      }

      navigate(route);
    },
    [navigate],
  );


  const page = useMemo(() => {
    const correspondance =
      Object.entries(routesParPage)
        .sort(
          ([, routeA], [, routeB]) =>
            routeB.length -
            routeA.length,
        )
        .find(
          ([, route]) =>
            pathname === route ||
            pathname.startsWith(
              `${route}/`,
            ),
        );

    return (
      correspondance?.[0] ??
      "connection"
    );
  }, [pathname]);


  return (
    <MenuContext.Provider
      value={{
        page,
        setPage,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}