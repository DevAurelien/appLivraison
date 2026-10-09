import { useContext, useEffect, useMemo, useState } from "react";
import { AgencesContext } from "../../contexte/agencesContext";
import apiFetch from "../../utils/apiFetch.jsx";

const euro = (valeur) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(valeur);

const normaliser = (texte = "") =>
  texte
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const trouverReference = (liste, categorieId, varianteId, prestationId) => {
  const references = (liste ?? []).filter(
    (ligne) =>
      String(ligne.categorie_id) === String(categorieId) &&
      String(ligne.prestation_id) === String(prestationId),
  );

  if (varianteId) {
    const specifique = references.find(
      (ligne) => String(ligne.variante_id) === String(varianteId),
    );
    if (specifique) return specifique;
  }

  return references.find((ligne) => ligne.variante_id == null);
};

const IconeUnivers = ({ nom, className = "h-7 w-7" }) => {
  const key = normaliser(nom);

  if (key.includes("literie")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 11v7" />
        <path d="M21 11v7" />
        <path d="M3 14h18" />
        <rect x="5" y="7" width="14" height="7" rx="2" />
        <path d="M7 7V5.8A1.8 1.8 0 0 1 8.8 4h6.4A1.8 1.8 0 0 1 17 5.8V7" />
      </svg>
    );
  }

  if (key.includes("mobilier")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 13a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v4H4z" />
        <path d="M6 10V8a2 2 0 0 1 2-2h2v4" />
        <path d="M14 6h2a2 2 0 0 1 2 2v2" />
        <path d="M6 17v2" />
        <path d="M18 17v2" />
      </svg>
    );
  }

  if (key.includes("electro")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="7" y="3" width="10" height="18" rx="2" />
        <path d="M12 3v18" />
        <path d="M14.5 7h.01" />
      </svg>
    );
  }

  if (key.includes("multimedia")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="6" width="16" height="12" rx="2" />
        <path d="M10 3l2 3 2-3" />
      </svg>
    );
  }

  if (key.includes("decoration") || key.includes("deco")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 21h6" />
        <path d="M10 21v-4h4v4" />
        <path d="M8 13h8" />
        <path d="M9 13 11 4h2l2 9" />
        <path d="M7 13h10" />
      </svg>
    );
  }

  if (key.includes("toutes")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="8" cy="8" r="2.2" />
        <circle cx="16" cy="8" r="2.2" />
        <circle cx="8" cy="16" r="2.2" />
        <circle cx="16" cy="16" r="2.2" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2 20 6.5v11L12 22 4 17.5v-11L12 2Z" />
      <path d="M12 22v-9" />
      <path d="m4 6.5 8 4 8-4" />
    </svg>
  );
};

