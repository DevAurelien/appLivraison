import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { useContext } from "react";
import {LivraisonsContext} from "../../contexte/livraisonsContext.jsx"
const key = import.meta.env.VITE_GOOGLE_KEY;

export default function AdminPlannings() {

  const livraisons = useContext(LivraisonsContext)


  return (
    <div className="h-full min-h-0 overflow-y-auto px-2 pb-44">
      <div className="h-[50vh]">
      <APIProvider apiKey={key} >
        <Map 
          defaultCenter={{
            lat: 44.408,
            lng: 0.705,
          }}
          defaultZoom={12}
          disableDefaultUI
          style={{
            width: "100%",
            height: "100%",
            border:"1px solid white",
            padding:"6px",
            borderRadius:"10px",
          }}
        />
      </APIProvider>
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
