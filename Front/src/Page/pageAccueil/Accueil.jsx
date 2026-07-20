import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexte/userContext.jsx";
import { MenuContext } from "../../contexte/menuContext.jsx";
import apiFetch from "../../utils/apiFetch.jsx";
import CardMessage from "../../components/componentsCard/CardMessage.jsx";
import CardLivraisonsDash from "../../components/componentsCard/CardLivraisonsDash.jsx";
import CardPointage from "../../components/componentsCard/CardPointage.jsx";

export default function Accueil() {
  const { user } = useContext(UserContext);
  const { accessToken } = user;
  const { setPage } = useContext(MenuContext);
  const [livraison, setLivraison] = useState([]);
  const adresse = import.meta.env.VITE_BACKEND_URL;

  const handleLivraison = async (accessToken) => {
    apifetch(`${adresse}/deliveries`)
      .then((res) => res.json())
      .then((data) => {
        if (data.deco) setPage("connection");
        setLivraison(data);
      });
  };

  return (
    <div className="relative w-full h-full mb-15 overflow-y-auto overflow-x-hidden">
      <div className="fd relative bg-(--bg-main) w-full h-full flex justify-center text-white">
        <div className="mx-4 w-full h-full gap-4">
          <div className="flex flex-col w-full gap-2 pt-4">
            {user.role != "Client" ? (
              <CardMessage
                className=""
                titre={"Mot du Directeur"}
                signature={"- Jean-Louis"}
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio
                tempore ratione expedita maiores, vero dicta reprehenderit
                inventore sequi animi nisi debitis porro
              </CardMessage>
            ) : (
              <CardMessage
                className=""
                titre={"Mot du Directeur"}
                signature={"- Jean-Louis"}
              >
                Nous informons notre aimable clientèle que votre livraison
                pourrait être retardée en raison des fortes chaleurs
              </CardMessage>
            )}
            {user.role != "Client" ? (
              <>
                <CardLivraisonsDash
                  className=""
                  titre={`Tournée du jour`}
                  depart={
                    livraison[0]
                      ? `${livraison[0].adresse.rue} ${livraison[0].adresse.codePostal} ${livraison[0].adresse.ville}`
                      : ""
                  }
                  arrivee={
                    livraison[1]
                      ? `${livraison[1].adresse.rue} ${livraison[1].adresse.codePostal} ${livraison[1].adresse.ville}`
                      : ""
                  }
                ></CardLivraisonsDash>
                <CardPointage></CardPointage>
              </>
            ) : (
              <p className="flex justify-center items-center card">
                Votre livraison
              </p>
            )}
           
          </div>
        </div>
      </div>
    </div>
  );
}
