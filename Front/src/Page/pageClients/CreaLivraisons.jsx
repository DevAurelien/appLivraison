export default function CreaLivraisons() {
  return (
    <div className="mb-25 flex h-full w-full justify-center overflow-y-auto bg-[#06182c] px-5 pb-5 text-white">
      <div className="w-full max-w-3xl">

        {/* Présentation */}
        <div className="mb-7 rounded-4xl border border-[#273b57] bg-[#101f38] p-7">
          <p className="mb-2 text-sm font-bold tracking-[0.25em] text-[#ff8c98]">
            NOUVELLE LIVRAISON
          </p>

          <h1 className="text-4xl font-bold">
            Création livraison
          </h1>

          <p className="mt-2 text-[#8daed8]">
            Renseignez les informations nécessaires à la livraison du client.
          </p>
        </div>


        {/* Formulaire */}
        <div className="rounded-[28px] border border-[#273b57] bg-[#0c1d34] p-6">

          {/* Commande */}
          <div className="mb-7">
            <h2 className="mb-4 text-lg font-semibold">
              Commande
            </h2>

            <div className="grid gap-4 md:grid-cols-2">

              <input
                type="text"
                name="reference_commande"
                placeholder="Référence commande"
                className="rounded-2xl border border-[#2d425e] bg-[#08182b] px-4 py-4 outline-none transition focus:border-[#3f79bd]"
              />

              <select
                name="agence_id"
                defaultValue=""
                className="rounded-2xl border border-[#2d425e] bg-[#08182b] px-4 py-4 outline-none transition focus:border-[#3f79bd]"
              >
                <option value="" disabled>
                  Agence
                </option>

                {/* Les agences viendront plus tard de la BDD */}
              </select>

            </div>
          </div>


          {/* Adresse */}
          <div className="mb-7">
            <h2 className="mb-4 text-lg font-semibold">
              Adresse de livraison
            </h2>

            <div className="flex flex-col gap-4">

              <input
                type="text"
                name="adresse"
                placeholder="Adresse"
                className="rounded-2xl border border-[#2d425e] bg-[#08182b] px-4 py-4 outline-none transition focus:border-[#3f79bd]"
              />

              <input
                type="text"
                name="complement_adresse"
                placeholder="Complément d'adresse"
                className="rounded-2xl border border-[#2d425e] bg-[#08182b] px-4 py-4 outline-none transition focus:border-[#3f79bd]"
              />

              <div className="grid grid-cols-2 gap-4">

                <input
                  type="text"
                  name="code_postal"
                  placeholder="Code postal"
                  className="rounded-2xl border border-[#2d425e] bg-[#08182b] px-4 py-4 outline-none transition focus:border-[#3f79bd]"
                />

                <input
                  type="text"
                  name="ville"
                  placeholder="Ville"
                  className="rounded-2xl border border-[#2d425e] bg-[#08182b] px-4 py-4 outline-none transition focus:border-[#3f79bd]"
                />

              </div>

            </div>
          </div>


          {/* Accès */}
          <div className="mb-7">
            <h2 className="mb-4 text-lg font-semibold">
              Accès au logement
            </h2>

            <div className="grid gap-4 md:grid-cols-2">

              <input
                type="number"
                name="etage"
                min="0"
                placeholder="Étage"
                className="rounded-2xl border border-[#2d425e] bg-[#08182b] px-4 py-4 outline-none transition focus:border-[#3f79bd]"
              />


              <select
                name="ascenseur"
                defaultValue=""
                className="rounded-2xl border border-[#2d425e] bg-[#08182b] px-4 py-4 outline-none transition focus:border-[#3f79bd]"
              >
                <option value="" disabled>
                  Ascenseur
                </option>

                <option value="true">
                  Oui
                </option>

                <option value="false">
                  Non
                </option>
              </select>

            </div>


            <div className="mt-5 flex flex-col gap-4">

              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#2d425e] bg-[#08182b] px-4 py-4">
                <input
                  type="checkbox"
                  name="acces_difficile"
                  className="h-5 w-5"
                />

                <span>
                  Accès difficile
                </span>
              </label>


              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#2d425e] bg-[#08182b] px-4 py-4">
                <input
                  type="checkbox"
                  name="appeler_avant"
                  className="h-5 w-5"
                />

                <span>
                  Appeler le client avant la livraison
                </span>
              </label>

            </div>
          </div>


          {/* Planification */}
          <div className="mb-7">
            <h2 className="mb-4 text-lg font-semibold">
              Planification
            </h2>

            <input
              type="date"
              name="date_livraison_prevue"
              className="w-full rounded-2xl border border-[#2d425e] bg-[#08182b] px-4 py-4 outline-none transition focus:border-[#3f79bd]"
            />
          </div>


          {/* Commentaire */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">
              Informations complémentaires
            </h2>

            <textarea
              name="commentaire_logistique"
              rows="4"
              placeholder="Informations utiles pour les livreurs..."
              className="w-full resize-none rounded-2xl border border-[#2d425e] bg-[#08182b] px-4 py-4 outline-none transition focus:border-[#3f79bd]"
            />
          </div>


          {/* Validation */}
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              className="
                rounded-2xl
                border border-[#d6a900]
                bg-[#332f0d]
                px-8 py-4
                font-semibold
                text-[#ffe100]
                transition
                hover:bg-[#49420d]
              "
            >
              Créer la livraison
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}