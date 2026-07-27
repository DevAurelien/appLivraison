import React, { useState, useEffect } from "react";
import apiFetch from "../../utils/apiFetch";

export default function AdminAgences() {
  const [form, setForm] = useState({
    nom: "",
    nomComplet: "",
    heureEmbauche: "9",
    minuteEmbauche: "00",
  });
  const [displaySubmit, setDisplaySubmit] = useState({ error: "", nom: "" });
  const [messageVisible, setMessageVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const nom = form.nom.trim();
    const nomComplet = form.nomComplet.trim();

    if (nom === "" || nomComplet === "") {
      setDisplaySubmit({
        nom: "",
        error: "Merci de renseigner le nom court et le nom complet",
      });
      return;
    }

    if (form.heureEmbauche === "" || form.minuteEmbauche === "") {
      setDisplaySubmit({
        nom: "",
        error: "Merci d'indiquer une heure valide",
      });
      return;
    }

    const heures = Number(form.heureEmbauche);
    const minutes = Number(form.minuteEmbauche);

    const heureInvalide =
      !Number.isInteger(heures) ||
      !Number.isInteger(minutes) ||
      heures < 0 ||
      heures > 23 ||
      minutes < 0 ||
      minutes > 59;

    if (heureInvalide) {
      setDisplaySubmit({
        nom: "",
        error: "Merci de rentrer une heure valide",
      });
      return;
    }

    const heureEmbauche =
      `${String(heures).padStart(2, "0")}:` +
      `${String(minutes).padStart(2, "0")}:00`;

    apiFetch("/creation/agences", "POST", {
      body: JSON.stringify({
        nom,
        nomComplet,
        heure_embauche: heureEmbauche,
      }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Erreur pendant la création");
        }

        return data;
      })
      .then(() => {
        setForm({
          nom: "",
          nomComplet: "",
          heureEmbauche: "9",
          minuteEmbauche: "00",
        });

        setDisplaySubmit({
          error: "",
          nom,
        });
      })
      .catch((error) => {
        setDisplaySubmit({
          nom: "",
          error: error.message,
        });
      });
  };
  
  useEffect(() => {
  if (!displaySubmit.nom) return;

  setMessageVisible(true);

  const fadeTimeout = setTimeout(() => {
    setMessageVisible(false);
  }, 3000);

  const clearTimeoutId = setTimeout(() => {
    setDisplaySubmit((prev) => ({
      ...prev,
      nom: "",
    }));
  }, 4200);

  return () => {
    clearTimeout(fadeTimeout);
    clearTimeout(clearTimeoutId);
  };
}, [displaySubmit.nom]);

  return (
    <div className="h-full w-full flex flex-col items-center px-4 gap-2">
      <h1>Creation d'agences</h1>
      <form
        onSubmit={handleSubmit}
        className="card w-full flex flex-col items-center rounded-xl p-4 gap-2 outline-none"
      >
        <div className="flex w-full gap-2">
          <label
            htmlFor="nom"
            className="text-xs flex whitespace-nowrap items-end"
          >
            Nom court :
          </label>
          <input
            name="nom"
            type="text"
            value={form.nom}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, nom: e.target.value }))
            }
            className="w-full px-2 outline-none border-b border-white/30"
          />
        </div>
        <div className="flex w-full gap-2">
          <label
            htmlFor="nom"
            className="text-xs flex whitespace-nowrap items-end"
          >
            Nom complet :
          </label>
          <input
            type="text"
            value={form.nomComplet}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, nomComplet: e.target.value }))
            }
            className="w-full px-2 outline-none border-b border-white/30"
          />
        </div>
        <div className="flex w-full gap-2 items-">
          <label
            htmlFor="nom"
            className="text-xs flex whitespace-nowrap items-end"
          >
            Heure d'embauche :
          </label>
          <input
            required
            type="number"
            value={form.heureEmbauche}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, heureEmbauche: e.target.value }))
            }
            className="w-full px-2 number-no-spinner outline-none border-b border-white/30 text-center"
          />{" "}
          h
          <input
            required
            type="number"
            value={form.minuteEmbauche}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, minuteEmbauche: e.target.value }))
            }
            className="w-full px-2 number-no-spinner outline-none border-b border-white/30 text-center"
          />
        </div>
        <button
          className="mt-2 w-full bg-(--yellow-zesteo) text-black rounded-md cursor-pointer"
          type="submit"
        >
          Valider
        </button>
        {displaySubmit.error && (
          <p className="flex w-full justify-center rounded-xl bg-red-500/40">
            {displaySubmit.error}
          </p>
        )}

        {displaySubmit.nom && <p
  className={`
    flex w-full justify-center rounded-xl
    bg-(--success-bg)/40 text-(--success) text-xs
    transition-opacity duration-2000 ease-in-out
    ${messageVisible ? "opacity-100" : "opacity-0"}
  `}
>
  {displaySubmit.nom} a bien été créée
</p>}
      </form>
    </div>
  );
}
