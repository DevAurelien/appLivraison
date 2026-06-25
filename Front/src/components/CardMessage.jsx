import { Director } from "./Director";

export default function CardMessage({ className, children, titre, signature }) {
  return (
    <div
      className={`${className} flex card w-full rounded-xl text-white p-2 gap-2`}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/70 p-3">
        <Director className="h-full w-full" />
      </div>
      <div className="flex flex-col w-[6/8] items-start gap-2">
        <h1 className="text-[0.9rem]">{titre}</h1>
        <p className="text-[0.7rem] text-white/80">{children}</p>
        <p className="text-[0.7rem] text-white/50">{signature}</p>
      </div>
    </div>
  );
}
