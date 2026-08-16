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


  const estIOS = () => {
    return (
      /iPhone|iPad|iPod/i.test(
        navigator.userAgent,
      ) ||
      (
        navigator.platform === "MacIntel" &&
        navigator.maxTouchPoints > 1
      )
    );
  };

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

      sessionStorage.removeItem(
        "zesteo-installation-ignoree",
      );
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
    if (pathname !== "/accueil") {
      setAfficherModal(false);
      return;
    }

    if (applicationDejaInstallee()) {
      setAfficherModal(false);
      return;
    }


   
    const installationIgnoree =
      sessionStorage.getItem(
        "zesteo-installation-ignoree",
      );

    if (installationIgnoree === "true") {
      setAfficherModal(false);
      return;
    }

    if (estIOS()) {
      const delai = setTimeout(() => {
        setAfficherModal(true);
      }, 2000);

      return () => {
        clearTimeout(delai);
      };
    }

    if (!evenementInstallation) {
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
  ]);


  /*
   * Installation Android / Chrome.
   */
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

    sessionStorage.setItem(
      "zesteo-installation-ignoree",
      "true",
    );
  };


  if (!afficherModal) {
    return null;
  }


  /*
   * ==================================================
   * VERSION IPHONE / IPAD
   * ==================================================
   */

  if (estIOS()) {
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
              Ajoute Zesteo à ton écran
              d'accueil pour l'utiliser
              comme une véritable application.
            </p>


            <div
              className="
                mt-6
                w-full
                rounded-2xl
                bg-white/5
                p-4
                text-left
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-yellow-400
                    font-bold
                    text-[#081222]
                  "
                >
                  1
                </span>

                <span className="text-sm">
                  Appuie sur
                  <strong>
                    {" "}Partager
                  </strong>
                  {" "}dans ton navigateur.
                </span>
              </div>


              <div
                className="
                  mt-4
                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-yellow-400
                    font-bold
                    text-[#081222]
                  "
                >
                  2
                </span>

                <span className="text-sm">
                  Choisis
                  <strong>
                    {" "}Ajouter à l'écran d'accueil
                  </strong>.
                </span>
              </div>


              <div
                className="
                  mt-4
                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-yellow-400
                    font-bold
                    text-[#081222]
                  "
                >
                  3
                </span>

                <span className="text-sm">
                  Valide avec
                  <strong>
                    {" "}Ajouter
                  </strong>.
                </span>
              </div>
            </div>


            <button
              type="button"
              onClick={installerPlusTard}
              className="
                mt-5
                w-full
                cursor-pointer
                rounded-xl
                border
                border-white/10
                px-4
                py-3
                text-sm
                text-white/70
              "
            >
              J'ai compris
            </button>
          </div>
        </div>
      </div>
    );
  }


  /*
   * ==================================================
   * VERSION ANDROID / CHROME
   * ==================================================
   */

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


          <h2 className="text-xl font-semibold">
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
            "
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );
}