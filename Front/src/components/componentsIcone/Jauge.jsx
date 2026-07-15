export default function Jauge({
    color1="#3e88dc",
    color2="#f8e300",
    color3="none", className,
    totalLivraisons =18, livraisonsFaite = 6,
    currentColor 
}) {

    const longueurChemin = 100;
    // const progression = livraisonsFaite / totalLivraisons;
    const progression = totalLivraisons === 0 ? 0 : livraisonsFaite / totalLivraisons;
    const offset = longueurChemin * (1 - progression)

  return (
    <svg className={`${className} `}
      id="Jauge"
      data-name="Calque 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 981.35 859.93"
    >
      <path
        d="M185.18,808.27c-83.33-80.17-135.18-192.83-135.18-317.59,0-243.38,197.3-440.67,440.67-440.67s440.67,197.3,440.67,440.67c0,125.63-52.57,238.98-136.91,319.25"
        fill={color3} stroke={color1} opacity={0.1} strokeLinecap={"round"} strokeMiterlimit={"10"} strokeWidth={"100"} 
      />
      <path
        d="M185.18,808.27c-83.33-80.17-135.18-192.83-135.18-317.59,0-243.38,197.3-440.67,440.67-440.67s440.67,197.3,440.67,440.67c0,125.63-52.57,238.98-136.91,319.25"
        fill={color3} stroke={color2} strokeLinecap={"round"} strokeMiterlimit={"10"} strokeWidth={"100"} pathLength={longueurChemin}
        strokeDasharray={longueurChemin}
        style={{ strokeDashoffset: offset }}
        className="transition-[stroke-dashoffset] duration-200 ease-out"
      />
    </svg>
  );
}
