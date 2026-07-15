export default function PlusIcone({
  color1 = "#fff",
  color2 = "#000",
  color3 = "none",
  width = 30,
  height = 30,
  className = "",
  onClick,
}) {
  return (
    <svg
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={width}
      height={height}
      className={className}
      preserveAspectRatio="xMidYMid meet"
      pointerEvents="none"
    >
      <g
        transform="translate(0,512) scale(0.1,-0.1)"
        fill={color1}
        stroke={color3}
      >
        <path d="M2103 5102 c-91 -32 -164 -95 -205 -177 -36 -70 -38 -125 -38 -900 l0 -765 -765 0 c-791 0 -829 -2 -908 -42 -57 -29 -125 -101 -155 -166 l-27 -57 0 -435 0 -435 27 -57 c30 -65 98 -137 155 -166 79 -40 117 -42 908 -42 l765 0 0 -765 c0 -791 2 -829 42 -908 29 -57 101 -125 166 -155 l57 -27 435 0 435 0 57 27 c65 30 137 98 166 155 40 79 42 117 42 908 l0 765 765 0 c791 0 829 2 908 42 57 29 125 101 155 166 l27 57 0 435 0 435 -27 57 c-30 65 -98 137 -155 166 -79 40 -117 42 -908 42 l-765 0 0 765 c0 791 -2 829 -42 908 -29 57 -101 125 -166 155 l-57 27 -420 2 c-384 3 -424 1 -472 -15z" />
      </g>
    </svg>
  );
}