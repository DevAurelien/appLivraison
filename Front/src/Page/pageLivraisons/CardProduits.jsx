
export default function CardProduits({children, className}) {
  return (
    <div className={`${className} gap-1 h-full flex p-1 justify-center items-center rounded-md cardLiv`}>{children}</div>
  )
}
