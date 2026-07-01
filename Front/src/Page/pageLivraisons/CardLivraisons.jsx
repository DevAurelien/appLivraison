import Tournevis from "../../components/Tournevis.jsx" 
import Boites from "../../components/Boites.jsx"
import Camion from "../../components/Camion.jsx"
import Interro from "../../components/Interro.jsx"

export default function CardLivraisons({
  nom = "Dutard",
  prenom = "Jean-Pierre",
  adresse = "16 Rue des Lilas",
  produits = [
    { produits: "Frigo", categorie: "Installation", reprise: true },
    { produits: "Table", categorie: "Depose" },
  ],
  codePostal = "31270",
  ville = "Didier",
}) {
  
    const correspondance = {
        "Installation": <Tournevis/>,
        "Depose":<Boites/>,
        "PiedCamion":<Camion/>,
        "inconnu":<Interro/>,
    }


  return (
    <div className="flex justify-evenly card w-full p-2 rounded-xl text-[0.8rem] text-white overflow-hidden aspect-16/5">
      <div className="flex flex-col w-full gap-1">
        <div className="flex items-start w-full gap-1">
          <button className="button-primary px-1 rounded-md w-full">
            Itineraire
          </button>

          <button className="button-primary px-1 rounded-md w-full">
            Appeler
          </button>
        </div>

        <div className="w-full flex">
          <div className="flex w-1/2 text-[1rem]">
            <p className="flex flex-col">
              {nom} {prenom}
              <span>{adresse}</span>
              <span>
                {codePostal} {ville}
              </span>
            </p>
          </div>

          <div className="flex flex-col w-1/2 justify-start items-end gap-1">
            {produits?.map((item, index) => {
                return (
                <p key={index} className={`rounded-full px-2 h-5 flex items-center justify-center gap-1`}>
                  {item.produits} {item.reprise ?<span className="bg-yellow-800/30 rounded-full h-full aspect-square">+R</span>: ""} <span className="flex size-4 items-center">{correspondance[item.categorie]}</span>

                  
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


{/* <span
                    className={`${categorieClass} rounded-full px-2 h-5 flex items-center justify-center text-[0.6rem]`}
                  >
                    {item.categorie}
                  </span> */}