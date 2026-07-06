import CardLivraisons from "./CardLivraisons";
import HeaderLogo from "../HeaderLogo.jsx";
import CardLivReduit from "./CardLivReduit.jsx";

export default function Livraisons() {
  return (
    <div className="flex w-full h-full bg-(--bg-main) text-xl flex-col items-center px-4 gap-2">
      <HeaderLogo>
        <h1 className="flex justify-center w-[50%] whitespace-nowrap">
          {" "}
          Livraisons du Jour
        </h1>
      </HeaderLogo>
      <CardLivraisons></CardLivraisons>
      <CardLivReduit/>
      <CardLivReduit numeroDeLivraison="3"/>
      <CardLivReduit numeroDeLivraison="4"/>
      <CardLivReduit numeroDeLivraison="5"/>
      <CardLivReduit numeroDeLivraison="6"/>
      <CardLivReduit numeroDeLivraison="7"/>
    </div>
  );
}
