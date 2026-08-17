export default function CardLivReduit({
  onClick = () => {},
  numeroDeLivraison = 1,
  client = {},
  adresse = {},
  estimation = {},
  produits = [],
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full shrink-0 items-stretch overflow-hidden rounded-2xl border border-white/8 bg-[#0d1c32] text-left text-white shadow-[0_8px_24px_rgba(0,0,0,0.16)] transition duration-200 hover:border-blue-400/40 active:scale-[0.99]"
    >
      <span className="w-1 shrink-0 bg-blue-500" />
      <span className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/12 text-blue-300">
          <strong className="text-base">{numeroDeLivraison}</strong>
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-start justify-between gap-2">
            <strong className="truncate text-sm font-extrabold">
              {client.nom} {client.prenom}
            </strong>
            <time className="shrink-0 text-sm font-black text-blue-300">
              {estimation.heure || "—"}
            </time>
          </span>
          <span className="mt-1 block truncate text-xs text-slate-400">
            {adresse.rue}
          </span>
          <span className="mt-1 flex items-center justify-between gap-2 text-[0.65rem] text-slate-500">
            <span className="truncate">{adresse.codePostal} {adresse.ville}</span>
            <span className="shrink-0">{produits.length} article{produits.length !== 1 ? "s" : ""}</span>
          </span>
        </span>

        <svg className="h-4 w-4 shrink-0 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
    </button>
  );
}
