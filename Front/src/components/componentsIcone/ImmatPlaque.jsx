export default function PlaqueImmatriculation({
  immatriculation = "AA-123-AA",
  departement = "31",
  width = 180,
  height = 42,
  className = "",
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 180"
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label={`Plaque d'immatriculation ${immatriculation}`}
    >
      {/* Contour extérieur */}
      <rect
        x="8"
        y="8"
        width="784"
        height="164"
        rx="22"
        fill="#30343a"
      />

      {/* Fond de la plaque */}
      <rect
        x="16"
        y="16"
        width="768"
        height="148"
        rx="17"
        fill="#f2f3f4"
        stroke="#8a8f96"
        strokeWidth="3"
      />

      {/* Bande européenne gauche */}
      <path
        d="M33 16H84V164H33C23.6 164 16 156.4 16 147V33C16 23.6 23.6 16 33 16Z"
        fill="#1455a3"
      />

      {/* Bande département droite */}
      <path
        d="M716 16H767C776.4 16 784 23.6 784 33V147C784 156.4 776.4 164 767 164H716V16Z"
        fill="#1455a3"
      />

      {/* Étoiles européennes simplifiées */}
      <g fill="#ffd83d">
        <circle cx="50" cy="42" r="3" />
        <circle cx="61" cy="46" r="3" />
        <circle cx="68" cy="56" r="3" />
        <circle cx="70" cy="68" r="3" />
        <circle cx="66" cy="79" r="3" />
        <circle cx="57" cy="87" r="3" />
        <circle cx="45" cy="88" r="3" />
        <circle cx="35" cy="82" r="3" />
        <circle cx="29" cy="72" r="3" />
        <circle cx="30" cy="60" r="3" />
        <circle cx="37" cy="50" r="3" />
        <circle cx="48" cy="46" r="3" />
      </g>

      {/* Pays */}
      <text
        x="50"
        y="132"
        textAnchor="middle"
        fontSize="50"
        fontWeight="700"
        fill="#ffffff"
        fontFamily="Arial, sans-serif"
      >
        F
      </text>

      {/* Immatriculation */}
      <text
        x="400"
        y="119"
        textAnchor="middle"
        fontSize="87"
        fontWeight="700"
        letterSpacing="5"
        fill="black"
        fontFamily="Arial, sans-serif"
      >
        {immatriculation || "AA-123-AA"}
      </text>

      {/* Département */}
      <text
        x="750"
        y="122"
        textAnchor="middle"
        fontSize="48"
        fontWeight="700"
        fill="#ffffff"
        fontFamily="Arial, sans-serif"
      >
        {departement}
      </text>
    </svg>
  );
}