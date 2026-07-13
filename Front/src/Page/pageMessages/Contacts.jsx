import UserIcone from "../../components/UserIcone.jsx";
import PlusIcone from "../../components/PlusIcone.jsx";
import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../../contexte/menuContext";
import apiFetch from "../../utils/apiFetch.jsx";
import { UserContext } from "../../contexte/userContext.jsx";
import { ContactContext } from "../../contexte/contactContext.jsx";

export default function Contacts() {
  const [inputSearch, setInputSearch] = useState("");
  const [content, setContent] = useState(null);
  const [salaries, setSalaries] = useState([]);
  const { user } = useContext(UserContext);
  const { setPage } = useContext(MenuContext);
  const rechercheActive = inputSearch.trim().length >= 2;
  const { listeContacts, setListeContacts } = useContext(ContactContext);

  useEffect(() => {
    const saisie = inputSearch.trim();

    if (saisie.length < 2) {
      setSalaries([]);
      return;
    }

    const delaiFrappe = setTimeout(async () => {
      try {
        const resultat = await apiFetch(
          `/salariesSearch?saisie=${encodeURIComponent(saisie)}`,
          "GET",
        );

        const data = await resultat.json();

        const listeSalariesAvecAvatar = await Promise.all(
          data.salaries.map(async (salarie) => {
            const resAvatar = await apiFetch(
              `/salaries/${salarie.id}/avatar`,
              "GET",
            );

            let avatarLocalUrl = null;

            if (resAvatar.ok) {
              const avatarBlob = await resAvatar.blob();
              avatarLocalUrl = URL.createObjectURL(avatarBlob);
            }

            return {
              ...salarie,
              avatarLocalUrl,
            };
          }),
        );

        setSalaries(listeSalariesAvecAvatar);
      } catch (error) {
        console.error("Erreur pendant la recherche :", error);
      }
    }, 200);

    return () => clearTimeout(delaiFrappe);
  }, [inputSearch]);

  const ajouterContact = (salarie) => {
    setListeContacts((prev) => [...prev, salarie]);
    setInputSearch("");
    setSalaries([]);
  };

  // <PlusIcone width={30} height={30} className=""/>
  return (
    <div
      className={`bg-(--main) w-full h-full px-4 flex justify-start text-white ${listeContacts.length > 0 ? "flex-col-reverse" : "flex-col"} mb-25 md:pb-50 gap-2`}
    >
      {user.role != "Client" && <input
        onChange={(e) => {
          setInputSearch(e.target.value);
        }}
        value={inputSearch}
        placeholder="Rechercher..."
        className="placeholder:text-white/20 flex border w-full min-h-10 bg-zinc-900 rounded-full text-right p-2 cursor-text outline-none focus:outline-none"
      />}
      {/* <button onClick={()=>{setPage("Messagerie")}}> clic</button> */}
      {rechercheActive ? (
        <ul className="flex flex-col gap-4">
          {salaries.map((salarie) => (
            <li
              key={salarie.id}
              className="flex justify-start gap-2 items-center cursor-pointer"
              onClick={() => ajouterContact(salarie)}
            >
              <img
                src={salarie.avatarLocalUrl}
                alt="P"
                className="size-[5vh] rounded-full"
              />
              {salarie.nom} {salarie.prenom}
            </li>
          ))}
        </ul>
      ) : (
        <ul className="flex flex-col gap-4">
          {listeContacts.map((salarie) => (
            <li
              key={salarie.id}
              className="flex justify-start gap-2 items-center cursor-pointer"
              onClick={() => setPage("Messagerie")}
            >
              <img
                src={salarie.avatarLocalUrl}
                alt="P"
                className="size-[5vh] rounded-full"
              />
              {salarie.nom} {salarie.prenom}
            </li>
          ))}
        </ul>
      )}
      {((salaries.length === 0 && listeContacts.length === 0) && (user.role != "Client")) && (
        <div className="flex justify-end">
          Pour commencer,
          <br /> ajoutez un contact...
        </div>
      )}
      {user.role === "Client" && <div className="flex justify-start">Vous pouvez joindre vos livreurs ici</div>
      }
    </div>
  );
}
