import { useContext } from "react";
import { UserContext } from "../../contexte/userContext";
import CardProfil from "../pageProfil/CardProfil.jsx";
import CardDocuments from "./CardDocuments.jsx";
import { MenuContext } from "../../contexte/menuContext.jsx";
import Fleche from "../../components/Fleche.jsx";

export default function Profil() {
  const { user, setUser } = useContext(UserContext);
  const { email, creeLe, role, avatar } = user || {};
  const { setPage } = useContext(MenuContext);
  const documents = [
    "Bulletins de salaire",
    "Contrat de travail",
    "Avenants",
    "Mutuelle / prévoyance",
  ];
  const demandes = [
    "Faire une demande de fiche de Salaire",
    "Deposer un justificatif d'absence",
  ];

  const handleDeco = () => {
    localStorage.removeItem("accessToken");
    setUser({});
    setPage("connection");
  };

  return (
    <div className="h-full w-full flex justify-start overflow-x-hidden overflow-y-auto mb-15">
      <div className="relative bg-(--bg-main) h-full w-full flex flex-col items-center gap-4 p-4">
        <div className="rounded-full flex justify-center items-center border size-20 overflow-hidden"><img src={avatar} alt="" /></div>
        <CardProfil
          role={role}
          email={email}
          creeLe={creeLe}
          className="select-none "
        ></CardProfil>
        <CardDocuments titre={"Mes Documents"}>
          <ul className="flex items-center flex-col">
            {documents.map((el, index) => (
              <li className="cursor-pointer" key={index}>
                {el}
              </li>
            ))}
          </ul>
        </CardDocuments>
        <CardDocuments titre={"Mes demandes"}>
          <ul className="flex items-center flex-col">
            {demandes.map((element, index) => (
              <li className="cursor-pointer" key={index}>
                {element}
              </li>
            ))}
          </ul>
        </CardDocuments>
        <button
          onClick={() => handleDeco()}
          className="w-1/2 rounded-md p-2 bg-red-800 select-none cursor-pointer"
        >
          Deconnection
        </button>
      </div>
    </div>
  );
}
