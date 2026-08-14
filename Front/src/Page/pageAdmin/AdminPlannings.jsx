import { APIProvider, Map } from "@vis.gl/react-google-maps";
const key = import.meta.env.VITE_GOOGLE_KEY;

export default function AdminPlannings() {
  return (
    <div className="h-[50vh] m-2">
      <APIProvider apiKey={key} className="flex m-2">
        <Map 
          defaultCenter={{
            lat: 44.651,
            lng: 0.591,
          }}
          defaultZoom={11}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </APIProvider>
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