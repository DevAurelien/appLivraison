import ZesteoLogo from "./Zesteo_Logo.jsx";
import Card from "./Card.jsx";
import Notif from "./Notif.jsx"

export default function HeaderLogo() {
  return (
    <div className="flex items-center justify-between w-full h-1/10 overflow-hidden px-2">
      <ZesteoLogo className="w-1/3 h-full size-30 md:size-50 text-yellow-300" />
        <div className="h-1/3"><Card className=" h-1/3 p-2 cursor-default">Livreur</Card></div>
      <div className="w-1/3 h-full items-center flex justify-end"><Notif className="size-8 md:size-12 cursor-pointer"></Notif></div>
    </div>
  );
}
