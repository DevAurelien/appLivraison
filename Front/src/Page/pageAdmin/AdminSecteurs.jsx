import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";

import { useEffect, useRef, useState } from "react";

import {
  TerraDraw,
  TerraDrawPolygonMode,
  TerraDrawSelectMode,
} from "terra-draw";

import { TerraDrawGoogleMapsAdapter } from "terra-draw-google-maps-adapter";
import apiFetch from "../../utils/apiFetch";

const key = import.meta.env.VITE_GOOGLE_KEY;

/*
 * ==================================================
 * OUTIL DE CRÉATION DES SECTEURS
 * ==================================================
 */

function OutilSecteurs() {
  const map = useMap();

  const drawRef = useRef(null);

  const [pret, setPret] = useState(false);

  const [secteurAEnvoyer, setSecteurAEnvoyer] = useState({
    nom: "Secteur test",
    agence_id: 2,
    jour_livraison: "MARDI",
    couleur: "#FACC15",
    geometrie: {},
  });

  const [dessinEnCours, setDessinEnCours] = useState(false);

  const [secteurTermine, setSecteurTermine] = useState(null);

  const envoyerSecteur = async () => {
    if (!secteurTermine) {
      console.error("Aucun secteur dessiné");
      return;
    }

    const res = await apiFetch("/administration/secteurs/creation", "POST", {
      body: JSON.stringify(secteurAEnvoyer),
    });

    if (!res.ok) {
      console.error("Erreur création secteur");
      return;
    }

    const data = await res.json();

    console.log("SECTEUR CRÉÉ :", data);
  };

  useEffect(() => {
    if (!map) return;

    const initialiserTerraDraw = () => {
      if (drawRef.current) return;

      const draw = new TerraDraw({
        adapter: new TerraDrawGoogleMapsAdapter({
          map,
          lib: google.maps,
          coordinatePrecision: 9,
        }),

        modes: [
          /*
           * MODE DESSIN
           */
          new TerraDrawPolygonMode({
            pointerDistance: 40,

            editable: true,

            styles: {
              fillColor: "#facc15",
              fillOpacity: 0.25,

              outlineColor: "#facc15",
              outlineOpacity: 1,
              outlineWidth: 3,

              closingPointColor: "#facc15",
              closingPointWidth: 8,

              closingPointOutlineColor: "#ffffff",

              closingPointOutlineWidth: 2,
            },
          }),

          new TerraDrawSelectMode({
            flags: {
              polygon: {
                feature: {
                  draggable: false,

                  coordinates: {
                    draggable: true,
                    deletable: true,

                    midpoints: {
                      draggable: true,
                    },
                  },
                },
              },
            },
          }),
        ],
      });

      drawRef.current = draw;

      draw.start();

      draw.on("ready", () => {
        console.log("Terra Draw prêt");

        setPret(true);
      });

      draw.on("finish", (id) => {
        const feature = draw.getSnapshotFeature(id);

        if (!feature || feature.geometry.type !== "Polygon") {
          return;
        }

        console.log("SECTEUR TERMINÉ :", feature);

        console.log("COORDONNÉES :", feature.geometry.coordinates);

        setSecteurTermine(feature);

        setSecteurAEnvoyer((ancienSecteur) => ({
          ...ancienSecteur,
          geometrie: feature.geometry,
        }));

        setDessinEnCours(false);

        draw.setMode("select");

        draw.selectFeature(id);
      });
    };

    if (map.getProjection()) {
      initialiserTerraDraw();
    } else {
      const listener = google.maps.event.addListenerOnce(
        map,
        "projection_changed",
        initialiserTerraDraw,
      );

      return () => {
        google.maps.event.removeListener(listener);

        if (drawRef.current) {
          drawRef.current.stop();
          drawRef.current = null;
        }
      };
    }

    return () => {
      if (drawRef.current) {
        drawRef.current.stop();
        drawRef.current = null;
      }
    };
  }, [map]);

  /*
   * ==================================================
   * COMMENCER UN NOUVEAU SECTEUR
   * ==================================================
   */

  const dessinerSecteur = () => {
    if (!drawRef.current || !pret) {
      return;
    }

    setSecteurTermine(null);

    setDessinEnCours(true);

    drawRef.current.setMode("polygon");
  };

  return (
    <>
      <button
        type="button"
        onClick={dessinerSecteur}
        disabled={!pret || dessinEnCours}
        className="
          absolute
          top-3
          left-3
          z-20

          rounded-xl
          bg-yellow-300
          px-4
          py-2

          text-sm
          font-semibold
          text-black

          shadow-lg

          disabled:opacity-40
        "
      >
        {dessinEnCours ? "Fermer le secteur" : "Dessiner un secteur"}
      </button>

      {dessinEnCours && (
        <div
          className="
            absolute
            bottom-3
            left-1/2
            z-20

            -translate-x-1/2

            whitespace-nowrap
            rounded-xl
            bg-black/80
            px-3
            py-2

            text-[0.7rem]
            text-white

            backdrop-blur
          "
        >
          Clique sur le point de départ pour fermer la zone
        </div>
      )}

      {secteurTermine && (
        <button
          type="button"
          onClick={envoyerSecteur}
          className="
      absolute
      bottom-3
      right-3
      z-20
      rounded-xl
      bg-yellow-300
      px-4
      py-2
      text-sm
      font-semibold
      text-black
    "
        >
          Enregistrer le secteur
        </button>
      )}
    </>
  );
}

