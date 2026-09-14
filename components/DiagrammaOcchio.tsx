const PUNTI_SINISTRA = [
  { lettera: "A", cx: 130, cy: 118 },
  { lettera: "B", cx: 118, cy: 150 },
  { lettera: "C", cx: 118, cy: 182 },
  { lettera: "D", cx: 130, cy: 212 },
];

const PUNTI_DESTRA = [
  { lettera: "E", cx: 270, cy: 118 },
  { lettera: "F", cx: 282, cy: 150 },
  { lettera: "G", cx: 282, cy: 182 },
  { lettera: "H", cx: 270, cy: 212 },
];

export default function DiagrammaOcchio() {
  return (
    <svg width="100%" viewBox="0 0 400 330" className="max-w-[420px] mx-auto">
      {/* Forma a mandorla dell'occhio */}
      <path
        d="M 40 165 C 120 90 280 90 360 165 C 280 240 120 240 40 165 Z"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="1.5"
      />

      {/* Iride */}
      <circle cx="200" cy="165" r="70" fill="#F4EFE9" stroke="#1A1A1A" strokeWidth="1.3" />
      <circle cx="200" cy="165" r="46" fill="none" stroke="#CFC7BC" strokeWidth="1" />
      <circle cx="200" cy="165" r="24" fill="none" stroke="#CFC7BC" strokeWidth="1" />
      {/* Pupilla */}
      <circle cx="200" cy="165" r="15" fill="#1A1A1A" />
      <circle cx="195" cy="159" r="3.5" fill="#FFFFFF" opacity="0.8" />

      {/* Punti a sinistra, con linee guida verso l'iride */}
      {PUNTI_SINISTRA.map((p) => (
        <g key={p.lettera}>
          <line x1={p.cx + 8} y1={p.cy} x2={200 - 40} y2={165} stroke="#E4E4E4" />
          <circle cx={p.cx} cy={p.cy} r="9" fill="#0E93A3" />
          <text
            x={p.cx}
            y={p.cy}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="9"
            fontWeight={700}
            fill="#FFFFFF"
            fontFamily="Poppins, sans-serif"
          >
            {p.lettera}
          </text>
        </g>
      ))}

      {/* Punti a destra */}
      {PUNTI_DESTRA.map((p) => (
        <g key={p.lettera}>
          <line x1={p.cx - 8} y1={p.cy} x2={200 + 40} y2={165} stroke="#E4E4E4" />
          <circle cx={p.cx} cy={p.cy} r="9" fill="#0E93A3" />
          <text
            x={p.cx}
            y={p.cy}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="9"
            fontWeight={700}
            fill="#FFFFFF"
            fontFamily="Poppins, sans-serif"
          >
            {p.lettera}
          </text>
        </g>
      ))}

      <text x="200" y="300" textAnchor="middle" fontSize="9" fill="#6B6B6B">
        Pupilla · zona interna · zona mediana · bordo limbale
      </text>
    </svg>
  );
}
