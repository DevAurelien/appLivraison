import Tournevis from "../../components/Tournevis.jsx";
import Boites from "../../components/Boites.jsx";
import Camion from "../../components/Camion.jsx";
import Interro from "../../components/Interro.jsx";
import Balise from "../../components/Balise.jsx";
import Location from "../../components/Location.jsx";
import Road from "../../components/Road.jsx";
import Tel from "../../components/Tel.jsx";
import TimeA from "../../components/TimeA.jsx";
import TimeB from "../../components/TimeB.jsx";
import Shop from "../../components/Shop.jsx";
import CardProduits from "./CardProduits.jsx";

export default function CardLivraisons({
  onClick=()=>{},
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
    { nom: "Réfrigérateur", categorie: "Installation", reprise: true },
    { nom: "Table basse", categorie: "Depose", reprise: false },
  ],
}) {
  const correspondance = {
    Installation: <Tournevis />,
    Depose: <Boites />,
    PiedCamion: <Camion />,
    inconnu: <Interro />,
  };


  return (
    <div onClick={onClick} className="flex shrink-0 justify-evenly roboto-400 cardLiv w-full p-2 rounded-xl text-white overflow-hidden">
      <div className="flex flex-col w-full gap-1 ">
        <div className="flex justify-between ">
          <div className="flex pb-2 items-center">
            <p className="flex text-blue-500 aspect-square justify-center items-center h-full rounded-md bg-(--card-bg-soft) border border-blue-500">
              {numeroDeLivraison}
            </p>
          </div>
          <div className="flex flex-col text-[0.8rem] leading-none">
            <p>Arrivée estimée</p>
            <p className="flex justify-end text-blue-500 font-bold text-xl">
              {estimation.heure}
            </p>
          </div>
        </div>

        <div className="w-full flex">
          <div className="flex w-6/8 text-[1rem] leading-none text-white/50">
            <div className="flex flex-col gap-0.2">
              <p className="font-bold text-xl text-white">
                {client.nom} {client.prenom}
              </p>
              <p className="flex items-center gap-2 text-[0.6rem]">
                <Shop /> {magasin.nom}
              </p>
              <p>{adresse.rue}</p>
              <p>
                {adresse.codePostal} {adresse.ville}
              </p>
            </div>
          </div>

          <div className="w-2/8 p-1 my-1 flex gap-2 items-center justify-center border rounded-xl flex-col leading-none bg-(--card-bg-soft) text-[0.8rem]">
            <p className="gap-2 flex items-center">
              <TimeA />
              {estimation.dureeProchaineLivraison}
            </p>
            <p className="gap-2 flex items-center">
              <Road />
              {estimation.distanceProchaineLivraison}
            </p>
          </div>
        </div>

        <div className="flex w-full justify-start items-center gap-2">
          {produits?.map((item, index) => {
            return (
              <CardProduits key={index} className={`text-[0.8rem]`}>
                <p className="flex size-4 items-center">
                  {correspondance[item.categorie]}
                </p>
                {item.nom}{" "}
                {item.reprise ? (
                  <p className="border-white border px-1 flex items-center rounded-full h-full aspect-square">
                    +R
                  </p>
                ) : (
                  ""
                )}{" "}
              </CardProduits>
            );
          })}
        </div>
        <div className="flex w-full items-center gap-2 text-xs">
          <TimeB /> {estimation.creneau}
        </div>

        <div className="flex items-start w-full gap-2 text-xs">
          <button className="button-primary p-1 rounded-md w-full flex gap-2 items-center justify-center">
            <Location /> Itineraire
          </button>

          <button className="button-primary p-1 rounded-md w-full flex gap-2 items-center justify-center">
            <Tel /> Appeler
          </button>
        </div>
      </div>
    </div>
  );
}
