// import { useContext } from "react"
// import { MenuContext } from "../contexte/menuContext"
import BarreNavigation from "../Navigation"

export default function Accueil() {

    // const {setPage} = useContext(MenuContext)

  return (
    <div className="relative bg-black w-full h-full flex justify-center text-white overflow-y-scroll">
        <BarreNavigation/>
    </div>
  )
}
