import { useNavigate } from "react-router-dom";

export default function Clients() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/clients/creaLivraisons");
  };

  return (
    <div className="flex h-full w-full justify-center overflow-y-auto bg-(--bg-main) px-5 text-white pb-5 mb-25">
      <div className="w-full max-w-3xl">
        {/* Présentation */}
        <div className="mb-7 rounded-4xl border border-[#273b57] bg-[#101f38] p-7">
          {/* <p className="mb-2 text-sm font-bold tracking-[0.25em] text-[#ff8c98]">
            NOUVEAU CLIENT
          </p> */}

          <h1 className="text-4xl font-bold">Création client</h1>

          <p className="mt-2 text-[#8daed8]">
            Renseignez les informations du client avant de créer sa livraison.
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="rounded-[28px] border border-[#273b57] bg-[#0c1d34] p-6">
          {/* Identité */}
          <div className="mb-7">
            <h2 className="mb-4 text-lg font-semibold">Identité</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                required
                type="text"
                name="nom"
                placeholder="Nom"
                className="rounded-2xl border border-[#2d425e] bg-[#08182b] px-4 py-4 outline-none transition focus:border-[#3f79bd]"
              />

              <input
                required
                type="text"
                name="prenom"
                placeholder="Prénom"
                className="rounded-2xl border border-[#2d425e] bg-[#08182b] px-4 py-4 outline-none transition focus:border-[#3f79bd]"
              />
            </div>
          </div>

          {/* Contact */}
          <div className="mb-7">
            <h2 className="mb-4 text-lg font-semibold">Coordonnées</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="email"
                name="email"
                placeholder="Adresse e-mail"
                className="rounded-2xl border border-[#2d425e] bg-[#08182b] px-4 py-4 outline-none transition focus:border-[#3f79bd]"
              />

              <input
                type="tel"
                name="telephone"
                placeholder="Téléphone"
                className="rounded-2xl border border-[#2d425e] bg-[#08182b] px-4 py-4 outline-none transition focus:border-[#3f79bd]"
              />
            </div>
          </div>

          {/* Validation */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
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
              Continuer vers la livraison
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

{
  /* Adresse */
}
// <div>
//   <h2 className="mb-4 text-lg font-semibold">
//     Adresse
//   </h2>

//   <div className="flex flex-col gap-4">
//     <input
//     required
//       type="text"
//       name="adresse"
//       placeholder="Adresse"
//       className="rounded-2xl border border-[#2d425e] bg-[#08182b] px-4 py-4 outline-none transition focus:border-[#3f79bd]"
//     />

//     <input
//       type="text"
//       name="complement_adresse"
//       placeholder="Complément d'adresse"
//       className="rounded-2xl border border-[#2d425e] bg-[#08182b] px-4 py-4 outline-none transition focus:border-[#3f79bd]"
//     />

//     <div className="grid grid-cols-2 gap-4">
//       <input
//       required
//         type="text"
//         name="code_postal"
//         placeholder="Code postal"
//         className="rounded-2xl border border-[#2d425e] bg-[#08182b] px-4 py-4 outline-none transition focus:border-[#3f79bd]"
//       />

//       <input
//       required
//         type="text"
//         name="ville"
//         placeholder="Ville"
//         className="rounded-2xl border border-[#2d425e] bg-[#08182b] px-4 py-4 outline-none transition focus:border-[#3f79bd]"
//       />
//     </div>

//     <input
//       type="number"
//       name="etage"
//       min="0"
//       placeholder="Étage"
//       className="w-32 rounded-2xl border border-[#2d425e] bg-[#08182b] px-4 py-4 outline-none transition focus:border-[#3f79bd]"
//     />
//   </div>
// </div>
