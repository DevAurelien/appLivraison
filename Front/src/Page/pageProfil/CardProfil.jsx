export default function CardProfil({ role, email, creeLe, children, onClick, className }) {
  const date = new Date(creeLe);
  
  return (
    <div onClick={onClick} className={`${className} flex flex-col items-center rounded-xl gap-2 card w-full text-white p-4`}>
      <h1 className="text-xl">{role}</h1>
      <div>
        <p className="">Email : {email}</p>
        <p className="">Date de creation : {date.toLocaleDateString()}</p>
      </div>
    </div>
  );
}
