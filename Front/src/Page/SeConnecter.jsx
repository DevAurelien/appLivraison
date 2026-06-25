import { useContext, useState } from "react";
import { MenuContext } from "../contexte/menuContext";

export default function SeConnecter() {
  const [formulaire, setFormulaire] = useState({
    email: "",
    password: "",
    reponse: null,
  });

  const adresse = import.meta.env.VITE_BACKEND_URL;
  const { setPage } = useContext(MenuContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(adresse)
    fetch(`${adresse}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formulaire),
      
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.accessToken) {
          localStorage.setItem(
            "token",
            JSON.stringify({
              email: formulaire.email,
              accessToken: data.accessToken,
            })
          );
        }

        setFormulaire((ancienneVal) => ({
          ...ancienneVal,
          email: "",
          password: "",
          reponse: data.message || JSON.stringify(data),
          couleur: data.couleur || (data.accessToken ? "vert" : "rouge"),
        }));
        data.ok && setPage("Accueil");
      })
      .catch((error) => {
        console.error(error.message)
        setFormulaire((ancienneVal) => ({
          ...ancienneVal,
          reponse: "Connection Echoué",
          couleur: "rouge",
        }));
      });
  };

  return (
    <div className="flex bg-black w-full h-full text-white justify-center items-center">
      <div className="p-4 flex w-4/5 md:w-2/3 justify-center items-center border border-white rounded-xl">
        <form
          className="p-4 w-full flex flex-col gap-4 justify-center items-center"
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl md:text-4xl cursor-default">Se connecter</h1>
          <p
            onClick={() => setPage("inscription")}
            className="cursor-pointer text-red-200"
          >
            Pas encore inscrit ?
          </p>
          <input
            type="email"
            placeholder="Email"
            className="outline outline-white w-full p-4 rounded-xl placeholder:text-white/40"
            value={formulaire.email}
            onChange={(e) =>
              setFormulaire((ancienneVal) => ({
                ...ancienneVal,
                email: e.target.value,
              }))
            }
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="outline outline-white w-full rounded-xl placeholder:text-white/40 p-4"
            value={formulaire.password}
            onChange={(e) =>
              setFormulaire((ancienneVal) => ({
                ...ancienneVal,
                password: e.target.value,
              }))
            }
          />
          <p
            className={`${formulaire.couleur === "rouge" ? "text-red-600" : "text-green-600"}  md:text-xl`}
          >
            {formulaire.reponse}
          </p>
          <button
            type="submit"
            className="flex cursor-pointer justify-center items-center outline outline-white w-1/3 rounded-xl text-white p-4"
          >
            Valider
          </button>
        </form>
      </div>
    </div>
  );
}
