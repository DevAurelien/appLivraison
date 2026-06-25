import { useContext } from "react";
import BarreNavigation from "./Navigation.jsx";
import HeaderLogo from "./HeaderLogo.jsx";
import { UserContext } from "../../contexte/userContext.jsx";
import { MenuContext } from "../../contexte/menuContext.jsx";
import CardMessage from "../../components/CardMessage.jsx";
import CardLivraisons from "../../components/CardLivraisons.jsx";

export default function Accueil() {
  const { token } = useContext(UserContext);
  const { setPage } = useContext(MenuContext);



  const handleLivraison = async (token) => {
    fetch("http://localhost:3000/deliveries", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.deco) setPage("connection");
        console.log(data);
      });
  };

  return (
    <div className="relative w-full h-full">
      <BarreNavigation />
      <div className="fd relative bg-(--bg-main) w-full h-full flex justify-center text-white overflow-x-scroll">
        <div className="mx-4 w-full h-full">
          <HeaderLogo />
          <CardMessage
            className=""
            titre={"Mot du Directeur"}
            signature={"Olivier"}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio
            tempore ratione expedita maiores, vero dicta reprehenderit inventore
            sequi animi nisi debitis porro numquam? Quibusdam molestiae est at
            ipsum temporibus quae!
          </CardMessage>
          <CardLivraisons className="text-nowrap" titre="Tournée du jour">
            <h1>Depart</h1>
            <p>07h30</p>
            <h1>Depart Reunion</h1>
            <p>07h30 Jour de Marché</p>
            <h1>Depart</h1>
            <p>07h30</p>
          </CardLivraisons>
        </div>
      </div>
    </div>
  );
}

{
  /* <button
            className="h-[20%] w-[50%]"
            onClick={() => handleLivraison(token)}
          >
            Recup Livraison
          </button> */
}
