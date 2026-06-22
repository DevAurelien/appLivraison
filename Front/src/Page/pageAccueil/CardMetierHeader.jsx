export default function CardMetierHeader({children, bg="none", fond="none", border="border border-green-400", className}) {


  return (
    <div className={`${className} ${bg} ${fond} ${border} rounded-xl card`}><div className="w-full h-full flex justify-center items-center">{children}</div></div>
  )
}
