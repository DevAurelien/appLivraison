export default function EclairIcone({
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
          d="M2456 5105 c-90 -32 -68 9 -783 -1485 -645 -1351 -666 -1397 -671
-1463 -5 -82 13 -139 62 -189 74 -76 41 -73 704 -76 l592 -3 0 -850 c0 -926
-3 -879 57 -957 14 -19 49 -45 77 -58 88 -41 173 -27 243 39 39 38 109 178
710 1437 645 1351 666 1397 671 1463 5 82 -13 139 -62 189 -74 76 -41 73 -703
76 l-593 3 0 850 c0 926 3 879 -57 957 -32 42 -114 82 -168 81 -22 0 -58 -6
-79 -14z m10 -2115 c11 -19 35 -45 54 -57 l33 -23 604 0 c380 0 603 -4 601
-10 -1 -5 -244 -514 -538 -1130 l-535 -1121 -5 723 c-5 707 -5 724 -26 758
-11 19 -35 45 -54 57 l-33 23 -604 0 c-380 0 -603 4 -601 10 2 5 244 514 538
1130 l535 1121 5 -723 c5 -707 5 -724 26 -758z"
        />
      </g>
    </svg>
  );
}