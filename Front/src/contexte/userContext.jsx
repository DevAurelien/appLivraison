import { createContext, useEffect, useRef, useState } from "react";

export const UserContext = createContext({
  user: null,
  setUser: () => {},
  accessToken: "",
  setAccessToken: () => {},
  authLoading: true,
});

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const avatarLocalUrlRef = useRef(null);

  const [accessToken, setAccessToken] = useState(() => {
    try {
      return localStorage.getItem("accessToken") ?? "";
    } catch {
      return "";
    }
  });

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

      const resultat = await reponse.json();

      if (!reponse.ok || !resultat.accessToken) {
        throw new Error(
          resultat.message ||
            resultat.error ||
            "Session expirée",
        );
      }

      
      const utilisateur =
        resultat.data ??
        resultat.user ??
        resultat;

      if (!utilisateur?.id) {
        throw new Error(
          "Utilisateur absent de la réponse du refresh",
        );
      }

      localStorage.setItem(
        "accessToken",
        resultat.accessToken,
      );

      setAccessToken(resultat.accessToken);

      setUser({
        ...utilisateur,

        accessToken: resultat.accessToken,

        permissions: Array.isArray(
          utilisateur.permissions,
        )
          ? utilisateur.permissions
          : [],

        avatarBlobUrl:
          utilisateur.avatar ??
          utilisateur.avatar_img_url ??
          null,

        avatar: null,
      });

      const avatarExiste =
        utilisateur.avatar ??
        utilisateur.avatar_img_url;

      if (!avatarExiste) {
        return;
      }

      try {
        const reponseAvatar = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/users/avatar`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
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

        const avatarBlob =
          await reponseAvatar.blob();

        if (avatarLocalUrlRef.current) {
          URL.revokeObjectURL(
            avatarLocalUrlRef.current,
          );
        }

        const avatarLocalUrl =
          URL.createObjectURL(avatarBlob);

        avatarLocalUrlRef.current =
          avatarLocalUrl;

        setUser((utilisateurActuel) => {
          if (!utilisateurActuel) {
            return null;
          }

          return {
            ...utilisateurActuel,
            avatar: avatarLocalUrl,
          };
        });
      } catch (erreurAvatar) {
        console.warn(
          "Chargement de l’avatar impossible :",
          erreurAvatar.message,
        );
      }
    } catch (erreur) {
      console.log(
        "Aucune session valide :",
        erreur.message,
      );

      setUser(null);
      setAccessToken("");
      localStorage.removeItem("accessToken");
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
      if (avatarLocalUrlRef.current) {
        URL.revokeObjectURL(avatarLocalUrlRef.current);

        avatarLocalUrlRef.current = null;
      }

      setUser(null);
      setAccessToken("");

      localStorage.removeItem("accessToken");
    };

    window.addEventListener("session-expiree", deconnecterUtilisateur);

    return () => {
      window.removeEventListener("session-expiree", deconnecterUtilisateur);
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
