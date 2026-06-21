// import { useContext } from "react"
// import { MenuContext } from "../contexte/menuContext"
import BarreNavigation from "../Navigation"
import HeaderLogo from "../components/HeaderLogo"

export default function Accueil() {

    // const {setPage} = useContext(MenuContext)

  return (
    <div className="relative bg-(--bg-main) w-full h-full flex justify-center text-white overflow-y-scroll">
        <BarreNavigation/>
        <div className="mx-4 w-full h-full">
            <HeaderLogo/>
        </div>
    </div>
  )
}
