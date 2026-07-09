import UserIcone from "../../components/UserIcone.jsx"
import PlusIcone from "../../components/PlusIcone.jsx"
import { useContext } from "react"
import { MenuContext } from "../../contexte/menuContext"

export default function Contacts() {

    const {setPage} = useContext(MenuContext) 

  return (
    <div className='bg-(--main) w-full h-full px-4'>
        {/* <div className="flex border w-fit rounded-full p-2"><UserIcone width={30} height={30} className=""/></div> */}
        <div onClick={()=>setPage("Messagerie")} className="flex border w-fit rounded-full p-2"><PlusIcone width={30} height={30} className=""/></div>
    </div>
  )
}
