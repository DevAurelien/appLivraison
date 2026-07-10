import { useContext, useState } from "react";
import { MenuContext } from "../contexte/menuContext";
import apiFetch from "../utils/apiFetch";
import { UserContext } from "../contexte/userContext";
import Pulse from "../components/Loading.jsx"

export default function Inscription() {
  const [formulaire, setFormulaire] = useState({
    email: "",
    password: "",
    role: "Client",
    reponse: "",
    couleur: "rouge",
    loading: false,
  });

  const { setPage } = useContext(MenuContext);
  const { setUser } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    setFormulaire((prev) => ({ ...prev, loading: true }));

    apiFetch(`/auth/register`, "POST", {
      body: JSON.stringify({
        email: formulaire.email,
        password: formulaire.password,
        role: formulaire.role,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.accessToken) {
          const dateLisible = new Date(data.data.created_at).toLocaleDateString(
            "fr-FR",
          );
          localStorage.setItem("accessToken", data.accessToken);
          setUser((prev) => ({
            ...prev,
            email: data.data.email,
            accessToken: data.accessToken,
            role: data.data.role,
            creeLe: dateLisible,
          }));

          setFormulaire((prev) => ({
            ...prev,
            email: "",
            password: "",
            reponse: data.message || "Inscription réussie",
            couleur: "vert",
            loading: false,
          }));

          setPage("Accueil");
        } else {
          setFormulaire((prev) => ({
            ...prev,
            reponse: data.message || "Inscription échouée",
            couleur: "rouge",
            loading: false,
          }));
        }
      })
      .catch((e) => {
        setFormulaire((prev) => ({
          ...prev,
          loading: false,
          reponse:
            e.message || "Une erreur s'est produite pendant l'inscription",
          couleur: "rouge",
        }));
      });
  };

  return (
    <div className="flex background w-full h-full text-white justify-center items-center">
      <div className="p-4 relative flex w-4/5 md:w-2/3 justify-center items-center bg-transparent border-white rounded-xl">
        <form
          className="z-5 p-4 w-4/5 flex flex-col gap-8 justify-center items-center"
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl md:text-4xl cursor-default">S'inscrire</h1>
          <p
            onClick={() => setPage("connection")}
            className="cursor-pointer text-red-800 text-xl font-bold"
          >
            Deja inscrit ?
          </p>
          <div className="relative flex w-full">
            <input
              id="email"
              name="email"
              type="email"
              className="peer border-white border-b w-full p-2 focus:outline-none"
              value={formulaire.email}
              onChange={(e) => {
                const valeur = e.target.value;

                setFormulaire((ancienneValeur) => ({
                  ...ancienneValeur,
                  email: valeur,
                }));
              }}
            />

            <label
              htmlFor="email"
              className={`pointer-events-none cursor-text
      absolute left-0 p-2
      transition-all duration-300
      peer-focus:-top-7 peer-focus:opacity-100
      ${formulaire.email != "" ? "-top-7 opacity-100" : "top-0 opacity-20"}
    `}
            >
              Email
            </label>
          </div>
          <div className="relative flex w-full">
            <input
              id="password"
              name="password"
              type="password"
              className="peer border-white border-b w-full p-2 focus:outline-none"
              value={formulaire.password}
              onChange={(e) => {
                const valeur = e.target.value;
                setFormulaire((ancienneVal) => ({
                  ...ancienneVal,
                  password: valeur,
                }));
              }}
            />
            <label
              htmlFor="password"
              className={`pointer-events-none cursor-text
      absolute left-0 p-2
      transition-all duration-300
      peer-focus:-top-7 peer-focus:opacity-100
      ${formulaire.password != "" ? "-top-7 opacity-100" : "top-0 opacity-20"}
    `}
            >
              Mot de passe
            </label>
          </div>
          <p
            className={`text-center text-sm ${formulaire.couleur === "rouge" ? "text-red-600" : "text-green-600"} `}
          >
            {formulaire.reponse}
          </p>
          <div className="relative w-full rounded-xl">

            <button
              type="submit"
              disabled={formulaire.loading}
              className="relative z-5 flex cursor-pointer justify-center items-center border border-white w-full rounded-4xl text-white disabled:cursor-not-allowed"
            >
              {formulaire.loading ? <Pulse/> : "S'inscrire"}
            </button>
          </div>
        </form>
        <div className="z-0 absolute top-0 left-0 p-4 h-full w-full border backdrop-blur-xl bg-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_20px_60px_rgba(0,0,0,0.35)] border-white/30 rounded-xl"></div>
      </div>
    </div>
  );
}
