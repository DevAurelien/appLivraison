export default function ChevronIcone({
  color1 = "#fff",
  color2 = "#000",
  color3 = "none",
  className = "",
  height = 30,
  width = 30,
  ...props
}) {
  return (
    <svg
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={width}
      height={height}
      preserveAspectRatio="xMidYMid meet"
      {...props}
    >
      <g
        transform="translate(0 512) scale(0.1 -0.1)"
        fill={color1}
        stroke={color3}
      >
        <path
          d="M735 3817 c-204 -68 -331 -269 -297 -473 24 -143 -19 -95 971 -1086
809 -810 912 -910 964 -934 84 -38 172 -51 253 -37 147 25 102 -15 1090 975
983 985 939 936 965 1081 32 178 -69 370 -239 450 -63 30 -73 32 -182 32 -200
0 -134 53 -977 -789 l-723 -720 -722 720 c-674 672 -728 723 -792 755 -63 30
-79 34 -170 36 -64 2 -116 -2 -141 -10z"
        />
      </g>
    </svg>
  );
}