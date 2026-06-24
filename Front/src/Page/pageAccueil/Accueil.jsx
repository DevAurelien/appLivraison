import { useContext } from "react"
// import { MenuContext } from "../contexte/menuContext"
import BarreNavigation from "./Navigation.jsx";
import HeaderLogo from "./HeaderLogo.jsx";
import { UserContext } from "../../contexte/userContext.jsx";


export default function Accueil() {

  const {token} = useContext(UserContext)

  const handleLivraison = async (token)=>{
    fetch("http://localhost:3000/deliveries", {
      headers : {
        Authorization: `Bearer ${token}`
      }
    }).then(res => res.json()).then(data => console.log(data) )
  }

  return (
    <div className="relative w-2000">
      <BarreNavigation/>
      <div className="fd relative bg-(--bg-main) w-full h-full flex justify-center text-white overflow-x-scroll">
        <div className="mx-4 w-full h-full">
          <HeaderLogo />
          <button className="h-[20%] w-[50%]" onClick={()=>handleLivraison(token)}>Recup Livraison</button>
        </div>
      </div>
    </div>
  );
}
