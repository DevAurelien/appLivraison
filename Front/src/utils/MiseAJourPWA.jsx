import { useRegisterSW } from "virtual:pwa-register/react";

export default function MiseAJourPWA() {
  const {
    needRefresh: [
      besoinMiseAJour,
      setBesoinMiseAJour,
    ],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      if (!registration) return;

      const intervalle = 60 * 60 * 1000;

      setInterval(() => {
        registration.update();
      }, intervalle);
    },

    onRegisterError(error) {
      console.error(
        "Erreur Service Worker :",
        error,
      );
    },
  });

  if (!besoinMiseAJour) {
    return null;
  }

  const mettreAJour = async () => {
    await updateServiceWorker(true);
  };

  const fermer = () => {
    setBesoinMiseAJour(false);
  };

  return (
    <div
      className="
        fixed
        inset-x-4
        bottom-[12vh]
        z-9999
        mx-auto
        max-w-md
        rounded-2xl
        border
        border-yellow-400/30
        bg-[#0b1729]
        p-4
        text-white
        shadow-2xl
      "
    >
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-lg font-semibold">
            Mise à jour disponible
          </h2>

          <p className="mt-1 text-sm text-white/70">
            Une nouvelle version de Zesteo est disponible.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={fermer}
            className="
              flex-1
              rounded-xl
              border
              border-white/15
              px-4
              py-2
              text-sm
            "
          >
            Plus tard
          </button>

          <button
            type="button"
            onClick={mettreAJour}
            className="
              flex-1
              rounded-xl
              bg-yellow-400
              px-4
              py-2
              text-sm
              font-semibold
              text-black
            "
          >
            Mettre à jour
          </button>
        </div>
      </div>
    </div>
  );
}