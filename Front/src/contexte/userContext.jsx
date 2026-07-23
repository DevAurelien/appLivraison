import {
  createContext,
  useEffect,
  useState,
  useRef
} from "react";
import apiFetch from "../utils/apiFetch";

export const UserContext = createContext({
  user: null,
  setUser: () => {},
  accessToken: "",
  setAccessToken: () => {},
  authLoading: true,
});

const decoderAccessToken = (token) => {
  try {
    const payloadBase64 = token.split(".")[1];

    const payloadDecode = decodeURIComponent(
      atob(
        payloadBase64
          .replace(/-/g, "+")
          .replace(/_/g, "/"),
      )
        .split("")
        .map(
          (caractere) =>
            `%${caractere
              .charCodeAt(0)
              .toString(16)
              .padStart(2, "0")}`,
        )
        .join(""),
    );

    const payload = JSON.parse(payloadDecode);

    return payload.user ?? payload;
  } catch (erreur) {
    console.error(
      "Impossible de décoder l'accessToken :",
      erreur,
    );

    return null;
  }
};

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const avatarLocalUrlRef = useRef(null);

  const [accessToken, setAccessToken] = useState(() => {
    try {
      const stored =
        localStorage.getItem("accessToken");

      if (!stored) return "";

      const resultat = localStorage.getItem("accessToken");

      return resultat ?? "";
    } catch {
      localStorage.removeItem("accessToken");
      return "";
    }
  });

  const [authLoading, setAuthLoading] =
    useState(true);

  useEffect(() => {
  const restaurerSession = async () => {
    try {
      const reponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!reponse.ok) {
        throw new Error("Session expirée");
      }

      const resultat = await reponse.json();

      if (!resultat.accessToken) {
        throw new Error("AccessToken absent");
      }

      const utilisateur = resultat.user ?? resultat;

      localStorage.setItem(
        "accessToken",
        resultat.accessToken,
      );

      setAccessToken(resultat.accessToken);

      setUser({
        ...utilisateur,
        accessToken: resultat.accessToken,
        avatar: null,
        avatarBlobUrl: utilisateur.avatar ?? null,
      });

      try {
        const reponseAvatar = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/users/avatar`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${resultat.accessToken}`,
            },
          },
        );

        if (!reponseAvatar.ok) {
          throw new Error(
            `Avatar indisponible : ${reponseAvatar.status}`,
          );
        }

        const avatarBlob = await reponseAvatar.blob();

        if (avatarLocalUrlRef.current) {
          URL.revokeObjectURL(
            avatarLocalUrlRef.current,
          );
        }

        const avatarLocalUrl =
          URL.createObjectURL(avatarBlob);

        avatarLocalUrlRef.current =
          avatarLocalUrl;

        setUser((utilisateurActuel) => ({
          ...utilisateurActuel,
          avatar: avatarLocalUrl,
        }));
      } catch (erreurAvatar) {
        console.warn(
          "Chargement de l’avatar impossible :",
          erreurAvatar.message,
        );
      }
    } catch (erreur) {
      setUser(null);
      setAccessToken("");
      localStorage.removeItem("accessToken");

      console.log(
        "Aucune session valide :",
        erreur.message,
      );
    } finally {
      setAuthLoading(false);
    }
  };

  restaurerSession();

  return () => {
    if (avatarLocalUrlRef.current) {
      URL.revokeObjectURL(
        avatarLocalUrlRef.current,
      );

      avatarLocalUrlRef.current = null;
    }
  };
}, []);

useEffect(() => {
  const deconnecterUtilisateur = () => {
    setUser(null);
    setAccessToken("");
    localStorage.removeItem("accessToken");
  };

  window.addEventListener(
    "session-expiree",
    deconnecterUtilisateur,
  );

  return () => {
    window.removeEventListener(
      "session-expiree",
      deconnecterUtilisateur,
    );
  };
}, []);


// useEffect(()=>{
//   if (!user?.id) return;
//   const fetchPointage = async (id) => {
//     try {
//       const reponse = await apiFetch(`/pointages/recup/${id}`, "GET");

//       if (!reponse.ok) {
//         throw new Error("Erreur lors de la récupération du pointage");
//       }

//       const resultat = await reponse.json();

//       setUser((prev) =>
//   prev
//     ? { ...prev, heurePointage: resultat?.heurePointage ?? null }
//     : prev
// );
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   fetchPointage(user.id);
// }, [user?.id])

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        setAccessToken,
        authLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};