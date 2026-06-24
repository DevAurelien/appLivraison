import { useContext, useState } from "react";
import { MenuContext } from "../contexte/menuContext";

export default function Inscription() {
  const [formulaire, setFormulaire] = useState({
    email: "",
    password: "",
    role: "Client",
    reponse: "",
    couleur: "rouge",
  });

  const adresse = import.meta.env.VITE_API_URL;
  const { setPage } = useContext(MenuContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reponse = await fetch(`${adresse}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formulaire),
    });
    const res = await reponse.json();
    let couleurReponse;
    console.log(res)
    res.couleur ? (couleurReponse = res.couleur) : (couleurReponse = "rouge");
    setFormulaire({
      email: "",
      password: "",
      reponse: res.message,
      couleur: couleurReponse,
    });
    res.ok && setPage("Accueil");
  };

  return (
    <div className="flex bg-black w-full h-full text-white justify-center items-center">
      <div className="p-4 flex w-4/5 md:w-2/3 justify-center items-center border border-white rounded-xl">
        <form
          className="p-4 w-full flex flex-col gap-4 justify-center items-center"
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl md:text-4xl cursor-default">S'inscrire</h1>
          <p
            onClick={() => setPage("connection")}
            className="cursor-pointer text-red-200"
          >
            Deja inscrit ?
          </p>
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="outline outline-white w-full p-4 rounded-xl placeholder:text-white/40"
            value={formulaire.email}
            onChange={(e) => {
              const valeur = e.target.value;

              setFormulaire((ancienneValeur) => ({
                ...ancienneValeur,
                email: valeur,
              }));
            }}
          />
          <input
            name="password"
            type="password"
            placeholder="Mot de passe"
            className="outline outline-white w-full rounded-xl placeholder:text-white/40 p-4"
            value={formulaire.password}
            onChange={(e) => {
              const valeur = e.target.value;
              setFormulaire((ancienneVal) => ({
                ...ancienneVal,
                password: valeur,
              }));
            }}
          />
          <p
            className={`${formulaire.couleur === "rouge" ? "text-red-600" : "text-green-600"}  text-xl`}
          >
            {formulaire.reponse}
          </p>
          <button
            type="submit"
            className="flex cursor-pointer justify-center items-center outline outline-white w-1/3 rounded-xl text-white/40 p-4"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
}
