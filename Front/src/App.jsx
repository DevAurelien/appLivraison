import { lazy, Suspense, useContext, useEffect } from "react";
import { MenuContext } from "./contexte/menuContext.jsx";
import HeaderLogo from "./Page/HeaderLogo.jsx";
import Pulse from "./components/Loading.jsx"

const chargerSeConnecter = () => import("./Page/SeConnecter.jsx");
const chargerInscription = () => import("./Page/Inscription.jsx");
const chargerAccueil = () => import("./Page/pageAccueil/Accueil.jsx");
const chargerProfil = () => import("./Page/pageProfil/Profil.jsx");

const chargerLivraisons = () =>
  import("./Page/pageLivraisons/Livraisons.jsx");

const chargerContacts = () =>
  import("./Page/pageMessages/Contacts.jsx");

const chargerMessagerie = () =>
  import("./Page/pageMessages/Messagerie.jsx");

const chargerAdministration = () =>
  import("./Page/pageAdmin/Administration.jsx");

const SeConnecter = lazy(chargerSeConnecter);
const Inscription = lazy(chargerInscription);
const Accueil = lazy(chargerAccueil);
const Profil = lazy(chargerProfil);
const Livraisons = lazy(chargerLivraisons);
const Contacts = lazy(chargerContacts);
const Messagerie = lazy(chargerMessagerie);
const Administration = lazy(chargerAdministration);

export default function App() {
  const { page } = useContext(MenuContext);

  useEffect(() => {
  if (page !== "connection" && page !== "inscription") return;

  const prechargerToutesLesPages = () => {
    Promise.allSettled([
      chargerAccueil(),
      chargerProfil(),
      chargerLivraisons(),
      chargerContacts(),
      chargerMessagerie(),
      chargerAdministration(),
    ]);
  };

  const compatibleIdleCallback = "requestIdleCallback" in window;

  const id = compatibleIdleCallback
    ? window.requestIdleCallback(prechargerToutesLesPages, {
        timeout: 1500,
      })
    : window.setTimeout(prechargerToutesLesPages, 500);

  return () => {
    if (compatibleIdleCallback) {
      window.cancelIdleCallback(id);
    } else {
      window.clearTimeout(id);
    }
  };
}, []);

  const afficherHeader =
    page !== "connection" && page !== "inscription";

  return (
    <div className="flex h-full w-full flex-col text-white">
      {afficherHeader && <HeaderLogo />}

      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <Pulse />
          </div>
        }
      >
        {page === "connection" && <SeConnecter />}
        {page === "inscription" && <Inscription />}
        {page === "Accueil" && <Accueil />}
        {page === "Profil" && <Profil />}
        {page === "Livraisons" && <Livraisons />}
        {page === "Contacts" && <Contacts />}
        {page === "Messagerie" && <Messagerie />}
        {page === "Administration" && <Administration />}
      </Suspense>
    </div>
  );
}