/* global google */
import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState, useContext } from "react";
import { AgencesContext } from "../../contexte/agencesContext.jsx";
import { SecteursContext } from "../../contexte/secteursContext.jsx";
import { UserContext } from "../../contexte/userContext.jsx";
import {
  TerraDraw,
  TerraDrawPolygonMode,
  TerraDrawSelectMode,
} from "terra-draw";
import { TerraDrawGoogleMapsAdapter } from "terra-draw-google-maps-adapter";
import apiFetch from "../../utils/apiFetch";
import Pulse from "../../components/Loading.jsx";

const key = import.meta.env.VITE_GOOGLE_KEY;

function OutilSecteurs({
  setSecteurs,
  listeSecteurs,
  peutDessiner,
  peutModifier,
  secteurEnModificationId,
}) {
  const map = useMap();
  const drawRef = useRef(null);
  const secteursChargesRef = useRef([]);
  const secteurVersFeatureRef = useRef(new globalThis.Map());
  const secteurEnModificationIdRef = useRef(secteurEnModificationId);

  const [pret, setPret] = useState(false);
  const [dessinEnCours, setDessinEnCours] = useState(false);

  useEffect(() => {
    if (!map) return;
    const secteurVersFeature = secteurVersFeatureRef.current;

    const initialiserTerraDraw = () => {
      if (drawRef.current) return;

      setPret(false);

      const draw = new TerraDraw({
        adapter: new TerraDrawGoogleMapsAdapter({
          map,
          lib: google.maps,
          coordinatePrecision: 9,
        }),
        modes: [
          new TerraDrawPolygonMode({
            pointerDistance: 10,
            editable: true,
            styles: {
              fillColor: (feature) =>
                feature.properties?.couleur || "#facc15",
              fillOpacity: 0.25,
              outlineColor: (feature) =>
                feature.properties?.couleur || "#facc15",
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
                  draggable: peutModifier,
                  coordinates: {
                    draggable: peutModifier,
                    deletable: peutModifier,
                    midpoints: {
                      draggable: peutModifier,
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
        setPret(true);
      });

      draw.on("finish", (id) => {
        const feature = draw.getSnapshotFeature(id);

        if (!feature || feature.geometry.type !== "Polygon") {
          return;
        }

        setSecteurs((prev) => ({
          ...prev,
          geometrie: feature.geometry,
        }));

        setDessinEnCours(false);
        draw.setMode("select");
        draw.selectFeature(id);
      });

      draw.on("change", (ids, type) => {
        if (type !== "update" || !secteurEnModificationIdRef.current) return;

        const featureModifiee = ids
          .map((id) => draw.getSnapshotFeature(id))
          .find(
            (feature) =>
              Number(feature?.properties?.secteur_id) ===
              Number(secteurEnModificationIdRef.current),
          );

        if (featureModifiee?.geometry.type === "Polygon") {
          setSecteurs((prev) => ({
            ...prev,
            geometrie: featureModifiee.geometry,
          }));
        }
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
          secteursChargesRef.current = [];
          secteurVersFeature.clear();
        }
      };
    }

    return () => {
      if (drawRef.current) {
        drawRef.current.stop();
        drawRef.current = null;
        secteursChargesRef.current = [];
        secteurVersFeature.clear();
      }
    };
  }, [map, peutModifier, setSecteurs]);

  useEffect(() => {
    secteurEnModificationIdRef.current = secteurEnModificationId;
  }, [secteurEnModificationId]);

  useEffect(() => {
    const draw = drawRef.current;

    if (!draw || !pret) return;

    if (secteursChargesRef.current.length) {
      const idsPresents = secteursChargesRef.current.filter((id) =>
        draw.hasFeature(id),
      );

      if (idsPresents.length) {
        draw.removeFeatures(idsPresents);
      }

      secteursChargesRef.current = [];
      secteurVersFeatureRef.current.clear();
    }

    const features = listeSecteurs
      .filter(
        (secteur) =>
          secteur.geometrie?.type === "Polygon" &&
          secteur.geometrie.coordinates?.length,
      )
      .map((secteur) => {
        const id = draw.getFeatureId();
        secteurVersFeatureRef.current.set(Number(secteur.id), id);

        return {
          id,
          type: "Feature",
          geometry: secteur.geometrie,
          properties: {
            mode: "polygon",
            secteur_id: secteur.id,
            nom: secteur.nom,
            couleur: secteur.couleur,
            jour_livraison: secteur.jour_livraison,
            agence_id: secteur.agence_id,
          },
        };
      });

    if (features.length) {
      const validations = draw.addFeatures(features);
      const invalides = validations.filter((validation) => !validation.valid);

      secteursChargesRef.current = features
        .map((feature) => feature.id)
        .filter((id) => draw.hasFeature(id));

      if (invalides.length) {
        console.error("Secteurs GeoJSON invalides :", invalides);
      }
    }

    if (secteurEnModificationId) {
      const featureId = secteurVersFeatureRef.current.get(
        Number(secteurEnModificationId),
      );

      if (featureId && draw.hasFeature(featureId)) {
        draw.setMode("select");
        draw.selectFeature(featureId);
      }
    }
  }, [listeSecteurs, pret, secteurEnModificationId]);

  const dessinerSecteur = () => {
    if (!drawRef.current || !pret) {
      return;
    }

    setDessinEnCours(true);
    drawRef.current.setMode("polygon");
  };

  return (
    <>
      {peutDessiner && (
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
      )}

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

    </>
  );
}

export default function AdminSecteurs() {
  const [agenceId, setAgenceId] = useState("");
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [secteurEnModificationId, setSecteurEnModificationId] = useState(null);
  const [secteurs, setSecteurs] = useState({
    nom: "",
    agence_id: "",
    jour_livraison: "",
    couleur: "#FACC15",
    geometrie: null,
  });

  const jourSemaine = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  const { listeAgences } = useContext(AgencesContext);
  const { user } = useContext(UserContext);
  const peutCreer = user?.permissions?.includes("SECTEURS_CREER") ?? false;
  const peutModifier = user?.permissions?.includes("SECTEURS_MODIFIER") ?? false;
  const peutSupprimer = user?.permissions?.includes("SECTEURS_SUPPRIMER") ?? false;
  const {
    listeSecteurs,
    chargementSecteurs,
    recupererSecteurs,
    modifierSecteur,
    supprimerSecteur,
    viderSecteurs,
  } = useContext(SecteursContext);

  useEffect(() => {
    if (agenceId) {
      recupererSecteurs(agenceId);
    } else {
      viderSecteurs();
    }
  }, [agenceId, recupererSecteurs, viderSecteurs]);

  const fermerFormulaire = () => {
    setFormulaireOuvert(false);
    setSecteurEnModificationId(null);
    setSecteurs({
      nom: "",
      agence_id: Number(agenceId) || "",
      jour_livraison: "",
      couleur: "#FACC15",
      geometrie: null,
    });
  };

  const ouvrirCreation = () => {
    setSecteurEnModificationId(null);
    setSecteurs({
      nom: "",
      agence_id: Number(agenceId),
      jour_livraison: "",
      couleur: "#FACC15",
      geometrie: null,
    });
    setFormulaireOuvert(true);
  };

  const ouvrirModification = (secteur) => {
    setSecteurEnModificationId(secteur.id);
    setSecteurs({
      nom: secteur.nom,
      agence_id: secteur.agence_id,
      jour_livraison: secteur.jour_livraison,
      couleur: secteur.couleur,
      geometrie: secteur.geometrie,
    });
    setFormulaireOuvert(true);
  };

  const confirmerSuppression = async (secteur) => {
    const confirmation = window.confirm(
      `Supprimer définitivement le secteur « ${secteur.nom} » ?`,
    );

    if (!confirmation) return;

    try {
      await supprimerSecteur(secteur.id);

      if (secteurEnModificationId === secteur.id) {
        fermerFormulaire();
      }
    } catch (e) {
      console.error("ERREUR SUPPRESSION SECTEUR :", e);
    }
  };

  const envoyerSecteur = async () => {
    if (!secteurs.nom.trim()) {
      console.error("Le nom du secteur est obligatoire");
      return;
    }

    if (!secteurs.agence_id) {
      console.error("Une agence doit être sélectionnée");
      return;
    }

    if (!secteurs.jour_livraison) {
      console.error("Un jour de livraison doit être sélectionné");
      return;
    }

    if (!secteurs.couleur) {
      console.error("Une couleur doit être sélectionnée");
      return;
    }

    if (
      !secteurs.geometrie ||
      secteurs.geometrie.type !== "Polygon" ||
      !secteurs.geometrie.coordinates?.length
    ) {
      console.error("Un secteur doit être dessiné sur la carte");
      return;
    }

    const donneesAEnvoyer = {
      ...secteurs,
      nom: secteurs.nom.trim(),
    };

    try {
      console.log("SECTEURS À ENVOYER :", donneesAEnvoyer);

      const res = await apiFetch("/administration/secteurs/creation", "POST", {
        body: JSON.stringify(donneesAEnvoyer),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("ERREUR CRÉATION SECTEUR :", data);
        return;
      }

      console.log("SECTEUR CRÉÉ :", data);
      await recupererSecteurs(agenceId);
      fermerFormulaire();
    } catch (e) {
      console.error("ERREUR FETCH SECTEUR :", e);
    }
  };

  const enregistrerSecteur = async () => {
    if (!secteurs.nom.trim() || !secteurs.jour_livraison) {
      console.error("Le nom et le jour de livraison sont obligatoires");
      return;
    }

    if (!secteurs.geometrie?.coordinates?.length) {
      console.error("La géométrie du secteur est obligatoire");
      return;
    }

    if (secteurEnModificationId) {
      try {
        await modifierSecteur(secteurEnModificationId, {
          ...secteurs,
          nom: secteurs.nom.trim(),
          agence_id: Number(agenceId),
        });
        fermerFormulaire();
      } catch (e) {
        console.error("ERREUR MODIFICATION SECTEUR :", e);
      }
      return;
    }

    await envoyerSecteur();
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-4 overflow-y-auto overscroll-contain px-2 pb-30">
      <h1 className="flex justify-center text-xl">Mes secteurs</h1>

      <div className="flex flex-col gap-2 rounded-xl border border-white/15 bg-white/5 p-3">
        <label htmlFor="agence-secteurs" className="text-sm font-semibold">
          Agence consultée
        </label>
        <select
          id="agence-secteurs"
          value={agenceId}
          onChange={(e) => {
            setAgenceId(e.target.value ? Number(e.target.value) : "");
            setFormulaireOuvert(false);
            setSecteurEnModificationId(null);
          }}
          className="w-full rounded-lg border border-white/15 bg-[#081222] px-3 py-2 outline-none"
        >
          <option value="">Choisir une agence</option>
          {listeAgences.map((agence) => (
            <option key={agence.id} value={agence.id}>
              {agence.nom}
            </option>
          ))}
        </select>
      </div>

      {agenceId && peutCreer && !formulaireOuvert && (
        <button
          type="button"
          onClick={ouvrirCreation}
          className="self-start rounded-lg bg-yellow-300 px-4 py-2 text-sm font-semibold text-black"
        >
          Nouveau secteur
        </button>
      )}

      {formulaireOuvert && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            enregistrerSecteur();
          }}
          className="flex w-full flex-col gap-3 rounded-xl border border-white/15 bg-white/5 p-3 text-sm"
        >
          <h2 className="font-semibold">
            {secteurEnModificationId
              ? "Modifier le secteur"
              : "Créer un secteur"}
          </h2>
          <p className="text-xs text-white/60">
            {secteurEnModificationId
              ? "Tu peux aussi sélectionner le polygone sur la carte et déplacer ses points."
              : "Renseigne les informations puis dessine le nouveau secteur sur la carte."}
          </p>

          <div className="flex items-center gap-2">
            <label htmlFor="nom" className="w-1/2">
            Nom du secteur :
            </label>
            <input
              required
              type="text"
              id="nom"
              value={secteurs.nom}
              className="w-1/2 border-b bg-transparent px-2 py-1 outline-none"
              onChange={(e) =>
                setSecteurs((prev) => ({
                  ...prev,
                  nom: e.target.value,
                }))
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="jour" className="w-1/2">
              Jour de livraison :
            </label>
            <select
              id="jour"
              value={secteurs.jour_livraison}
              onChange={(e) =>
                setSecteurs((prev) => ({
                  ...prev,
                  jour_livraison: e.target.value,
                }))
              }
              className="w-1/2 rounded-lg border border-white/15 bg-[#081222] px-2 py-1 outline-none"
            >
              <option value="">Choisir un jour</option>
              {jourSemaine.map((jour) => (
                <option key={jour} value={jour.toUpperCase()}>
                  {jour}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="couleur" className="w-1/2">
              Couleur :
            </label>
            <div className="flex w-1/2 items-center gap-2">
            <input
              type="color"
              id="couleur"
              value={secteurs.couleur}
              onChange={(e) =>
                setSecteurs((prev) => ({
                  ...prev,
                  couleur: e.target.value,
                }))
              }
              className="h-8 w-10 cursor-pointer bg-transparent"
            />
            <span>{secteurs.couleur}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={fermerFormulaire}
              className="rounded-lg border border-white/20 px-4 py-2"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="rounded-lg bg-yellow-300 px-4 py-2 font-semibold text-black"
            >
              {secteurEnModificationId ? "Enregistrer" : "Créer"}
            </button>
          </div>
        </form>
      )}

      {agenceId && (
        <section className="flex flex-col gap-2">
          <h2 className="font-semibold">Secteurs de l’agence</h2>
          {chargementSecteurs ? (
            <div className="flex min-h-24 flex-col items-center justify-center gap-3">
              <Pulse />
              <p className="text-xs text-white/60">Chargement des secteurs…</p>
            </div>
          ) : listeSecteurs.length === 0 ? (
            <p className="text-sm text-white/60">Aucun secteur enregistré.</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {listeSecteurs.map((secteur) => (
                <article
                  key={secteur.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/5 p-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 shrink-0 rounded-full"
                        style={{ backgroundColor: secteur.couleur }}
                      />
                      <strong className="truncate">{secteur.nom}</strong>
                    </div>
                    <p className="text-xs text-white/60">
                      Livraison : {secteur.jour_livraison}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {peutModifier && (
                      <button
                        type="button"
                        onClick={() => ouvrirModification(secteur)}
                        className="rounded-lg border border-yellow-300/50 px-3 py-1 text-xs text-yellow-200"
                      >
                        Modifier
                      </button>
                    )}
                    {peutSupprimer && (
                      <button
                        type="button"
                        onClick={() => confirmerSuppression(secteur)}
                        className="rounded-lg border border-red-400/50 px-3 py-1 text-xs text-red-300"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      <div className="h-[70vh] min-h-[520px] shrink-0 border-2 p-2">
        <APIProvider apiKey={key}>
          <div className="relative h-full w-full">
            {chargementSecteurs && (
              <div className="absolute inset-0 z-30 flex items-center justify-center rounded-[10px] bg-black/35 backdrop-blur-[1px]">
                <Pulse />
              </div>
            )}
            <Map
              defaultCenter={{
                lat: 44.408,
                lng: 0.705,
              }}
              defaultZoom={9}
              disableDefaultUI
              style={{
                width: "100%",
                height: "100%",
                border: "1px solid white",
                borderRadius: "10px",
              }}
            />

            <OutilSecteurs
              setSecteurs={setSecteurs}
              listeSecteurs={listeSecteurs}
              peutDessiner={
                formulaireOuvert &&
                (secteurEnModificationId ? peutModifier : peutCreer)
              }
              peutModifier={peutModifier}
              secteurEnModificationId={secteurEnModificationId}
            />
          </div>
        </APIProvider>
      </div>
    </div>
  );
}
