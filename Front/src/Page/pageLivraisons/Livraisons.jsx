import CardLivraisons from "./CardLivraisons";
import HeaderLogo from "../HeaderLogo.jsx";
import CardLivReduit from "./CardLivReduit.jsx";
import { useEffect, useState } from "react";
import apifetch from "../../utils/apiFetch.jsx"

export default function Livraisons() {

  const [liv, setLiv] = useState([]);
  const [livActif, setLivActif] = useState(0)

  useEffect(()=>{
    apifetch("/livraisonsJour")
    .then(res => res.json())
    .then(datas => {
      setLiv(datas.livraisons);
      console.log(liv);
    })
  },[])

  const handleActif = (index)=>{
    
    setLivActif(index);
  }

  return (
    <div className="flex w-full h-full bg-(--bg-main) text-xl flex-col items-center px-4 gap-2 pb-30 overflow-y-scroll overflow-x-hidden">
      <HeaderLogo>
        <span className="w-full">
          {" "}
          Livraisons du Jour
        </span>
      </HeaderLogo>

      {liv.length > 0 && liv.map((livraison, index) => 
        index === livActif ?  <CardLivraisons onClick={()=>handleActif(index)} key={index} {...livraison}/>: <CardLivReduit onClick={()=>handleActif(index)} key={index} {...livraison}/>
      )}


      
      {/* <CardLivraisons {...liv[0]}/> */}
      {/* <CardLivReduit {...livraison[1]}/>
      <CardLivReduit {...livraison[2]}/>
      <CardLivReduit {...livraison[3]}/>
      <CardLivReduit {...livraison[4]}/>
      <CardLivReduit {...livraison[5]}/>
      <CardLivReduit {...livraison[6]}/> */}
    </div>
  );
}
