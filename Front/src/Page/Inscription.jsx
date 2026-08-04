import {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { MenuContext } from "../contexte/menuContext";
import { UserContext } from "../contexte/userContext";

import apiFetch from "../utils/apiFetch";
import { redimensionnerImage } from "../utils/fnImages.jsx";

import Pulse from "../components/Loading.jsx";
import Zesteo_logo from "../components/Zesteo_Logo.jsx";
import OeilOuvert from "../components/componentsIcone/OeilOuvert.jsx";
import OeilBarre from "../components/componentsIcone/OeilBarre.jsx";
import Calendrier from "../components/componentsIcone/Calendrier.jsx";
import UserIcone from "../components/componentsIcone/UserIcone.jsx";
import PlusIcone from "../components/componentsIcone/PlusIcone.jsx";

import Cropper from "react-easy-crop";

export default function Inscription() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { setPage } = useContext(MenuContext);

  const {
    setUser,
    setAccessToken,
  } = useContext(UserContext);

  const birthRef = useRef(null);
  const inputFileRef = useRef(null);

  const [formulaire, setFormulaire] = useState({
    email: "",
    password: "",
    birth: "",
    nom: "",
    prenom: "",
    phone: "",
    reponse: "",
    couleur: "rouge",
    loading: false,
  });

  const [passwordVisible, setPasswordVisible] =
    useState(false);

  const [picture, setPicture] = useState(null);

  const [
    urlPreviewPicture,
    setUrlPreviewPicture,
  ] = useState(undefined);

  const [
    fichierOriginal,
    setFichierOriginal,
  ] = useState(null);

  const [
    urlImageOriginale,
    setUrlImageOriginale,
  ] = useState(null);

  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });

  const [zoom, setZoom] = useState(1);
  const [cropOpen, setCropOpen] = useState(false);

  const [
    zoneCropPixels,
    setZoneCropPixels,
  ] = useState(null);

  useEffect(() => {
    fetch(`${backendUrl}/health`).catch(() => {});
  }, [backendUrl]);

  const handleCrop = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFormulaire((prev) => ({
        ...prev,
        reponse:
          "Le fichier sélectionné n'est pas une image",
        couleur: "rouge",
      }));

      return;
    }

    const tailleMax = 2 * 1024 * 1024;

    if (file.size > tailleMax) {
      setFormulaire((prev) => ({
        ...prev,
        reponse: "L'image dépasse 2 Mo",
        couleur: "rouge",
      }));

      return;
    }

    try {
      if (urlImageOriginale) {
        URL.revokeObjectURL(urlImageOriginale);
      }

      const nouvelleUrl = URL.createObjectURL(file);

      setFichierOriginal(file);
      setUrlImageOriginale(nouvelleUrl);
      setCropOpen(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setZoneCropPixels(null);
    } catch (error) {
      console.error(error);

      setFormulaire((prev) => ({
        ...prev,
        reponse:
          "Impossible de préparer cette image",
        couleur: "rouge",
      }));
    }
  };

  const handleDimensionImage = async () => {
    if (!fichierOriginal || !zoneCropPixels) {
      setFormulaire((prev) => ({
        ...prev,
        reponse:
          "Veuillez sélectionner une zone de l'image",
        couleur: "rouge",
      }));

      return;
    }

    try {
      const imageRedimensionnee =
        await redimensionnerImage(
          fichierOriginal,
          zoneCropPixels,
        );

      if (urlPreviewPicture) {
        URL.revokeObjectURL(urlPreviewPicture);
      }

      const nouvellePreview =
        URL.createObjectURL(imageRedimensionnee);

      setPicture(imageRedimensionnee);
      setUrlPreviewPicture(nouvellePreview);
      setCropOpen(false);

      if (urlImageOriginale) {
        URL.revokeObjectURL(urlImageOriginale);
        setUrlImageOriginale(null);
      }
    } catch (error) {
      console.error(error);

      setFormulaire((prev) => ({
        ...prev,
        reponse:
          "Impossible de redimensionner l'image",
        couleur: "rouge",
      }));
    }
  };

  const annulerInput = () => {
    if (urlImageOriginale) {
      URL.revokeObjectURL(urlImageOriginale);
    }

    setUrlImageOriginale(null);
    setFichierOriginal(null);
    setCropOpen(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setZoneCropPixels(null);

    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const champs = [
      formulaire.nom,
      formulaire.prenom,
      formulaire.email,
      formulaire.password,
      formulaire.phone,
      formulaire.birth,
    ];

    const formulaireValide = champs.every(
      (champ) => champ.trim() !== "",
    );

    if (!formulaireValide || !picture) {
      setFormulaire((prev) => ({
        ...prev,
        reponse:
          "Veuillez remplir tous les champs et ajouter une image",
        couleur: "rouge",
      }));

      return;
    }

    setFormulaire((prev) => ({
      ...prev,
      loading: true,
      reponse: "",
    }));

    try {
      /*
       * 1. Upload de l’avatar
       */
      const formDataImage = new FormData();

      formDataImage.append("avatar", picture);

      const reponseUpload = await fetch(
        `${backendUrl}/api/avatar/upload`,
        {
          method: "POST",
          body: formDataImage,
        },
      );

      const dataUpload =
        await reponseUpload.json();

      if (!reponseUpload.ok || !dataUpload.url) {
        throw new Error(
          dataUpload.message ||
            dataUpload.error ||
            "Échec de l'upload de l'image",
        );
      }

      const avatarUrl = dataUpload.url;

      /*
       * 2. Création du compte
       *
       * Le rôle n’est plus envoyé par le front.
       * Le back attribue automatiquement role_id CLIENT.
       */
      const reponseRegister = await apiFetch(
        "/auth/register",
        "POST",
        {
          body: JSON.stringify({
            email: formulaire.email,
            password: formulaire.password,
            birth: formulaire.birth,
            nom: formulaire.nom,
            prenom: formulaire.prenom,
            phone: formulaire.phone,
            avatar_img_url: avatarUrl,
          }),
        },
      );

      const data =
        await reponseRegister.json();

      if (
        !reponseRegister.ok ||
        !data.accessToken ||
        !data.data
      ) {
        throw new Error(
          data.message || "Inscription échouée",
        );
      }

      /*
       * 3. Enregistrement du token
       */
      localStorage.setItem(
        "accessToken",
        data.accessToken,
      );

      setAccessToken(data.accessToken);

      /*
       * 4. Enregistrement de l’utilisateur complet
       *
       * data.data contient maintenant :
       * id, email, role_id, role,
       * agence_id, agence_nom,
       * agence_nom_complet,
       * nom, prenom, birth, phone,
       * creeLe, avatar et permissions.
       */
      setUser({
        ...data.data,

        accessToken: data.accessToken,

        permissions: Array.isArray(
          data.data.permissions,
        )
          ? data.data.permissions
          : [],

        // URL privée enregistrée en base
        avatarBlobUrl:
          data.data.avatar ?? avatarUrl,

        // Preview locale immédiatement visible
        avatar: urlPreviewPicture ?? null,
      });

      setFormulaire({
        email: "",
        password: "",
        birth: "",
        nom: "",
        prenom: "",
        phone: "",
        reponse:
          data.message || "Inscription réussie",
        couleur: "vert",
        loading: false,
      });

      setPage("Accueil");
    } catch (error) {
      console.error(error);

      setFormulaire((prev) => ({
        ...prev,
        loading: false,
        reponse:
          error.message ||
          "Une erreur s'est produite pendant l'inscription",
        couleur: "rouge",
      }));
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-start gap-2 overflow-y-auto text-white background">
      <div className="flex w-full justify-center">
        <Zesteo_logo
          width={180}
          className="m-10 text-yellow-300"
        />
      </div>

      <div className="mb-10 flex h-fit w-full flex-col items-center justify-start gap-2">
        <h1 className="text-2xl font-bold">
          Créer un compte
        </h1>

        <h6 className="text-[0.8rem]">
          Rejoignez Zesteo et simplifiez vos
          livraisons
        </h6>
      </div>

      <div className="relative flex w-[95vw] items-center justify-center rounded-xl bg-transparent p-4 md:w-[75vw]">
        <form
          className="relative z-5 flex w-full flex-col items-center justify-center gap-7 p-4 py-6"
          onSubmit={handleSubmit}
        >
          {cropOpen && (
            <div className="absolute inset-0 z-40 flex flex-col bg-black p-4">
              <div className="relative z-50 flex w-full justify-center gap-4 pt-4">
                <button
                  type="button"
                  className="button-primary-echec scale-[1.2]"
                  onClick={annulerInput}
                >
                  Annuler
                </button>

                <button
                  type="button"
                  className="button-primary-success scale-[1.2]"
                  onClick={handleDimensionImage}
                >
                  Valider
                </button>
              </div>

              <div className="relative mt-4 flex w-full flex-1">
                <Cropper
                  image={urlImageOriginale}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(
                    _,
                    zonePixels,
                  ) => {
                    setZoneCropPixels(
                      zonePixels,
                    );
                  }}
                />
              </div>
            </div>
          )}

          {!cropOpen && (
            <div
              className={`
                absolute
                top-0
                left-1/2
                z-10
                flex
                size-20
                -translate-x-1/2
                -translate-y-3/4
                cursor-pointer
                items-center
                justify-center
                overflow-hidden
                rounded-full
                border
                ${
                  urlPreviewPicture
                    ? "bg-white"
                    : "bg-white/40"
                }
              `}
            >
              {urlPreviewPicture ===
              undefined ? (
                <>
                  <label
                    htmlFor="file"
                    className="relative flex size-full cursor-pointer items-center justify-center"
                  >
                    <UserIcone
                      color1="black"
                      className="size-10"
                    />

                    <div className="absolute right-4 bottom-4 flex size-2 items-center justify-center rounded-full bg-zinc-800 p-2">
                      <PlusIcone className="absolute size-2" />
                    </div>
                  </label>

                  <input
                    ref={inputFileRef}
                    id="file"
                    name="file"
                    type="file"
                    hidden
                    required
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleCrop}
                  />
                </>
              ) : (
                <img
                  src={urlPreviewPicture}
                  alt="Aperçu de l’avatar"
                  className="size-full rounded-full object-cover"
                />
              )}
            </div>
          )}

          <div className="relative flex w-full">
            <input
              required
              id="Nom"
              name="Nom"
              type="text"
              className="peer w-full border-b border-white p-2 focus:outline-none"
              value={formulaire.nom}
              onChange={(e) => {
                setFormulaire((prev) => ({
                  ...prev,
                  nom: e.target.value,
                }));
              }}
            />

            <label
              htmlFor="Nom"
              className={`
                pointer-events-none
                absolute
                left-0
                cursor-text
                p-2
                transition-all
                duration-300
                peer-focus:-top-7
                peer-focus:opacity-100
                ${
                  formulaire.nom !== ""
                    ? "-top-7 opacity-100"
                    : "top-0 opacity-20"
                }
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
              className="peer w-full border-b border-white p-2 focus:outline-none"
              value={formulaire.prenom}
              onChange={(e) => {
                setFormulaire((prev) => ({
                  ...prev,
                  prenom: e.target.value,
                }));
              }}
            />

            <label
              htmlFor="Prenom"
              className={`
                pointer-events-none
                absolute
                left-0
                cursor-text
                p-2
                transition-all
                duration-300
                peer-focus:-top-7
                peer-focus:opacity-100
                ${
                  formulaire.prenom !== ""
                    ? "-top-7 opacity-100"
                    : "top-0 opacity-20"
                }
              `}
            >
              Prénom
            </label>
          </div>

          <div className="relative flex w-full">
            <input
              required
              id="email"
              name="email"
              type="email"
              className="peer w-full border-b border-white p-2 focus:outline-none"
              value={formulaire.email}
              onChange={(e) => {
                setFormulaire((prev) => ({
                  ...prev,
                  email: e.target.value,
                }));
              }}
            />

            <label
              htmlFor="email"
              className={`
                pointer-events-none
                absolute
                left-0
                cursor-text
                p-2
                transition-all
                duration-300
                peer-focus:-top-7
                peer-focus:opacity-100
                ${
                  formulaire.email !== ""
                    ? "-top-7 opacity-100"
                    : "top-0 opacity-20"
                }
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
              type={
                passwordVisible
                  ? "text"
                  : "password"
              }
              className="peer w-full border-b border-white p-2 pr-12 focus:outline-none"
              value={formulaire.password}
              onChange={(e) => {
                setFormulaire((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));
              }}
            />

            <label
              htmlFor="password"
              className={`
                pointer-events-none
                absolute
                left-0
                p-2
                transition-all
                duration-300
                peer-focus:-top-7
                peer-focus:opacity-100
                ${
                  formulaire.password !== ""
                    ? "-top-7 opacity-100"
                    : "top-0 opacity-20"
                }
              `}
            >
              Mot de passe
            </label>

            <button
              type="button"
              className="absolute top-1/2 right-2 z-10 -translate-y-1/2"
              aria-label={
                passwordVisible
                  ? "Masquer le mot de passe"
                  : "Afficher le mot de passe"
              }
              onClick={() => {
                setPasswordVisible(
                  (ancienneValeur) =>
                    !ancienneValeur,
                );
              }}
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
              className="peer w-full border-b border-white p-2 focus:outline-none"
              value={formulaire.phone}
              onChange={(e) => {
                setFormulaire((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }));
              }}
            />

            <label
              htmlFor="Phone"
              className={`
                pointer-events-none
                absolute
                left-0
                cursor-text
                p-2
                transition-all
                duration-300
                peer-focus:-top-7
                peer-focus:opacity-100
                ${
                  formulaire.phone !== ""
                    ? "-top-7 opacity-100"
                    : "top-0 opacity-20"
                }
              `}
            >
              Téléphone
            </label>
          </div>

          <div className="relative flex w-full">
            <input
              ref={birthRef}
              required
              id="Birth"
              name="Birth"
              type="date"
              className="date-input peer w-full border-b border-white p-2 focus:outline-none"
              value={formulaire.birth}
              onChange={(e) => {
                setFormulaire((prev) => ({
                  ...prev,
                  birth: e.target.value,
                }));
              }}
            />

            <label
              htmlFor="Birth"
              className={`
                pointer-events-none
                absolute
                left-0
                cursor-text
                p-2
                transition-all
                duration-300
                peer-focus:-top-7
                peer-focus:opacity-100
                ${
                  formulaire.birth !== ""
                    ? "-top-7 opacity-100"
                    : "top-0 opacity-20"
                }
              `}
            >
              Date de naissance
            </label>

            <button
              type="button"
              className="absolute top-1/2 right-2 z-10 -translate-y-1/2"
              onClick={() =>
                birthRef.current?.showPicker()
              }
            >
              <Calendrier className="cursor-pointer" />
            </button>
          </div>

          <p
            className={`
              text-center
              text-[0.8rem]
              ${
                formulaire.couleur ===
                "rouge"
                  ? "text-red-600"
                  : "text-green-600"
              }
            `}
          >
            {formulaire.reponse}
          </p>

          <div className="relative w-full rounded-xl bg-yellow-300 p-2">
            <button
              type="submit"
              disabled={formulaire.loading}
              className="
                relative
                z-5
                flex
                w-full
                cursor-pointer
                items-center
                justify-center
                rounded-xl
                text-black
                disabled:cursor-not-allowed
              "
            >
              {formulaire.loading ? (
                <Pulse />
              ) : (
                "S'inscrire"
              )}
            </button>
          </div>
        </form>

        <div className="pointer-events-none absolute top-0 left-0 z-0 h-full w-full rounded-xl border border-white/30 bg-white/8 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl" />
      </div>

      <p className="py-2 text-[1rem]">
        Déjà inscrit ?
        <span
          className="cursor-pointer text-yellow-300"
          onClick={() =>
            setPage("connection")
          }
        >
          {" "}
          Se connecter
        </span>
      </p>
    </div>
  );
}