export default function Produits({ onContinue, onBack }) {
  const { listeAgences } = useContext(AgencesContext);

  const [agenceId, setAgenceId] = useState("");
  const [pieceActive, setPieceActive] = useState("TOUTES");

  const [catalogue, setCatalogue] = useState(null);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");

  const [modeVue, setModeVue] = useState("famille");
  const [recherche, setRecherche] = useState("");
  const [familleActive, setFamilleActive] = useState("TOUTES");

  const [categorieId, setCategorieId] = useState("");
  const [varianteId, setVarianteId] = useState("");
  const [prestationId, setPrestationId] = useState("");
  const [quantite, setQuantite] = useState(1);
  const [optionsIds, setOptionsIds] = useState([]);
  const [lignes, setLignes] = useState([]);

  useEffect(() => {
    let actif = true;

    const chargerCatalogue = async () => {
      if (!agenceId) {
        setCatalogue(null);
        setChargement(false);
        return;
      }

      setChargement(true);
      setErreur("");
      setCatalogue(null);

      try {
        const res = await apiFetch(
          `/catalogue?agenceId=${encodeURIComponent(String(agenceId))}`,
          "GET",
        );

        const datas = await res.json();

        if (!res.ok) {
          throw new Error(
            datas?.message ||
              datas?.error ||
              "Impossible de récupérer le catalogue",
          );
        }

        const champs = [
          "categories",
          "variantes",
          "prestations",
          "liensPrestations",
          "options",
          "liensOptions",
          "temps",
          "tarifs",
        ];

        if (!champs.every((champ) => Array.isArray(datas?.[champ]))) {
          throw new Error("Structure du catalogue invalide.");
        }

        if (actif) setCatalogue(datas);
      } catch (error) {
        if (actif) setErreur(error.message || "Catalogue indisponible.");
      } finally {
        if (actif) setChargement(false);
      }
    };

    chargerCatalogue();

    return () => {
      actif = false;
    };
  }, [agenceId]);

  const changerAgence = (id) => {
    setAgenceId(id);

    setCatalogue(null);
    setErreur("");
    setRecherche("");
    setFamilleActive("TOUTES");
    setCategorieId("");
    setVarianteId("");
    setPrestationId("");
    setQuantite(1);
    setOptionsIds([]);
    setLignes([]);
    setPieceActive("TOUTES");
  };

  const changerModeVue = (mode) => {
    setModeVue(mode);
    setCategorieId("");
    setVarianteId("");
    setPrestationId("");
    setOptionsIds([]);
    setQuantite(1);
  };

  const agenceSelectionnee = (listeAgences ?? []).find(
    (agence) => String(agence.id) === agenceId,
  );

  const categoriesRecherchees = useMemo(() => {
    return (catalogue?.categories ?? []).filter((c) =>
      `${c.famille} ${c.nom}`
        .toLocaleLowerCase("fr")
        .includes(recherche.toLocaleLowerCase("fr")),
    );
  }, [catalogue, recherche]);

  const familles = useMemo(() => {
    const uniques = [
      ...new Set(categoriesRecherchees.map((c) => c.famille).filter(Boolean)),
    ];
    return ["TOUTES", ...uniques];
  }, [categoriesRecherchees]);

  const categoriesAffichees = useMemo(() => {
    if (familleActive === "TOUTES") return categoriesRecherchees;
    return categoriesRecherchees.filter(
      (c) => String(c.famille) === String(familleActive),
    );
  }, [categoriesRecherchees, familleActive]);

  const pieces = useMemo(() => {
    const uniques = [
      ...new Set(
        (catalogue?.categories ?? []).flatMap(
          (categorie) => categorie.pieces ?? [],
        ),
      ),
    ];

    return ["TOUTES", ...uniques.sort()];
  }, [catalogue]);

  const categoriesParPiece = useMemo(() => {
    if (pieceActive === "TOUTES") {
      return categoriesRecherchees;
    }

    return categoriesRecherchees.filter((categorie) =>
      (categorie.pieces ?? []).includes(pieceActive),
    );
  }, [categoriesRecherchees, pieceActive]);

  const categoriesVisibles =
    modeVue === "famille" ? categoriesAffichees : categoriesParPiece;

  const categorie = catalogue?.categories.find(
    (c) => String(c.id) === categorieId,
  );

  const variantes = (catalogue?.variantes ?? []).filter(
    (v) => String(v.categorie_id) === categorieId,
  );

  const variante = variantes.find((v) => String(v.id) === varianteId);

  const prestations = (catalogue?.prestations ?? []).filter((p) =>
    (catalogue?.liensPrestations ?? []).some(
      (l) =>
        String(l.categorie_id) === categorieId &&
        String(l.prestation_id) === String(p.id),
    ),
  );

  const prestation = prestations.find((p) => String(p.id) === prestationId);

  const options = (catalogue?.options ?? []).filter((o) =>
    (catalogue?.liensOptions ?? []).some(
      (l) =>
        String(l.categorie_id) === categorieId &&
        String(l.option_id) === String(o.id),
    ),
  );

  const optionsChoisies = options.filter((o) =>
    optionsIds.includes(String(o.id)),
  );

  const tarif = trouverReference(
    catalogue?.tarifs,
    categorieId,
    varianteId,
    prestationId,
  );

  const temps = trouverReference(
    catalogue?.temps,
    categorieId,
    varianteId,
    prestationId,
  );

  const supplementPrix = optionsChoisies.reduce(
    (total, o) => total + Number(o.supplement_tarifaire ?? 0),
    0,
  );

  const supplementMinutes = optionsChoisies.reduce(
    (total, o) => total + Number(o.minutes_supplementaires ?? 0),
    0,
  );

  const prixUnitaire =
    tarif?.prix == null ? null : Number(tarif.prix) + supplementPrix;

  const tempsUnitaire =
    temps?.minutes == null ? null : Number(temps.minutes) + supplementMinutes;

  const pret = Boolean(
    categorie &&
    prestation &&
    (!variantes.length || variante) &&
    Number.isInteger(quantite) &&
    quantite > 0,
  );

  const selectionnerFamille = (famille) => {
    setFamilleActive(famille);
    setCategorieId("");
    setVarianteId("");
    setPrestationId("");
    setOptionsIds([]);
    setQuantite(1);
  };

  const selectionnerCategorie = (id) => {
    setCategorieId(id);
    setVarianteId("");
    setOptionsIds([]);
    setQuantite(1);

    const prestationDefaut = (catalogue?.liensPrestations ?? []).find(
      (l) => String(l.categorie_id) === String(id) && l.par_defaut,
    );

    setPrestationId(
      prestationDefaut ? String(prestationDefaut.prestation_id) : "",
    );
  };

  const ajouterProduit = () => {
    if (!pret || !agenceId) return;

    const ligne = {
      key: crypto.randomUUID(),
      categorie_id: categorie.id,
      variante_id: variante?.id ?? null,
      prestation_id: prestation.id,
      quantite,
      designation: [categorie.nom, variante?.nom].filter(Boolean).join(" — "),
      prestation_nom: prestation.nom,
      tarif_applique: prixUnitaire,
      temps_prevu_minutes:
        tempsUnitaire == null ? null : tempsUnitaire * quantite,
      options: optionsChoisies.map((o) => ({
        option_id: o.id,
        nom: o.nom,
        minutes_supplementaires_appliquees: o.minutes_supplementaires,
        supplement_tarifaire_applique: o.supplement_tarifaire,
      })),
    };

    setLignes((precedentes) => [...precedentes, ligne]);
    setOptionsIds([]);
    setQuantite(1);
  };

  const supprimerProduit = (key) => {
    setLignes((actuelles) => actuelles.filter((ligne) => ligne.key !== key));
  };

  const montantTotal = lignes.reduce(
    (total, l) => total + (l.tarif_applique ?? 0) * l.quantite,
    0,
  );

  const prixIncomplets = lignes.some((l) => l.tarif_applique == null);

  const tempsTotal = lignes.every((l) => l.temps_prevu_minutes != null)
    ? lignes.reduce((total, l) => total + l.temps_prevu_minutes, 0)
    : null;

  const continuer = () => {
    if (!lignes.length || typeof onContinue !== "function") return;

    const produits = lignes.map(
      ({ key, prestation_nom, options, ...produit }) => ({
        ...produit,
        options: options.map(({ nom, ...option }) => option),
      }),
    );

    onContinue(produits);
  };

  return (
    <main className="flex h-full min-h-0 flex-col bg-[#061326] text-white">
      <section className="min-h-0 flex-1 overflow-y-auto px-4 py-5 pb-36">
        <div className="mx-auto max-w-4xl space-y-5">
          {/* ENTÊTE PAGE */}
          <section className="rounded-[28px] border border-[#14345a] bg-[#041a38] p-4 sm:p-5">
            <div className="space-y-4">
              <div>
                {onBack && (
                  <button
                    type="button"
                    onClick={onBack}
                    className="mb-3 text-sm font-semibold text-slate-300"
                  >
                    ← Retour
                  </button>
                )}

                <h1 className="text-2xl font-black text-white">
                  Catalogue produits
                </h1>

                <p className="mt-2 text-sm text-slate-400 sm:text-base">
                  {modeVue === "famille"
                    ? "Choisissez une famille pour commencer"
                    : "Choisissez une pièce pour commencer"}
                </p>
              </div>

              <div>
                <label
                  htmlFor="agence-produits"
                  className="mb-2 block text-sm font-bold text-white"
                >
                  Agence
                </label>

                <select
                  id="agence-produits"
                  name="agence_id"
                  value={agenceId}
                  onChange={(e) => changerAgence(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-[#315071] bg-[#142b49] px-4 text-sm text-white outline-none transition focus:border-yellow-300"
                >
                  <option value="">Choisir une agence</option>

                  {(listeAgences ?? []).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nom_complet}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* SWITCH ET FAMILLES */}
            <div className="mt-5 rounded-[24px] border border-[#315071] bg-[#112744] p-3">
              <div className="grid grid-cols-2 gap-2 rounded-[20px] bg-black/20 p-1.5">
                <button
                  type="button"
                  onClick={() => changerModeVue("famille")}
                  className={`rounded-2xl px-4 py-3 text-base font-extrabold transition sm:text-lg ${
                    modeVue === "famille"
                      ? "bg-white/10 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Par famille
                </button>

                <button
                  type="button"
                  onClick={() => changerModeVue("piece")}
                  className={`rounded-2xl px-4 py-3 text-base font-extrabold transition sm:text-lg ${
                    modeVue === "piece"
                      ? "bg-white/10 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Par pièce
                </button>
              </div>

              <div className="mt-4">
                {modeVue === "famille" ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {familles.map((famille) => {
                      const active = familleActive === famille;

                      return (
                        <button
                          key={famille}
                          type="button"
                          onClick={() => selectionnerFamille(famille)}
                          className={`rounded-2xl border px-3 py-4 text-center transition ${
                            active
                              ? "border-yellow-300 bg-yellow-300/10 text-yellow-300"
                              : "border-[#244263] bg-[#0e223d] text-slate-100 hover:border-[#3b628f]"
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <IconeUnivers
                              nom={famille === "TOUTES" ? "Toutes" : famille}
                              className="h-7 w-7"
                            />
                            <span className="text-sm font-extrabold sm:text-base">
                              {famille === "TOUTES" ? "Toutes" : famille}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-[#244263] bg-[#0e223d] px-4 py-6 text-center">
                    <p className="text-base pb-6 font-extrabold text-white">
                      Navigation par pièce
                    </p>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {pieces.map((piece) => {
                        const active = pieceActive === piece;

                        const icones = {
                          TOUTES: "◈",
                          SALON: "▣",
                          CHAMBRE: "▤",
                          CUISINE: "♨",
                          SALLE_A_MANGER: "♧",
                          SALLE_DE_BAIN: "◉",
                          BUREAU: "▥",
                          BUANDERIE: "▦",
                          ENTREE: "⌂",
                          AUTRES: "◇",
                        };

                        return (
                          <button
                            key={piece}
                            type="button"
                            onClick={() => {
                              setPieceActive(piece);
                              setCategorieId("");
                              setVarianteId("");
                              setPrestationId("");
                              setOptionsIds([]);
                              setQuantite(1);
                            }}
                            aria-pressed={active}
                            className={`min-w-0 rounded-2xl border px-3 py-4 text-center transition ${
                              active
                                ? "border-yellow-300 bg-yellow-300/10 text-yellow-300"
                                : "border-[#244263] bg-[#0e223d] text-slate-100 hover:border-[#3b628f]"
                            }`}
                          >
                            <span className="flex flex-col items-center gap-2">
                              <span aria-hidden="true" className="text-2xl">
                                {icones[piece] ?? "◇"}
                              </span>

                              <span className="w-full break-words text-sm font-extrabold sm:text-base">
                                {piece === "TOUTES"
                                  ? "Toutes"
                                  : piece.replaceAll("_", " ")}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RECHERCHE */}
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#10284c] px-4 py-4">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6 text-slate-400"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>

              <input
                type="search"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Rechercher un article..."
                aria-label="Rechercher un article"
                className="w-full bg-transparent text-base text-white outline-none placeholder:text-slate-400 sm:text-lg"
              />
            </div>
          </section>

          {!agenceId && (
            <div className="rounded-2xl border border-slate-800 bg-[#102139] p-6 text-center">
              <p className="text-base font-bold">Sélectionnez une agence</p>
              <p className="mt-2 text-sm text-slate-400">
                Utilisez le bouton en haut à droite pour charger le catalogue.
              </p>
            </div>
          )}

          {erreur && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              {erreur}
            </div>
          )}

          {chargement && (
            <div className="rounded-2xl bg-[#102139] p-6 text-center text-sm text-slate-400">
              Chargement du catalogue…
            </div>
          )}

          {!chargement && agenceId && catalogue && (
            <>
              <section className="rounded-[28px] border border-[#2d425e] bg-[#102139] p-4 sm:p-5">
                <div className="mb-4">
                  <h2 className="text-xl font-black sm:text-2xl">
                    {modeVue === "famille"
                      ? familleActive === "TOUTES"
                        ? "Toutes les catégories"
                        : familleActive
                      : pieceActive === "TOUTES"
                        ? "Toutes les pièces"
                        : pieceActive.replaceAll("_", " ")}
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Choisissez ensuite une catégorie.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {categoriesVisibles.map((c) => {
                    const active = String(c.id) === categorieId;

                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => selectionnerCategorie(String(c.id))}
                        aria-pressed={active}
                        className={`rounded-2xl border p-4 text-left transition ${
                          active
                            ? "border-yellow-300 bg-yellow-300/10"
                            : "border-[#31507b] bg-[#10284c] hover:border-slate-400"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p
                              className={`text-base font-black sm:text-lg ${
                                active ? "text-yellow-300" : "text-white"
                              }`}
                            >
                              {c.nom}
                            </p>
                            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                              {c.famille}
                            </p>
                          </div>

                          <div
                            className={`shrink-0 ${
                              active ? "text-yellow-300" : "text-slate-300"
                            }`}
                          >
                            <IconeUnivers
                              nom={c.famille || c.nom}
                              className="h-7 w-7"
                            />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {categoriesVisibles.length === 0 && (
                  <div className="mt-3 rounded-2xl bg-[#10284c] p-5 text-center text-sm text-slate-400">
                    Aucun article ne correspond à la recherche.
                  </div>
                )}
              </section>

              {categorie && (
                <section className="space-y-5 rounded-[28px] border border-[#14345a] bg-[#041a38] p-4 sm:p-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-300">
                      Configuration
                    </p>
                    <h2 className="mt-2 text-xl font-black sm:text-2xl">
                      {categorie.nom}
                    </h2>
                  </div>

                  {variantes.length > 0 && (
                    <div>
                      <label
                        htmlFor="produit-variante"
                        className="mb-2 block text-sm font-semibold"
                      >
                        Variante
                      </label>
                      <select
                        id="produit-variante"
                        value={varianteId}
                        onChange={(e) => setVarianteId(e.target.value)}
                        className="h-12 w-full rounded-2xl border border-[#31507b] bg-[#10284c] px-4 text-sm outline-none focus:border-yellow-300"
                      >
                        <option value="">Choisir une variante</option>
                        {variantes.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="produit-prestation"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Prestation
                    </label>
                    <select
                      id="produit-prestation"
                      value={prestationId}
                      onChange={(e) => setPrestationId(e.target.value)}
                      className="h-12 w-full rounded-2xl border border-[#31507b] bg-[#10284c] px-4 text-sm outline-none focus:border-yellow-300"
                    >
                      <option value="">Choisir une prestation</option>
                      {prestations.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nom}
                        </option>
                      ))}
                    </select>

                    {prestations.length === 0 && (
                      <p className="mt-2 text-xs text-amber-300">
                        Aucune prestation associée à cette catégorie.
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-semibold">Quantité</p>
                    <div className="flex w-fit items-center overflow-hidden rounded-2xl border border-[#31507b] bg-[#10284c]">
                      <button
                        type="button"
                        onClick={() => setQuantite((n) => Math.max(1, n - 1))}
                        className="h-12 w-12 text-xl font-bold hover:bg-slate-800"
                      >
                        −
                      </button>
                      <output className="w-12 text-center text-sm font-extrabold">
                        {quantite}
                      </output>
                      <button
                        type="button"
                        onClick={() => setQuantite((n) => Math.min(999, n + 1))}
                        className="h-12 w-12 text-xl font-bold hover:bg-slate-800"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {options.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-sm font-extrabold">
                        Options disponibles
                      </h3>

                      <div className="space-y-2">
                        {options.map((o) => (
                          <label
                            key={o.id}
                            className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#31507b] bg-[#10284c] p-4"
                          >
                            <input
                              type="checkbox"
                              checked={optionsIds.includes(String(o.id))}
                              onChange={(e) =>
                                setOptionsIds((ids) =>
                                  e.target.checked
                                    ? [...ids, String(o.id)]
                                    : ids.filter((id) => id !== String(o.id)),
                                )
                              }
                              className="h-4 w-4 accent-yellow-300"
                            />

                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold">{o.nom}</p>
                              <p className="mt-1 text-xs text-slate-400">
                                {o.type_option === "INTERVENTION"
                                  ? "Intervention"
                                  : "Produit"}
                                {Number(o.minutes_supplementaires) > 0
                                  ? ` · +${o.minutes_supplementaires} min`
                                  : ""}
                              </p>
                            </div>

                            <span className="shrink-0 text-xs font-bold text-yellow-300">
                              {o.supplement_tarifaire == null
                                ? "—"
                                : `+${euro(Number(o.supplement_tarifaire))}`}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-[#10284c] p-4">
                      <p className="text-xs text-slate-400">Prix indicatif</p>
                      <p className="mt-2 text-lg font-black text-yellow-300">
                        {pret && prixUnitaire != null
                          ? euro(prixUnitaire * quantite)
                          : "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#10284c] p-4">
                      <p className="text-xs text-slate-400">Temps prévu</p>
                      <p className="mt-2 text-lg font-black">
                        {pret && tempsUnitaire != null
                          ? `${tempsUnitaire * quantite} min`
                          : "—"}
                      </p>
                    </div>
                  </div>

                  {pret && tarif?.prix == null && (
                    <p className="text-xs text-amber-300">
                      Aucun tarif actif pour cette combinaison.
                    </p>
                  )}

                  {pret && temps?.minutes == null && (
                    <p className="text-xs text-slate-400">
                      Aucun temps de référence disponible.
                    </p>
                  )}

                  <button
                    type="button"
                    disabled={!pret}
                    onClick={ajouterProduit}
                    className="h-12 w-full rounded-2xl bg-yellow-300 font-extrabold text-[#061326] transition hover:bg-yellow-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    + Ajouter le produit
                  </button>
                </section>
              )}

              <section className="rounded-[28px] border border-[#14345a] bg-[#041a38] p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-extrabold sm:text-xl">
                    Produits ajoutés
                  </h2>
                  <span className="rounded-full bg-[#10284c] px-3 py-1 text-xs font-bold">
                    {lignes.length}
                  </span>
                </div>

                {lignes.length === 0 ? (
                  <div className="rounded-2xl bg-[#10284c] p-6 text-center">
                    <p className="text-sm font-semibold">
                      Aucun produit ajouté
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Sélectionnez une catégorie pour commencer.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lignes.map((l) => (
                      <article
                        key={l.key}
                        className="rounded-2xl border border-[#31507b] bg-[#10284c] p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-bold">
                              {l.quantite} × {l.designation}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {l.prestation_nom}
                            </p>
                            {l.options.length > 0 && (
                              <p className="mt-1 text-xs text-slate-500">
                                {l.options.map((o) => o.nom).join(", ")}
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => supprimerProduit(l.key)}
                            className="shrink-0 rounded-lg px-2 py-1 text-sm font-bold text-red-300 hover:bg-red-400/10"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="mt-3 flex justify-between border-t border-slate-800 pt-3 text-xs">
                          <span className="font-bold text-yellow-300">
                            {l.tarif_applique == null
                              ? "Tarif indisponible"
                              : euro(l.tarif_applique * l.quantite)}
                          </span>

                          <span className="text-slate-400">
                            {l.temps_prevu_minutes == null
                              ? "Temps inconnu"
                              : `${l.temps_prevu_minutes} min`}
                          </span>
                        </div>
                      </article>
                    ))}

                    <div className="space-y-3 border-t border-slate-700 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">
                          Total{prixIncomplets ? " partiel" : ""}
                        </span>
                        <span className="text-xl font-black text-yellow-300">
                          {euro(montantTotal)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">
                          Temps cumulé
                        </span>
                        <span className="text-sm font-bold">
                          {tempsTotal == null
                            ? "Incomplet"
                            : `${tempsTotal} min`}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  disabled={
                    lignes.length === 0 || typeof onContinue !== "function"
                  }
                  onClick={continuer}
                  className="mt-5 h-12 w-full rounded-2xl bg-yellow-300 font-extrabold text-[#061326] transition hover:bg-yellow-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continuer vers la livraison →
                </button>
              </section>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
