import {
  createContext,
  useEffect,
  useState,
} from "react";

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

  const [accessToken, setAccessToken] = useState(() => {
    try {
      const stored =
        localStorage.getItem("accessToken");

      if (!stored) return "";

      const resultat = JSON.parse(stored);

      return resultat.accessToken ?? "";
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

      const utilisateur =
        decoderAccessToken(resultat.accessToken);

      if (!utilisateur) {
        throw new Error(
          "Utilisateur absent du token",
        );
      }

      setAccessToken(resultat.accessToken);
      setUser(utilisateur);

      localStorage.setItem(
        "accessToken",
        resultat.accessToken,
      );
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