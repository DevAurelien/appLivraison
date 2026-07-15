import { Director } from "../componentsIcone/Director";

export default function CardMessage({ className, children, titre, signature }) {
  return (
    <div
      className={`${className} flex card w-full rounded-xl text-white p-2 gap-2 -mt-2 select-none`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-800/30 border border-white/70 p-1">
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
