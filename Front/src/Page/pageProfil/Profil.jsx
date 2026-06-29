import { useContext } from "react";
import { UserContext } from "../../contexte/userContext";
import CardProfil from "../pageProfil/CardProfil.jsx";
import { MenuContext } from "../../contexte/menuContext.jsx";

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
    <div className="bg-(--bg-main) h-full w-full flex flex-col items-center gap-4 p-4 border border-white">
      <h1 className="text-2xl">Profil</h1>
      <CardProfil role={role} email={email} creeLe={creeLe}></CardProfil>
        <button onClick={()=>handleDeco()} className="w-1/2 rounded-md p-2 bg-red-800">Deconnection</button>
    </div>
  );
}
