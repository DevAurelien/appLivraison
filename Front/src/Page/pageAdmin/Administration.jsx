import UserIcone from "../../components/UserIcone.jsx";
import Shop from "../../components/Shop.jsx"

export default function Administration() {
  return (
    <div className="grid grid-cols-3 gap-4 w-full p-4">
      <div className="aspect-square cursor-pointer">
        <UserIcone titre={"Mes Livreurs"} tailleTexte="text-[1rem]" className={"h-full flex justify-center items-center card rounded-xl"} />
      </div>
      <div className="aspect-square cursor-pointer">
        <Shop titre={"Mes Agences"} tailleTexte="text-[1rem]" height="30" width="30" className={"h-full flex justify-center items-center card rounded-xl"} />
      </div>
      <div className="aspect-square cursor-pointer">
        <UserIcone className={"h-full flex justify-center items-center card rounded-xl"} />
      </div>
      <div className="aspect-square cursor-pointer">
        <UserIcone className={"h-full flex justify-center items-center card rounded-xl"} />
      </div>
      <div className="aspect-square cursor-pointer">
        <UserIcone className={"h-full flex justify-center items-center card rounded-xl"} />
      </div>
      <div className="aspect-square cursor-pointer">
        <UserIcone className={"h-full flex justify-center items-center card rounded-xl"} />
      </div>
    </div>
  );
}
