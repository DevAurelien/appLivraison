import CardLivraisons from "./CardLivraisons";
import HeaderLogo from "../HeaderLogo.jsx";
import CardLivReduit from "./CardLivReduit.jsx";
import { useEffect, useState } from "react";
import apifetch from "../../utils/apiFetch.jsx";
import Pulse from "../../components/Loading.jsx"

export default function Livraisons() {
  const [liv, setLiv] = useState({
    loading:true,
    error:"",
    data:[],
  });
  const [livActif, setLivActif] = useState(0);

  useEffect(() => {
    try {
      apifetch("/livraisonsJour")
        .then((res) => {
          return res.json();
        })
        .then((datas) => {
          setLiv((prev)=>({...prev, data : datas.livraisons, loading:false}));
          
          liv.data.length > 0 && console.log(liv.data);
        });
    } catch {
      setLiv((prev)=>({...prev, error : "Une erreur est survenue", loading:false}));
    }
  }, []);

  const handleActif = (index) => {
    setLivActif(index);
  };

  return (
    <div className="flex w-full h-full bg-(--bg-main) text-xl flex-col items-center px-4 gap-2 pb-30 overflow-y-scroll overflow-x-hidden">
      {liv.loading ? <Pulse className={"pt-10"}/>:""}
      {liv?.data?.length > 0 &&
        liv.data.map((livraison, index) =>
          index === livActif ? (
            <CardLivraisons
              onClick={() => handleActif(index)}
              key={index}
              {...livraison}
            />
          ) : (
            <CardLivReduit
              onClick={() => handleActif(index)}
              key={index}
              {...livraison}
            />
          ),
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
