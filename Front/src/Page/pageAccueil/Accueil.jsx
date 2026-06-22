// import { useContext } from "react"
// import { MenuContext } from "../contexte/menuContext"
import BarreNavigation from "./Navigation.jsx";
import HeaderLogo from "./HeaderLogo.jsx";

export default function Accueil() {
  // const {setPage} = useContext(MenuContext)

  return (
    <div className="relative w-2000">
      <BarreNavigation/>
      <div className="fd relative bg-(--bg-main) w-full h-full flex justify-center text-white overflow-x-scroll">
        <div className="mx-4 w-full h-full">
          <HeaderLogo />
        </div>
      </div>
    </div>
  );
}
