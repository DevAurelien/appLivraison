import { useContext, useRef, useState } from "react";
import { MenuContext } from "../contexte/menuContext";
import apiFetch from "../utils/apiFetch";
import { UserContext } from "../contexte/userContext";
import Pulse from "../components/Loading.jsx";
import Zesteo_logo from "../components/Zesteo_Logo.jsx";
import OeilOuvert from "../components/OeilOuvert.jsx";
import OeilBarre from "../components/OeilBarre.jsx";
import Calendrier from "../components/Calendrier.jsx";
import UserIcone from "../components/UserIcone.jsx";
import PlusIcone from "../components/PlusIcone.jsx";
import { redimensionnerImage } from "../utils/fnImages.jsx";

export default function Inscription() {
  const backend_URL = import.meta.env.VITE_BACKEND_URL;
  const [formulaire, setFormulaire] = useState({
    email: "",
    password: "",
    birth: "",
    nom: "",
    prenom: "",
    phone: "",
    image: "",
    role: "Client",
    reponse: "",
    couleur: "rouge",
    loading: false,
  });
  const birthRef = useRef(null);
  const inputFileRef = useRef(null);
  const { setPage } = useContext(MenuContext);
  const { setUser } = useContext(UserContext);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [picture, setPicture] = useState(null);
  const [urlPreviewPicture, setUrlPreviewPicture] = useState(undefined);
  const champs = [
    formulaire.nom,
    formulaire.prenom,
    formulaire.email,
    formulaire.password,
    formulaire.phone,
    formulaire.birth,
  ];

  const handleDimensionImage = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormulaire((prev) => ({
        ...prev,
        reponse: "Le fichier sélectionné n'est pas une image",
      }));
      return;
    }

    const tailleMax = 2 * 1024 * 1024;

    if (file.size > tailleMax) {
      setFormulaire((prev) => ({
        ...prev,
        reponse: "L'image dépasse 2 Mo",
      }));
      return;
    }

    try {
      const imageRedimensionnee = await redimensionnerImage(file);

      // console.log("Fichier final :", imageRedimensionnee);
      setPicture(imageRedimensionnee);
      setUrlPreviewPicture(URL.createObjectURL(imageRedimensionnee));
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formulaireValide = champs.every((champ) => champ.trim() !== "");
    if (!formulaireValide || !picture) {
      setFormulaire((prev) => ({
        ...prev,
        reponse: "Veuillez remplir tous les champs",
      }));
      return;
    }

    setFormulaire((prev) => ({
      ...prev,
      loading: true,
      reponse: "",
    }));

    try {
      const formDataImage = new FormData();
      formDataImage.append("avatar", picture);

      const reponseUpload = await fetch(
        `${backend_URL}/api/avatar/upload`,
        {
          method: "POST",
          body: formDataImage,
        },
      );

      const dataUpload = await reponseUpload.json();

      if (!reponseUpload.ok || !dataUpload.url) {
        throw new Error(
          dataUpload.message || dataUpload.error || "Échec de l'upload de l'image",
        );
      }

      const avatarUrl = dataUpload.url;

      setFormulaire((prev) => ({
        ...prev,
        image: avatarUrl,
      }));

      apiFetch(`/auth/register`, "POST", {
        body: JSON.stringify({
          email: formulaire.email,
          password: formulaire.password,
          role: formulaire.role,
          birth: formulaire.birth,
          nom: formulaire.nom,
          prenom: formulaire.prenom,
          phone: formulaire.phone,
          avatar_img_url: avatarUrl,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.accessToken) {
            const dateLisible = new Date(
              data.data.created_at,
            ).toLocaleDateString("fr-FR");

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
              avatar: urlPreviewPicture,
              avatarBlobUrl: avatarUrl,
            }));

            setFormulaire((prev) => ({
              ...prev,
              email: "",
              password: "",
              birth: "",
              nom: "",
              prenom: "",
              phone: "",
              image: "",
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
        .catch((error) => {
          setFormulaire((prev) => ({
            ...prev,
            loading: false,
            reponse:
              error.message ||
              "Une erreur s'est produite pendant l'inscription",
            couleur: "rouge",
          }));
        });
    } catch (error) {
      console.error(error.message);
      setFormulaire((prev) => ({
        ...prev,
        loading: false,
        reponse: error.message || "Échec de l'upload de l'image",
        couleur: "rouge",
      }));
    }
  };

  return (
    <div className="flex flex-col background w-full h-full text-white justify-start items-center overflow-y-auto gap-2">
      <div className="w-full flex justify-center -mb-10">
        <Zesteo_logo
          width={180}
          // height={130}
          className="text-yellow-300 m-10"
        />
      </div>
      <div className="w-full flex flex-col justify-start items-center h-fit gap-2 mb-10">
        <h1 className="text-2xl font-bold">Creer un compte</h1>
        <h6 className="text-[0.8rem] ">
          Rejoignez Zesteo et simplifiez vos livraisons
        </h6>
      </div>
      <div className="p-4 relative flex w-[95vw] md:w-[75vw] justify-center items-center bg-transparent rounded-xl">
        <form
          className="relative z-5 py-6 p-4 w-full flex flex-col gap-7 justify-center items-center"
          onSubmit={handleSubmit}
        >
          {" "}
          {/* div de l'image de profil todo fetch vercel blob */}
          <div
            className={`z-10 absolute size-20 cursor-pointer overflow-hidden top-0 -translate-y-3/4 left-1/2 -translate-x-1/2 border rounded-full ${urlPreviewPicture ? "bg-white" : "bg-white/40"} flex items-center justify-center`}
          >
            {urlPreviewPicture === undefined ? (
              <>
                <label
                  htmlFor="file"
                  className="relative size-full flex justify-center items-center cursor-pointer"
                >
                  <UserIcone color1="black" className="size-10" />
                  <div className="absolute flex justify-center size-2 items-center rounded-full bg-zinc-800 p-2 right-4 bottom-4">
                    <PlusIcone className="absolute size-2" />
                  </div>
                </label>
                <input
                  onChange={handleDimensionImage}
                  id="file"
                  hidden
                  name="file"
                  ref={inputFileRef}
                  className="absolute"
                  type="file"
                  accept="image/jpg, image/png, image/webp"
                  required
                />
              </>
            ) : (
              <img
                className=" size-full object-cover rounded-full"
                src={urlPreviewPicture}
                alt="profil"
              />
            )}
          </div>
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
            {/*  */}
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
              type={passwordVisible ? "text" : "password"}
              className="peer w-full border-b border-white p-2 pr-12 focus:outline-none"
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
              className={`pointer-events-none absolute left-0 p-2
      transition-all duration-300
      peer-focus:-top-7 peer-focus:opacity-100
      ${formulaire.password !== "" ? "-top-7 opacity-100" : "top-0 opacity-20"}
    `}
            >
              Mot de passe
            </label>

            <button
              type="button"
              onClick={() => setPasswordVisible((ancienneVal) => !ancienneVal)}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2"
              aria-label={
                passwordVisible
                  ? "Masquer le mot de passe"
                  : "Afficher le mot de passe"
              }
            >
              {passwordVisible ? (
                <OeilBarre className="cursor-pointer" />
              ) : (
                <OeilOuvert className="cursor-pointer" />
              )}
            </button>
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
              ref={birthRef}
              required
              id="Birth"
              name="Birth"
              type="date"
              className="date-input peer border-white border-b w-full p-2 focus:outline-none"
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
            <button
              onClick={() => birthRef.current?.showPicker()}
              type="button"
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 "
            >
              <Calendrier className="cursor-pointer" />
            </button>
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
          </div>{" "}
        </form>
        <div className="pointer-events-none z-0 absolute top-0 left-0 p-4 h-full w-full border backdrop-blur-xl bg-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_20px_60px_rgba(0,0,0,0.35)] border-white/30 rounded-xl"></div>
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
