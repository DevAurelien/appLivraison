import { useContext } from "react";
import ZesteoLogo from "../../components/Zesteo_Logo.jsx";
import CardMetierHeader from "./CardMetierHeader.jsx";
import Notif from "./Notif.jsx";
import { UserContext } from "../../contexte/userContext.jsx";

export default function HeaderLogo() {

  const {user} = useContext(UserContext)
  const {role} = user;

  return (
    <div className="flex items-end pb-4 w-full h-[10%] overflow-hidden">
      <div className="w-[50%] flex justify-between items-end">
        <ZesteoLogo className="w-[50%] max-h-full object-contain items-end flex text-yellow-300" />
        <CardMetierHeader className="px-4 flex justify-end items-end cursor-default border">
          {role}
        </CardMetierHeader>
      </div>
      <div className="w-[50%] h-full items-end flex justify-end">
        <Notif
          height={35}
          width={35}
          className="object-contain max-h-full flex items-end justify-end cursor-pointer"
        />
      </div>
    </div>
  );
}
