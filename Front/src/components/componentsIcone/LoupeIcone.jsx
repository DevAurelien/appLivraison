export default function LoupeIcone({
  color1 = "#fff",
  color2 = "#000",
  color3 = "none",
  width = 30,
  height = 30,
  className = "",
  titre,
  tailleTexte = "",
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`${className} ${
        titre ? "flex flex-col items-center justify-center" : ""
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 5120 5120"
        width={width}
        height={height}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <g
          transform="translate(0 5120) scale(1 -1)"
          fill={color1}
          stroke={color3}
        >
          <path d="M1550 5113 c-419 -39 -790 -217 -1075 -515 -243 -253 -389 -540 -452 -888 -27 -149 -24 -441 6 -590 144 -725 702 -1260 1425 -1366 147 -22 427 -14 568 15 219 45 429 132 613 255 54 36 101 66 104 66 4 0 53 -47 110 -104 l104 -104 -22 -44 c-26 -55 -27 -120 -2 -173 13 -27 272 -292 822 -842 693 -691 810 -803 844 -812 55 -15 89 -14 133 4 50 21 348 316 373 370 23 49 24 103 4 153 -22 51 -1593 1626 -1650 1653 -53 25 -118 24 -173 -2 l-44 -22 -104 104 c-57 57 -104 106 -104 110 0 3 30 50 67 105 210 314 306 676 281 1067 -42 660 -494 1251 -1125 1470 -219 77 -487 111 -703 90z m430 -427 c504 -116 882 -509 981 -1021 25 -124 27 -332 5 -457 -96 -541 -517 -960 -1060 -1054 -137 -24 -387 -15 -521 20 -231 58 -416 161 -588 325 -575 549 -513 1493 129 1967 153 114 373 208 544 233 41 6 86 13 100 15 68 12 309 -4 410 -28z" />
        </g>
      </svg>

      {titre && (
        <span
          className={`${
            tailleTexte ? tailleTexte : "text-[0.6rem]"
          } flex items-center justify-center pt-1`}
        >
          {titre}
        </span>
      )}
    </div>
  );
}