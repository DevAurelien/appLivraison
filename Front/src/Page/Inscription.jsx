import { useContext, useState } from "react";
import { MenuContext } from "../contexte/menuContext";
import apiFetch from "../utils/apiFetch";
import { UserContext } from "../contexte/userContext";
import Pulse from "../components/Loading.jsx";
import Zesteo_logo from "../components/Zesteo_Logo.jsx";

export default function Inscription() {
  const [formulaire, setFormulaire] = useState({
    email: "",
    password: "",
    birth: "",
    nom: "",
    prenom: "",
    phone: "",
    role: "Client",
    reponse: "",
    couleur: "rouge",
    loading: false,
  });

  const { setPage } = useContext(MenuContext);
  const { setUser } = useContext(UserContext);
  const champs = [
  formulaire.nom,
  formulaire.prenom,
  formulaire.email,
  formulaire.password,
  formulaire.phone,
  formulaire.birth,
];

  const handleSubmit = (e) => {
    e.preventDefault();

    const formulaireValide = champs.every(
  (champ) => champ.trim() !== "",
);
    if(!formulaireValide){
      setFormulaire((prev) => ({ ...prev, reponse: "Veuillez remplir tous les champs" }));
      return;
    }

    setFormulaire((prev) => ({ ...prev, loading: true }));

    apiFetch(`/auth/register`, "POST", {
      body: JSON.stringify({
        email: formulaire.email,
        password: formulaire.password,
        role: formulaire.role,
        birth: formulaire.birth,
        nom: formulaire.nom,
        prenom: formulaire.prenom,
        phone: formulaire.phone,
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
            birth: data.data.birth,
            nom: data.data.nom,
            prenom: data.data.prenom,
            phone: data.data.phone,
            creeLe: dateLisible,
          }));

          setFormulaire((prev) => ({
            ...prev,
            email: "",
            password: "",
            birth: "",
            nom: "",
            prenom: "",
            phone: "",
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
    <div className="flex flex-col background w-full h-full text-white justify-start items-center overflow-y-auto">
      <div className="w-full flex justify-center">
        <Zesteo_logo
          width={180}
          height={130}
          className="text-yellow-300 -mb-10"
        />
      </div>
      <div className="w-full flex flex-col justify-center items-center h-[14vh] gap-2">
        <h1 className="text-2xl font-bold">Creer un compte</h1>
        <h6 className="text-[0.8rem] ">
          Rejoignez Zesteo et simplifiez vos livraisons
        </h6>
      </div>
      <div className="p-4 relative flex w-[95vw] md:w-[75vw] justify-center items-center bg-transparent rounded-xl">
        <form
          className="z-5 p-4 w-full flex flex-col gap-7 justify-center items-center"
          onSubmit={handleSubmit}
        >
          {/* <h1 className="text-2xl md:text-4xl cursor-default">S'inscrire</h1> */}

          <div className="relative flex w-full">
            <input
            required
              id="Nom"
              name="Nom"
              type="text"
              className="peer border-white border-b w-full p-2 focus:outline-none"
              value={formulaire.nom}
              onChange={(e) => {
                const valeur = e.target.value;

                setFormulaire((ancienneValeur) => ({
                  ...ancienneValeur,
                  nom: valeur,
                }));
              }}
            />

            <label
              htmlFor="Nom"
              className={`pointer-events-none cursor-text
      absolute left-0 p-2
      transition-all duration-300
      peer-focus:-top-7 peer-focus:opacity-100
      ${formulaire.nom != "" ? "-top-7 opacity-100" : "top-0 opacity-20"}
    `}
            >
              Nom
            </label>
          </div>
          <div className="relative flex w-full">
            <input
            required
              id="Prenom"
              name="Prenom"
              type="text"
              className="peer border-white border-b w-full p-2 focus:outline-none"
              value={formulaire.prenom}
              onChange={(e) => {
                const valeur = e.target.value;

                setFormulaire((ancienneValeur) => ({
                  ...ancienneValeur,
                  prenom: valeur,
                }));
              }}
            />

            <label
              htmlFor="Prenom"
              className={`pointer-events-none cursor-text
      absolute left-0 p-2
      transition-all duration-300
      peer-focus:-top-7 peer-focus:opacity-100
      ${formulaire.prenom != "" ? "-top-7 opacity-100" : "top-0 opacity-20"}
    `}
            >
              Prenom
            </label>
          </div>
          <div className="relative flex w-full">
            <input
            required
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
            required
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
          <div className="relative flex w-full">
            <input
            required
              id="Phone"
              name="Phone"
              type="text"
              className="peer border-white border-b w-full p-2 focus:outline-none"
              value={formulaire.phone}
              onChange={(e) => {
                const valeur = e.target.value;

                setFormulaire((ancienneValeur) => ({
                  ...ancienneValeur,
                  phone: valeur,
                }));
              }}
            />

            <label
              htmlFor="Phone"
              className={`pointer-events-none cursor-text
      absolute left-0 p-2
      transition-all duration-300
      peer-focus:-top-7 peer-focus:opacity-100
      ${formulaire.phone != "" ? "-top-7 opacity-100" : "top-0 opacity-20"}
    `}
            >
              Telephone
            </label>
          </div>
          <div className="relative flex w-full">
            <input
            required
              id="Birth"
              name="Birth"
              type="text"
              className="peer border-white border-b w-full p-2 focus:outline-none"
              value={formulaire.birth}
              onChange={(e) => {
                const valeur = e.target.value;

                setFormulaire((ancienneValeur) => ({
                  ...ancienneValeur,
                  birth: valeur,
                }));
              }}
            />

            <label
              htmlFor="Phone"
              className={`pointer-events-none cursor-text
      absolute left-0 p-2
      transition-all duration-300
      peer-focus:-top-7 peer-focus:opacity-100
      ${formulaire.birth != "" ? "-top-7 opacity-100" : "top-0 opacity-20"}
    `}
            >
              Date de Naissance
            </label>
          </div>
          <p
            className={`text-center text-[0.8rem] ${formulaire.couleur === "rouge" ? "text-red-600" : "text-green-600"} `}
          >
            {formulaire.reponse}
          </p>
          <div className="relative w-full rounded-xl bg-yellow-300 p-2">
            <button
              type="submit"
              disabled={formulaire.loading}
              className="relative z-5 flex cursor-pointer justify-center items-center w-full rounded-xl text-black disabled:cursor-not-allowed"
            >
              {formulaire.loading ? <Pulse /> : "S'inscrire"}
            </button>
          </div>
        </form>
        <div className="z-0 absolute top-0 left-0 p-4 h-full w-full border backdrop-blur-xl bg-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_20px_60px_rgba(0,0,0,0.35)] border-white/30 rounded-xl"></div>
      </div>
      <p className="text-[1rem] py-2">
        Deja inscrit ?
        <span
          className="cursor-pointer text-yellow-300"
          onClick={() => setPage("connection")}
        >
          {" "}
          Se connecter
        </span>
      </p>
    </div>
  );
}
