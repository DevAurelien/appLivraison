import Map from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

export default function AdminPlannings() {
  const styleOSM = {
    version: 8,
    sources: {
      osm: {
        type: "raster",
        tiles: [
          "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        ],
        tileSize: 256,
        attribution: "© OpenStreetMap contributors",
      },
    },
    layers: [
  {
    id: "osm",
    type: "raster",
    source: "osm",
    paint: {
      "raster-brightness-max": 0.62,
      "raster-brightness-min": 0.05,
      "raster-contrast": 0.15,
      "raster-saturation": -0.25,
    },
  },
],
  };

  return (
    <div className="border m-2 p-2 h-[50vh]">
      <Map
        initialViewState={{
          longitude: 0.591,
          latitude: 44.651,
          zoom: 11,
        }}
        mapStyle={styleOSM}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}