/*
 * ==================================================
 * PAGE ADMIN SECTEURS
 * ==================================================
 */

const handleSubmit = (e) => {
  // e.preventDefault();
  console.log("submit");
};
/*   nom,
    agence_id,
    jour_livraison,
    couleur,
    geometrie */

export default function AdminSecteurs() {
  const [listeAgences, setListeAgences] = useState([]);
  const jourSemaine = ['Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  useEffect(() => {
    const recupererAgences = async () => {
      const res = await apiFetch("/administration/agences/recuperation");

      if (!res.ok) return;

      const data = await res.json();

      setListeAgences(data);
    };

    recupererAgences();
  }, []);
  return (
    <div className="flex flex-col w-full h-full p-2 gap-4">
      <h1 className="button-primary-yellow">Creer un secteur</h1>
      <form
        onSubmit={handleSubmit}
        className="text-[0.8rem] w-full flex flex-col gap-1"
      >
        <div className="flex whitespace-nowrap">
          <label htmlFor="nom" className="px-2 flex items-end">
            Nom du secteur:
          </label>
          <input
            required
            type="text"
            name="nom"
            className="w-full px-2 p-1 outline-none border-b"
          />
        </div>
        <div className="flex whitespace-nowrap items-center gap-2">
          <label htmlFor="agences" className="px-2">
            Agence :
          </label>

          <div className="w-full rounded-lg border border-white/15 bg-white/5 px-2 py-1">
            <select
              name="agences"
              id="agences"
              className="w-full bg-transparent outline-none cursor-pointer"
            >
              {listeAgences.map((agence) => (
                <option
                  key={agence.id}
                  value={agence.id}
                  className="bg-[#081222] text-white cursor-pointer"
                >
                  {agence.nom}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex whitespace-nowrap items-center gap-2">
          <label htmlFor="agences" className="px-2">
            Jour de la Semaine :
          </label>

          <div className="w-full rounded-lg border border-white/15 bg-white/5 px-2 py-1">
            <select
              name="Jour"
              id="jour"
              className="w-full bg-transparent outline-none cursor-pointer"
            >
              {jourSemaine.map((jour, index) => (
                <option
                  key={index}
                  value={jour}
                  className="bg-[#081222] text-white cursor-pointer"
                >
                  {jour}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>
      <div className="p-2 border-2 h-[60vh]">
        <APIProvider apiKey={key}>
          <div
            className="
            relative
            h-full
            w-full
          "
          >
            <Map
              defaultCenter={{
                lat: 44.408,
                lng: 0.705,
              }}
              defaultZoom={10}
              disableDefaultUI
              style={{
                width: "100%",
                height: "100%",

                border: "1px solid white",

                borderRadius: "10px",
              }}
            />

            <OutilSecteurs />
          </div>
        </APIProvider>
      </div>
    </div>
  );
}
