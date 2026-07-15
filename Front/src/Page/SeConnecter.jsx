import { useContext, useState, useEffect } from "react";
import { MenuContext } from "../contexte/menuContext";
import apiFetch from "../utils/apiFetch";
import { UserContext } from "../contexte/userContext";
import Zesteo_logo from "../components/Zesteo_Logo";
import OeilOuvert from "../components/componentsIcone/OeilOuvert.jsx";
import OeilBarre from "../components/componentsIcone/OeilBarre.jsx";
import Pulse from "../components/Loading.jsx";

export default function SeConnecter() {

  useEffect(() => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  fetch(`${backendUrl}/health`).catch(() => {
  });
}, []);

  const [formulaire, setFormulaire] = useState({
    email: "",
    password: "",
    reponse: null,
    loading: false,
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { setPage } = useContext(MenuContext);
  const { setUser } = useContext(UserContext);

const handleSubmit = async (e) => {
  e.preventDefault();

  setFormulaire((prev) => ({
    ...prev,
    loading: true,
  }));

  try {
    const res = await apiFetch("/auth/login", "POST", {
      body: JSON.stringify({
        email: formulaire.email,
        password: formulaire.password,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.accessToken) {
      setFormulaire((prev) => ({
        ...prev,
        reponse: data.message || "Identifiants incorrects",
        couleur: "rouge",
        loading: false,
      }));
      return;
    }

    localStorage.setItem("accessToken", data.accessToken);

    const dateLisible = new Date(
      data.data.created_at,
    ).toLocaleDateString("fr-FR");

    setUser((prev) => ({
      ...prev,
      email: data.data.email,
      accessToken: data.accessToken,
      role: data.data.role,
      creeLe: dateLisible,
      avatar: null,
      avatarBlobUrl: data.data.avatar,
    }));

    setFormulaire((prev) => ({
      ...prev,
      email: "",
      password: "",
      loading: false,
      reponse: data.message,
      couleur: "vert",
    }));

    // Affichage immédiat de l'accueil
    setPage("Accueil");

    // L’avatar se charge ensuite silencieusement
    apiFetch("/users/avatar")
      .then((resAvatar) => {
        if (!resAvatar.ok) {
          throw new Error("Avatar indisponible");
        }

        return resAvatar.blob();
      })
      .then((avatarBlob) => {
        const avatarLocalUrl = URL.createObjectURL(avatarBlob);

        setUser((prev) => ({
          ...prev,
          avatar: avatarLocalUrl,
        }));
      })
      .catch((error) => {
        console.warn("Chargement différé de l’avatar :", error.message);
      });
  } catch (error) {
    console.error(error);

    setFormulaire((prev) => ({
      ...prev,
      reponse: "Connexion échouée",
      couleur: "rouge",
      loading: false,
    }));
  }
};

  return (
    <div className="flex flex-col background w-full h-full text-white justify-start items-center overflow-y-auto gap-2">
      <div className="w-full z-5 flex justify-center">
        <Zesteo_logo width={180} className="text-yellow-300 m-10" />
      </div>
      <div className="w-full flex flex-col justify-center items-center h-fit gap-2">
        <h1 className="text-2xl font-bold">Se connecter</h1>
        <h6 className="text-[0.8rem] ">
          Acceder a vos livraisons en toute simplicité
        </h6>
      </div>
      <div className="p-4 relative flex w-[95vw] md:w-[75vw] justify-center items-center bg-transparent rounded-xl">
        <form
          className="relative z-5 py-6 p-4 w-full flex flex-col gap-8 justify-center items-center"
          onSubmit={handleSubmit}
        >
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
              {passwordVisible ? <OeilBarre /> : <OeilOuvert />}
            </button>
          </div>
          <div className="relative w-full rounded-xl bg-yellow-300 p-2">
            <button
              type="submit"
              disabled={formulaire.loading}
              className="relative z-5 flex cursor-pointer justify-center items-center w-full rounded-xl text-black disabled:cursor-not-allowed"
            >
              {formulaire.loading ? <Pulse className={"p-2"}/> : "Se connecter"}
            </button>
          </div>
        </form>
        <div className="pointer-events-none z-0 absolute top-0 left-0 p-10 h-full w-full border backdrop-blur-xl bg-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_20px_60px_rgba(0,0,0,0.35)] border-white/30 rounded-xl"></div>
      </div>
      <p className="text-[1rem] py-2 pointer-events-none">
        Pas encore inscrit ?
        <span
          className="cursor-pointer pointer-events-auto text-yellow-300"
          onClick={() => setPage("inscription")}
        >
          {" "}
          Creer un compte
        </span>
      </p>
    </div>
  );
}

// return (
//     <div className="flex bg-black w-full h-full text-white justify-center items-center">
//       <div className="p-4 flex w-4/5 md:w-2/3 justify-center items-center border border-white rounded-xl">
//         <form
//           className="p-4 w-full flex flex-col gap-4 justify-center items-center"
//           onSubmit={handleSubmit}
//         >
//           <h1 className="text-2xl md:text-4xl cursor-default">Se connecter</h1>
//           <p
//             onClick={() => setPage("inscription")}
//             className="cursor-pointer text-red-200"
//           >
//             Pas encore inscrit ?
//           </p>
//           <input
//             type="email"
//             placeholder="Email"
//             className="outline outline-white w-full p-4 rounded-xl placeholder:text-white/40"
//             value={formulaire.email}
//             onChange={(e) =>
//               setFormulaire((ancienneVal) => ({
//                 ...ancienneVal,
//                 email: e.target.value,
//               }))
//             }
//           />
//           <input
//             type="password"
//             placeholder="Mot de passe"
//             className="outline outline-white w-full rounded-xl placeholder:text-white/40 p-4"
//             value={formulaire.password}
//             onChange={(e) =>
//               setFormulaire((ancienneVal) => ({
//                 ...ancienneVal,
//                 password: e.target.value,
//               }))
//             }
//           />
//           <p
//             className={`${formulaire.couleur === "rouge" ? "text-red-600" : "text-green-600"}  md:text-xl`}
//           >
//             {formulaire.reponse}
//           </p>
//           <button
//             // onClick={()=>setPage("Accueil")}
//             type="submit"
//             className="flex cursor-pointer justify-center items-center outline outline-white w-1/3 rounded-xl text-white p-4"
//           >
//             Valider
//           </button>
//         </form>
//       </div>
//     </div>
//   );
//
// }
