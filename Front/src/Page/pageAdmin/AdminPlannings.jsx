import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { useContext, useState } from "react";
import { LivraisonsContext } from "../../contexte/livraisonsContext.jsx";
import apiFetch from "../../utils/apiFetch.jsx";
import { useEffect } from "react";
const key = import.meta.env.VITE_GOOGLE_KEY;

export default function AdminPlannings() {
  const livraisons = useContext(LivraisonsContext);
  const [tabLivraison, setTabLivraison] = useState([]);

  useEffect(() => {
    try {
      const requete = async () => {
        const res = await apiFetch("/livraisonsAll", "GET");
        const data = await res.json();
        setTabLivraison(data);
      };
      requete();
    } catch (e) {
      console.log(
        "une erreur s'est produite lors de la recuperation des livraisons",
      );
    }
  }, []);

  return (
    <div className="flex h-full w-full overflow-y-auto px-2 pb-25">
      <div className="flex flex-col size-full border px-2">
        <div className="flex flex-col border h-[10vh]">
          <p className="flex justify-end w-full">
            <button className="flex justify-center items-center p-1 border shrink-0 size-10 text-4xl rounded-md aspect-square bg-(--yellow-zesteo)/50 text-black">
              +
            </button>
          </p>
          <p>qdzdqzd</p>
          {tabLivraison != [] && console.log(tabLivraison)}
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
