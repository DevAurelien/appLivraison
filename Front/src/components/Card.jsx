export default function Card({children, bg="none", fond="none", border="border border-green-400", className}) {


  return (
    <div className={`${className} w-full h-full ${bg} ${fond} ${border} rounded-xl flex justify-center items-center card`}>{children}</div>
  )
}
