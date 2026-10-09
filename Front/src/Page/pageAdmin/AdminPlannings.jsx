import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { useContext, useState, useEffect } from "react";
import { LivraisonsContext } from "../../contexte/livraisonsContext.jsx";
import apiFetch from "../../utils/apiFetch.jsx";
import CardLivraisons from "../pageLivraisons/CardLivraisons.jsx";
import Pulse from "../../components/Loading.jsx";
const key = import.meta.env.VITE_GOOGLE_KEY;
import { useNavigate } from "react-router-dom";


export default function AdminPlannings() {
  const livraisons = useContext(LivraisonsContext);
  const [tabLivraison, setTabLivraison] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    setIsLoading(true);
    console.log(livraisons)

    const requete = async () => {
      try {
        const res = await apiFetch("/livraisonsAll", "GET");
        const data = await res.json();
        setTabLivraison(data);
      } catch (e) {
        console.log(
          `${e}, une erreur s'est produite lors de la recuperation des livraisons `,
        );
      } finally {
        setIsLoading(false);
      }
    };
    requete();
  }, []);

  return (
    <div className="flex h-full w-full overflow-y-auto px-2 mb-25">
      <div className="flex flex-col size-full px-2">
        <div className="flex flex-col h-[10vh] gap-4">
          <p className="flex justify-end w-full">
            <button onClick={() => navigate("/produits")} className="flex justify-center items-center p-1 shrink-0 size-10 text-4xl rounded-md aspect-square bg-(--yellow-zesteo) text-black">
              <span className="leading-none -translate-y-1">+</span>
            </button>
          </p>
          {isLoading ? (
            <Pulse />
          ) : (
            livraisons.livraisons.map((item, index) => {
              return (
                <CardLivraisons
                  key={index}
                  restreintPage
                  client={item.client}
                  magasin={item.magasin}
                  adresse={item.adresse}
                  estimation={item.estimation}
                  produits={item.produits}
                  id={item.id}
                  numeroDeLivraison={item.numeroDeLivraison}
                  statut={item.statut}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// import Map from "react-map-gl/maplibre";
// import "maplibre-gl/dist/maplibre-gl.css";

// export default function AdminPlannings() {
//   const key = import.meta.env.VITE_GOOGLE_KEY;

//   const styleOSM = {
//     version: 8,
//     sources: {
//       osm: {
//         type: "raster",
//         tiles: [
//           "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
//         ],
//         tileSize: 256,
//         attribution: "",
//       },
//     },
//     layers: [
//   {
//     id: "osm",
//     type: "raster",
//     source: "osm",
//     paint: {
//       "raster-brightness-max": 0.62,
//       "raster-brightness-min": 0.05,
//       "raster-contrast": 0.15,
//       "raster-saturation": -0.25,
//     },
//   },
// ],
//   };

//   return (
//     <div className="border m-2 p-2 h-[50vh]">
//       <Map
//         initialViewState={{
//           longitude: 0.591,
//           latitude: 44.651,
//           zoom: 11,
//         }}
//         mapStyle={styleOSM}
//         style={{ width: "100%", height: "100%" }}
//       />
//     </div>
//   );
// }
