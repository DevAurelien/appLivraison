import { useContext } from "react";
import ZesteoLogo from "../components/Zesteo_Logo.jsx";
import CardMetierHeader from "./pageAccueil/CardMetierHeader.jsx";
import Notif from "./pageAccueil/Notif.jsx";
import { UserContext } from "../contexte/userContext.jsx";
import { MenuContext } from "../contexte/menuContext.jsx";

export default function HeaderLogo({children}) {

  const {user} = useContext(UserContext)
  const {role} = user;
  const {page} = useContext(MenuContext)

  return (
    <div className="flex shrink-0 items-end pb-4 w-full h-[10%] overflow-hidden">
      <div className="w-[80%] flex justify-between items-end">
        <ZesteoLogo className="w-[40%] max-h-full object-contain items-end flex text-yellow-300" />
        {page === "Accueil" ? <CardMetierHeader className="px-4 flex justify-start items-start cursor-default">
          {role}
        </CardMetierHeader> : <p className="flex justify-center w-[60%] whitespace-nowrap">{children}</p>}
      </div>
      <div className="w-[10%]"></div>
      <div className="w-[10%] h-full items-end flex justify-end">
        <Notif
          height={35}
          width={35}
          className="object-contain max-h-full flex items-end justify-end cursor-pointer"
        />
      </div>
    </div>
  );
}
