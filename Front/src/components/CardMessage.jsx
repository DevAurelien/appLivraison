export default function CardMessage({
  className,
  children,
  titre,
  signature,
}) {
  return (
    <div
      className={`${className} flex card w-full rounded-xl text-white p-2 gap-2`}
    >
      <div className="flex flex-col w-[2/8] items-start">pouet</div>
      <div className="flex flex-col w-[6/8] items-start gap-2">
        <h1 className="text-[0.9rem]">{titre}</h1>
        <p className="text-[0.7rem] text-white/80">{children}</p>
        <p className="text-[0.7rem] text-white/50">{signature}</p>
      </div>
    </div>
  );
}
