import UserIcone from "../../components/UserIcone.jsx"
import PlusIcone from "../../components/PlusIcone.jsx"
import { useContext, useEffect, useState } from "react"
import { MenuContext } from "../../contexte/menuContext"
import apifetch from "../../utils/apiFetch.jsx"

export default function Contacts() {

  const [inputSearch, setInputSearch] = useState("");
  const [content, setContent]= useState(null);

  useEffect(()=>{
    try{
      apifetch("/salaries").then(res=>res.json()).then(data =>setContent())
    }catch{

    }
  },[])

    const {setPage} = useContext(MenuContext) 
// <PlusIcone width={30} height={30} className=""/>
  return (
    <div className='bg-(--main) w-full h-full px-4 flex flex-col text-white justify-between pb-25'>
        <input  placeholder="Rechercher..." className="placeholder:text-white/20 flex border w-full min-h-10 bg-zinc-900 rounded-full text-right p-2 cursor-text outline-none focus:outline-none"/>
        <div className="flex justify-end">Pour commencer,<br/> ajoutez un contact...</div>
    </div>
  )
}
