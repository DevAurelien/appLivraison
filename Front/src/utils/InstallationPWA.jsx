import {
  useEffect,
  useState,
} from "react";

import { useLocation } from "react-router-dom";

export default function InstallationPWA() {
  const { pathname } = useLocation();

  const [
    evenementInstallation,
    setEvenementInstallation,
  ] = useState(null);

  const [
    afficherModal,
    setAfficherModal,
  ] = useState(false);

  const [
    ignorePourCetteSession,
    setIgnorePourCetteSession,
  ] = useState(false);

  const applicationDejaInstallee = () => {
    return (
      window.matchMedia(
        "(display-mode: standalone)",
      ).matches ||
      window.navigator.standalone === true
    );
  };

  useEffect(() => {
    const preparerInstallation = (event) => {
      event.preventDefault();

      setEvenementInstallation(event);
    };


    const installationTerminee = () => {
      setEvenementInstallation(null);
      setAfficherModal(false);
    };


    window.addEventListener(
      "beforeinstallprompt",
      preparerInstallation,
    );

    window.addEventListener(
      "appinstalled",
      installationTerminee,
    );


    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        preparerInstallation,
      );

      window.removeEventListener(
        "appinstalled",
        installationTerminee,
      );
    };
  }, []);

  useEffect(() => {
    if (
      pathname !== "/accueil" ||
      !evenementInstallation ||
      applicationDejaInstallee() ||
      ignorePourCetteSession
    ) {
      setAfficherModal(false);
      return;
    }


    const delai = setTimeout(() => {
      setAfficherModal(true);
    }, 2000);


    return () => {
      clearTimeout(delai);
    };
  }, [
    pathname,
    evenementInstallation,
    ignorePourCetteSession,
  ]);


  const installerApplication = async () => {
    if (!evenementInstallation) {
      return;
    }

    try {
     
      await evenementInstallation.prompt();

      const choix =
        await evenementInstallation.userChoice;

      console.log(
        "Choix installation PWA :",
        choix.outcome,
      );

      setEvenementInstallation(null);
      setAfficherModal(false);
    } catch (error) {
      console.error(
        "Erreur installation PWA :",
        error,
      );
    }
  };


  const installerPlusTard = () => {
    setAfficherModal(false);

    setIgnorePourCetteSession(true);
  };


  if (!afficherModal) {
    return null;
  }


  return (
    <div
      className="
        fixed
        inset-0
        z-9999
        flex
        items-center
        justify-center
        bg-black/60
        px-5
        backdrop-blur-sm
      "
    >
      <div
        className="
          w-full
          max-w-sm
          rounded-3xl
          border
          border-white/10
          bg-[#081222]
          p-6
          text-white
          shadow-2xl
        "
      >
        <div
          className="
            flex
            flex-col
            items-center
            text-center
          "
        >
          <img
            src="/zesteo192.png"
            alt="Zesteo"
            className="
              mb-4
              h-20
              w-20
              object-contain
            "
          />

          <h2
            className="
              text-xl
              font-semibold
            "
          >
            Installer Zesteo
          </h2>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-white/65
            "
          >
            Installe Zesteo sur ton appareil
            pour y accéder directement comme
            une application.
          </p>


          <button
            type="button"
            onClick={installerApplication}
            className="
              mt-6
              w-full
              cursor-pointer
              rounded-xl
              bg-yellow-400
              px-4
              py-3
              font-semibold
              text-[#081222]
              transition
              active:scale-[0.98]
            "
          >
            Installer Zesteo
          </button>


          <button
            type="button"
            onClick={installerPlusTard}
            className="
              mt-2
              w-full
              cursor-pointer
              rounded-xl
              px-4
              py-3
              text-sm
              text-white/55
              transition
              hover:text-white
            "
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );
}