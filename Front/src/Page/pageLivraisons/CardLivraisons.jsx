import Tournevis from "../../components/Tournevis.jsx";
import Boites from "../../components/Boites.jsx";
import Camion from "../../components/Camion.jsx";
import Interro from "../../components/Interro.jsx";
import Location from "../../components/Location.jsx";
import Road from "../../components/Road.jsx";
import Tel from "../../components/Tel.jsx";
import TimeA from "../../components/TimeA.jsx";
import TimeB from "../../components/TimeB.jsx";
import Shop from "../../components/Shop.jsx";
import CardProduits from "./CardProduits.jsx";

export default function CardLivraisons({
  onClick = () => {},
  numeroDeLivraison = 1,

  client = {
    nom: "Dutard",
    prenom: "Jean-Pierre",
    telephone: "06 12 45 78 90",
  },

  adresse = {
    rue: "16 Rue des Lilas",
    codePostal: "47300",
    ville: "Villeneuve-sur-Lot",
  },

  magasin = {
    nom: "BUT VILLENEUVE",
  },

  estimation = {
    heure: "10:45",
    creneau: "10:00 - 13:00",
    dureeProchaineLivraison: "7 min",
    distanceProchaineLivraison: "4.8 km",
  },

  produits = [
    {
      nom: "Réfrigérateur",
      categorie: "Installation",
      reprise: true,
    },
    {
      nom: "Table basse",
      categorie: "Depose",
      reprise: false,
    },
  ],
}) {
  const correspondance = {
    Installation: <Tournevis />,
    Depose: <Boites />,
    PiedCamion: <Camion />,
    inconnu: <Interro />,
  };

  return (
    <div
      onClick={onClick}
      className="
        cardLiv
        roboto-400
        flex
        w-full
        shrink-0
        justify-evenly
        overflow-hidden
        rounded-xl
        p-2
        text-white
        cursor-pointer
      "
    >
      <div className="flex w-full flex-col gap-1 leading-none pointer-events-none">
        <div className="flex justify-between">
          <div className="flex items-center pb-2">
            <div
              className="
                flex
                h-full
                aspect-square
                items-center
                justify-center
                rounded-md
                border
                border-blue-500
                bg-(--card-bg-soft)
                text-blue-500
              "
            >
              {numeroDeLivraison}
            </div>
          </div>

          <div className="flex flex-col text-[0.8rem] leading-none">
            <p>Arrivée estimée</p>

            <p className="flex justify-end text-xl font-bold text-blue-500">
              {estimation.heure}
            </p>
          </div>
        </div>

        <div className="flex w-full">
          <div className="flex w-6/8 text-[0.8rem] leading-[0.8rem] text-white/70">
            <div className="flex flex-col gap-0.2">
              <p className="text-xl font-bold text-white">
                {client.nom} {client.prenom}
              </p>

              <div className="flex items-center gap-2 text-[0.6rem] text-white/50">
                <Shop />

                <span>{magasin.nom}</span>
              </div>

              <p>{adresse.rue}</p>

              <p>
                {adresse.codePostal} {adresse.ville}
              </p>
            </div>
          </div>

          <div
            className="
              my-1
              flex
              w-2/8
              flex-col
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              bg-(--card-bg-soft)
              p-1
              text-[0.8rem]
              leading-none
            "
          >
            <div className="flex items-center gap-2">
              <TimeA />

              <span>{estimation.dureeProchaineLivraison}</span>
            </div>

            <div className="flex items-center gap-2">
              <Road />

              <span>{estimation.distanceProchaineLivraison}</span>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-start gap-2">
          {produits?.map((item, index) => {
            const icone =
              correspondance[item.categorie] ?? correspondance.inconnu;

            return (
              <CardProduits key={index} className="text-[0.8rem]">
                <div className="flex size-4 items-center">
                  {icone}
                </div>

                <span>{item.nom}</span>

                {item.reprise && (
                  <span
                    className="
                      flex
                      h-full
                      aspect-square
                      items-center
                      rounded-full
                      border
                      border-white
                      px-1
                    "
                  >
                    +R
                  </span>
                )}
              </CardProduits>
            );
          })}
        </div>

        <div className="flex w-full items-center gap-2 text-xs">
          <TimeB />

          <span>{estimation.creneau}</span>
        </div>

        <div className="flex w-full items-start gap-2 text-xs">
          <button
            type="button"
            className="
              button-primary-yellow
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-md
              p-2
            "
          >
            <Location />
            <span>Itinéraire</span>
          </button>

          <button
            type="button"
            className="
              button-primary-yellow
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-md
              p-2
            "
          >
            <Tel />
            <span>Appeler</span>
          </button>
        </div>
      </div>
    </div>
  );
}