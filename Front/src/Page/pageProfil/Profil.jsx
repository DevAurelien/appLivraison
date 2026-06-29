import { useContext } from "react";
import { UserContext } from "../../contexte/userContext";
import CardProfil from "../pageProfil/CardProfil.jsx";
import { MenuContext } from "../../contexte/menuContext.jsx";
import Fleche from "../../components/Fleche.jsx"

export default function Profil() {
  const { user, setUser } = useContext(UserContext);
  const { email, creeLe, role } = user || {};
  const {setPage} = useContext(MenuContext)

  const handleDeco = ()=>{
    
    localStorage.removeItem("accessToken");
    setUser({});
    setPage("connection");
  }

  return (
    <div className="relative bg-(--bg-main) h-full w-full flex flex-col items-center gap-4 p-4 border border-white">
      <Fleche className="absolute size-10 top-5 left-5 cursor-pointer" onClick={()=>setPage("Accueil")}/>
      <h1 className="text-2xl select-none">Profil</h1>
      <CardProfil role={role} email={email} creeLe={creeLe} className="select-none"></CardProfil>
        <button onClick={()=>handleDeco()} className="w-1/2 rounded-md p-2 bg-red-800 select-none cursor-pointer">Deconnection</button>
    </div>
  );
}
