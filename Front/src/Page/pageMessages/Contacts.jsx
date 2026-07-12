import UserIcone from "../../components/UserIcone.jsx"
import PlusIcone from "../../components/PlusIcone.jsx"
import { useContext, useEffect, useState } from "react"
import { MenuContext } from "../../contexte/menuContext"
import apifetch from "../../utils/apiFetch.jsx"

export default function Contacts() {

  const [inputSearch, setInputSearch] = useState("");
  const [content, setContent]= useState(null);
  const [salaries, setSalaries] = useState([])

  useEffect(()=>{
    if(inputSearch.trim().length < 2){setSalaries([]); return;}

    const delaiFrappe = setTimeout(async() => {
      try{
      const resultat = await apifetch(`/salariesSearch?saisie=${inputSearch}`,"GET");
      const data = await resultat.json();  
      setSalaries(data.salaries);
        console.log(data)
    }catch (error) {
        console.error("Erreur pendant la recherche :", error);
    }
    }, 400);

    return ()=> clearTimeout(delaiFrappe)
    
  },[inputSearch])

    const {setPage} = useContext(MenuContext) 
// <PlusIcone width={30} height={30} className=""/>
  return (
    <div className={`bg-(--main) w-full h-full px-4 flex flex-col text-white ${salaries.length > 0 ? "justify-start" :"justify-between"} mb-25 md:pb-50 gap-2`}>
        <input onChange={(e)=>setInputSearch(e.target.value)} value={inputSearch} placeholder="Rechercher..." className="placeholder:text-white/20 flex border w-full min-h-10 bg-zinc-900 rounded-full text-right p-2 cursor-text outline-none focus:outline-none"/>
        {/* <button onClick={()=>{setPage("Messagerie")}}> clic</button> */}
        <ul className="flex flex-col gap-4">
        {salaries.map((salarie, index)=>{
          return <li key={index}>{salarie.nom} {salarie.prenom}</li>
        })}</ul>
        {salaries.length === 0 && <div className="flex justify-end">Pour commencer,<br/> ajoutez un contact...</div>}
    </div>
  )
}
