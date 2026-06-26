import { useContext, useState } from "react";
import { MenuContext } from "../contexte/menuContext";
import apiFetch from "../utils/apiFetch";

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
          localStorage.setItem("accessToken", data.accessToken);

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
          <div className="relative w-1/3 rounded-xl">
  {formulaire.loading && (
    <>
      <span className="light-border light-top"></span>
      <span className="light-border light-right"></span>
      <span className="light-border light-bottom"></span>
      <span className="light-border light-left"></span>
    </>
  )}

  <button
    type="submit"
    disabled={formulaire.loading}
    className="relative z-10 flex cursor-pointer justify-center items-center border border-white w-full rounded-xl text-white/40 p-4 disabled:cursor-not-allowed"
  >
    {formulaire.loading ? "Inscription..." : "S'inscrire"}
  </button>
</div>
        </form>
      </div>
    </div>
  );
}
