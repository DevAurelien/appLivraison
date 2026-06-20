import { useContext, useState } from "react";
import { MenuContext } from "../contexte/menuContext";

export default function SeConnecter() {
  const [formulaire, setFormulaire] = useState({
    email: "",
    password: "",
  });

  const {setPage} = useContext(MenuContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormulaire({ email: "", password: "" });
  };

  return (
    <div className="flex bg-black w-full h-full text-white justify-center items-center">
      <div className="p-4 flex w-4/5 md:w-2/3 justify-center items-center border border-white rounded-xl">
        <form
          className="p-4 w-full flex flex-col gap-4 justify-center items-center"
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl md:text-4xl cursor-default">Se connecter</h1>
          <p onClick={()=>setPage("inscription")} className="cursor-pointer text-red-200">
            Pas encore inscrit ?
          </p>
          <input
            type="email"
            placeholder="Email"
            className="outline outline-white w-full p-4 rounded-xl text-white/40"
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
            className="outline outline-white w-full rounded-xl text-white/40 p-4"
            value={formulaire.password}
            onChange={(e) =>
              setFormulaire((ancienneVal) => ({
                ...ancienneVal,
                password: e.target.value,
              }))
            }
          />
          <button
            type="submit"
            className="flex cursor-pointer justify-center items-center outline outline-white w-1/3 rounded-xl text-white/40 p-4"
          >
            Valider
          </button>
        </form>
      </div>
    </div>
  );
}
