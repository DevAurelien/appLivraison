import { useContext } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { UserContext } from "./contexte/userContext.jsx";

import HeaderLogo from "./Page/HeaderLogo.jsx";
import Pulse from "./components/Loading.jsx";

// Authentification
import SeConnecter from "./Page/SeConnecter.jsx";
import Inscription from "./Page/Inscription.jsx";

// Pages principales
import Accueil from "./Page/pageAccueil/Accueil.jsx";
import Profil from "./Page/pageProfil/Profil.jsx";
import Livraisons from "./Page/pageLivraisons/Livraisons.jsx";
import Clients from "./Page/PageClients/Clients.jsx"
import Contacts from "./Page/pageMessages/Contacts.jsx";
import Messagerie from "./Page/pageMessages/Messagerie.jsx";
import CreaLivraisons from "./Page/pageClients/CreaLivraisons.jsx";

// Administration
import Administration from "./Page/pageAdmin/Administration.jsx";
import AdminLivreurs from "./Page/pageAdmin/AdminLivreurs.jsx";
import AdminGestions from "./Page/pageAdmin/AdminGestions.jsx";
import AdminAgences from "./Page/pageAdmin/AdminAgences.jsx";
import AdminCamions from "./Page/pageAdmin/AdminCamions.jsx";
import AdminPlannings from "./Page/pageAdmin/AdminPlannings.jsx";
import AdminIncidents from "./Page/pageAdmin/AdminIncidents.jsx";
import AdminSecteurs from "./Page/pageAdmin/AdminSecteurs.jsx";
import AdminStatistiques from "./Page/pageAdmin/AdminStatistiques.jsx";


export default function App() {
  const { user, authLoading } = useContext(UserContext);
  const { pathname } = useLocation();

  if (authLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Pulse />
      </div>
    );
  }

  const connecte = Boolean(user?.id);

  const compteExterne = ["CLIENT", "MAGASIN"].includes(
    user?.role_code,
  );

  const accesAdministration = connecte && !compteExterne;

  const pageAuthentification =
    pathname === "/connection" ||
    pathname === "/inscription";

  const afficherHeader =
    connecte && !pageAuthentification;

  const estAdministration =
    pathname === "/administration" ||
    pathname.startsWith("/administration/");

  const protegerPage = (page) => {
    if (connecte) return page;

    return <Navigate to="/connection" replace />;
  };

  const protegerAdmin = (page) => {
    if (accesAdministration) return page;

    return (
      <Navigate
        to={connecte ? "/accueil" : "/connection"}
        replace
      />
    );
  };

  return (
    <div
      className={`
        ${estAdministration ? "bg_test" : ""}
        flex h-full w-full flex-col text-white select-none
      `}
    >
      {afficherHeader && <HeaderLogo />}

      <Routes>
        {/* Racine */}
        <Route
          path="/"
          element={
            <Navigate
              to={connecte ? "/accueil" : "/connection"}
              replace
            />
          }
        />

        {/* Authentification */}
        <Route
          path="/connection"
          element={
            connecte ? (
              <Navigate to="/accueil" replace />
            ) : (
              <SeConnecter />
            )
          }
        />

        <Route
          path="/inscription"
          element={
            connecte ? (
              <Navigate to="/accueil" replace />
            ) : (
              <Inscription />
            )
          }
        />

        {/* Pages principales */}
        <Route
          path="/accueil"
          element={protegerPage(<Accueil />)}
        />

        <Route
          path="/profil"
          element={protegerPage(<Profil />)}
        />

        <Route
          path="/livraisons"
          element={protegerPage(<Livraisons />)}
        />

        <Route
          path="/clients"
          element={protegerPage(<Clients />)}
        />
        
        <Route
          path="/clients/creaLivraisons"
          element={protegerPage(<CreaLivraisons />)}
        />

        <Route
          path="/contacts"
          element={protegerPage(<Contacts />)}
        />

        <Route
          path="/messagerie"
          element={protegerPage(<Messagerie />)}
        />

        {/* Administration */}
        <Route
          path="/administration"
          element={protegerAdmin(<Administration />)}
        />

        <Route
          path="/administration/livreurs"
          element={protegerAdmin(<AdminLivreurs />)}
        />

        <Route
          path="/administration/agences"
          element={protegerAdmin(<AdminAgences />)}
        />

        <Route
          path="/administration/camions"
          element={protegerAdmin(<AdminCamions />)}
        />

        <Route
          path="/administration/secteurs"
          element={protegerAdmin(<AdminSecteurs />)}
        />

        <Route
          path="/administration/plannings"
          element={protegerAdmin(<AdminPlannings />)}
        />

        <Route
          path="/administration/incidents"
          element={protegerAdmin(<AdminIncidents />)}
        />

        <Route
          path="/administration/statistiques"
          element={protegerAdmin(<AdminStatistiques />)}
        />

        <Route
          path="/administration/gestions"
          element={protegerAdmin(<AdminGestions />)}
        />

        {/* Route inconnue */}
        <Route
          path="*"
          element={
            <Navigate
              to={connecte ? "/accueil" : "/connection"}
              replace
            />
          }
        />
      </Routes>
    </div>
  );
}