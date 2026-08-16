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

/*
 * AUTHENTIFICATION
 */
import SeConnecter from "./Page/SeConnecter.jsx";
import Inscription from "./Page/Inscription.jsx";

/*
 * PAGES PRINCIPALES
 */
import Accueil from "./Page/pageAccueil/Accueil.jsx";
import Profil from "./Page/pageProfil/Profil.jsx";
import Livraisons from "./Page/pageLivraisons/Livraisons.jsx";
import Contacts from "./Page/pageMessages/Contacts.jsx";
import Messagerie from "./Page/pageMessages/Messagerie.jsx";

/*
 * ADMINISTRATION
 */
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
  const { user, authLoading } =
    useContext(UserContext);

  const { pathname } = useLocation();

  if (authLoading) {
    return (
      <div
        className="
          flex
          h-full
          w-full
          items-center
          justify-center
        "
      >
        <Pulse />
      </div>
    );
  }


  const connecte = Boolean(user?.id);


  /* Header Zesteo pas affiché */

  
  const pageAuthentification =
    pathname === "/connection" ||
    pathname === "/inscription";


  const afficherHeader =
    connecte &&
    !pageAuthentification;


  const estAdministration =
    pathname === "/administration" ||
    pathname.startsWith("/administration/");


  return (
    <div
      className={`
        ${estAdministration ? "bg_test" : ""}

        flex
        h-full
        w-full
        flex-col
        text-white
        select-none
      `}
    >

      {afficherHeader && <HeaderLogo />}


      <Routes>

        {/* ================================================== */}
        {/* RACINE */}
        {/* ================================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to={
                connecte
                  ? "/accueil"
                  : "/connection"
              }
              replace
            />
          }
        />


        {/* ================================================== */}
        {/* AUTHENTIFICATION */}
        {/* ================================================== */}

        <Route
          path="/connection"
          element={
            connecte
              ? (
                <Navigate
                  to="/accueil"
                  replace
                />
              )
              : <SeConnecter />
          }
        />


        <Route
          path="/inscription"
          element={
            connecte
              ? (
                <Navigate
                  to="/accueil"
                  replace
                />
              )
              : <Inscription />
          }
        />


        {/* ================================================== */}
        {/* PAGES PRINCIPALES */}
        {/* ================================================== */}

        <Route
          path="/accueil"
          element={
            connecte
              ? <Accueil />
              : (
                <Navigate
                  to="/connection"
                  replace
                />
              )
          }
        />


        <Route
          path="/profil"
          element={
            connecte
              ? <Profil />
              : (
                <Navigate
                  to="/connection"
                  replace
                />
              )
          }
        />


        <Route
          path="/livraisons"
          element={
            connecte
              ? <Livraisons />
              : (
                <Navigate
                  to="/connection"
                  replace
                />
              )
          }
        />


        <Route
          path="/contacts"
          element={
            connecte
              ? <Contacts />
              : (
                <Navigate
                  to="/connection"
                  replace
                />
              )
          }
        />


        <Route
          path="/messagerie"
          element={
            connecte
              ? <Messagerie />
              : (
                <Navigate
                  to="/connection"
                  replace
                />
              )
          }
        />


        {/* ================================================== */}
        {/* ADMINISTRATION */}
        {/* ================================================== */}

        <Route
          path="/administration"
          element={
            connecte
              ? <Administration />
              : (
                <Navigate
                  to="/connection"
                  replace
                />
              )
          }
        />


        <Route
          path="/administration/livreurs"
          element={
            connecte
              ? <AdminLivreurs />
              : (
                <Navigate
                  to="/connection"
                  replace
                />
              )
          }
        />


        <Route
          path="/administration/agences"
          element={
            connecte
              ? <AdminAgences />
              : (
                <Navigate
                  to="/connection"
                  replace
                />
              )
          }
        />


        <Route
          path="/administration/camions"
          element={
            connecte
              ? <AdminCamions />
              : (
                <Navigate
                  to="/connection"
                  replace
                />
              )
          }
        />


        <Route
          path="/administration/secteurs"
          element={
            connecte
              ? <AdminSecteurs />
              : (
                <Navigate
                  to="/connection"
                  replace
                />
              )
          }
        />


        <Route
          path="/administration/plannings"
          element={
            connecte
              ? <AdminPlannings />
              : (
                <Navigate
                  to="/connection"
                  replace
                />
              )
          }
        />


        <Route
          path="/administration/incidents"
          element={
            connecte
              ? <AdminIncidents />
              : (
                <Navigate
                  to="/connection"
                  replace
                />
              )
          }
        />


        <Route
          path="/administration/statistiques"
          element={
            connecte
              ? <AdminStatistiques />
              : (
                <Navigate
                  to="/connection"
                  replace
                />
              )
          }
        />


        <Route
          path="/administration/gestions"
          element={
            connecte
              ? <AdminGestions />
              : (
                <Navigate
                  to="/connection"
                  replace
                />
              )
          }
        />


        {/* ================================================== */}
        {/* ROUTE INCONNUE */}
        {/* ================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to={
                connecte
                  ? "/accueil"
                  : "/connection"
              }
              replace
            />
          }
        />

      </Routes>

    </div>
  );
}