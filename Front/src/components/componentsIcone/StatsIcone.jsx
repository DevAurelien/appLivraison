export default function StatsIcone({
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
        viewBox="0 0 512.000000 512.000000"
        width={width}
        height={height}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <g
          transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
          fill={color1}
          stroke={color3}
        >
          <path d="M3397 4985 c-240 -72 -440 -134 -443 -137 -3 -4 13 -69 37 -146 l42
-140 51 15 c28 8 118 35 200 59 81 25 150 43 152 41 5 -4 -250 -485 -314 -592
-142 -241 -370 -503 -595 -684 -127 -103 -291 -207 -457 -290 -182 -91 -332
-146 -531 -195 -262 -64 -305 -68 -821 -73 l-468 -5 0 -149 0 -149 408 0 c224
0 459 5 522 11 818 76 1546 481 2035 1134 102 137 176 259 342 568 81 152 151
273 154 269 4 -4 33 -94 65 -200 34 -115 62 -191 68 -189 6 3 70 21 141 42 72
21 131 39 133 40 6 5 -266 899 -275 901 -4 1 -205 -58 -446 -131z" />

          <path d="M3417 3173 c-4 -3 -7 -651 -7 -1440 l0 -1433 -150 0 -150 0 0 955 0
955 -550 0 -550 0 0 -955 0 -955 -150 0 -150 0 0 660 0 660 -550 0 -550 0 0
-660 0 -660 -180 0 -180 0 0 -150 0 -150 2310 0 2310 0 0 150 0 150 -180 0
-180 0 0 1440 0 1440 -543 0 c-299 0 -547 -3 -550 -7z" />
        </g>
      </svg>

      {titre && (
        <span
          className={`${tailleTexte ? tailleTexte : "text-[0.6rem]"} flex items-center justify-center pt-1`}
        >
          {titre}
        </span>
      )}
    </div>
  );
}