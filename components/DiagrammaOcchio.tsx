"use client";

type Punto = { colore?: string; codice?: string };

const CX = 500;
const CY = 210;
const R_LIMBALE = 108;
const R_MEDIANA = 78;
const R_INTERNA = 48;
const R_PUPILLA = 20;

const BADGE_SINISTRA = [
  { lettera: "A", y: 95, atterraggio: { x: 428, y: 138 } },
  { lettera: "B", y: 165, atterraggio: { x: 438, y: 172 } },
  { lettera: "C", y: 235, atterraggio: { x: 448, y: 205 } },
  { lettera: "D", y: 305, atterraggio: { x: 462, y: 222 } },
];

const BADGE_DESTRA = [
  { lettera: "E", y: 95, atterraggio: { x: 572, y: 138 } },
  { lettera: "F", y: 165, atterraggio: { x: 562, y: 172 } },
  { lettera: "G", y: 235, atterraggio: { x: 552, y: 205 } },
  { lettera: "H", y: 305, atterraggio: { x: 538, y: 222 } },
];

export default function DiagrammaOcchio({
  punti,
  onChange,
}: {
  punti: Record<string, Punto>;
  onChange: (lettera: string, campo: "colore" | "codice", valore: string) => void;
}) {
  function inputStyle(): React.CSSProperties {
    return {
      width: "100%",
      background: "transparent",
      border: "none",
      borderBottom: "1px solid #E4E4E4",
      fontSize: "11px",
      fontFamily: "Manrope, sans-serif",
      color: "#1A1A1A",
      padding: "2px 2px",
      outline: "none",
    };
  }

  return (
    <svg width="100%" viewBox="0 0 1000 420" className="mx-auto">
      {/* Forma a mandorla dell'occhio */}
      <path
        d={`M 150 ${CY} C 290 ${CY - 120} 710 ${CY - 120} 850 ${CY} C 710 ${CY + 120} 290 ${CY + 120} 150 ${CY} Z`}
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="1.6"
      />

      {/* Iride: 4 zone concentriche */}
      <circle cx={CX} cy={CY} r={R_LIMBALE} fill="#F7F4EF" stroke="#1A1A1A" strokeWidth="1.4" />
      <circle cx={CX} cy={CY} r={R_MEDIANA} fill="none" stroke="#D8D2C6" strokeWidth="1" strokeDasharray="2 3" />
      <circle cx={CX} cy={CY} r={R_INTERNA} fill="none" stroke="#D8D2C6" strokeWidth="1" strokeDasharray="2 3" />
      <circle cx={CX} cy={CY} r={R_PUPILLA} fill="#1A1A1A" />
      <circle cx={CX - 6} cy={CY - 6} r="3.5" fill="#FFFFFF" opacity="0.85" />

      {/* Badge sinistri + linee guida verso l'iride + campi */}
      {BADGE_SINISTRA.map((b) => (
        <g key={b.lettera}>
          <line x1={40} y1={b.y} x2={b.atterraggio.x} y2={b.atterraggio.y} stroke="#CFCFCF" strokeWidth="1" />
          <circle cx="26" cy={b.y} r="13" fill="#0E93A3" />
          <text x="26" y={b.y} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight={700} fill="#FFFFFF" fontFamily="Poppins, sans-serif">
            {b.lettera}
          </text>

          <text x="54" y={b.y - 10} fontSize="9" fill="#8A8A8A" letterSpacing="0.5" fontFamily="Manrope, sans-serif">COLORE</text>
          <foreignObject x="54" y={b.y - 6} width="110" height="20">
            <input
              style={inputStyle()}
              value={punti?.[b.lettera]?.colore ?? ""}
              onChange={(e) => onChange(b.lettera, "colore", e.target.value)}
            />
          </foreignObject>

          <text x="178" y={b.y - 10} fontSize="9" fill="#8A8A8A" letterSpacing="0.5" fontFamily="Manrope, sans-serif">CODICE</text>
          <foreignObject x="178" y={b.y - 6} width="110" height="20">
            <input
              style={inputStyle()}
              value={punti?.[b.lettera]?.codice ?? ""}
              onChange={(e) => onChange(b.lettera, "codice", e.target.value)}
            />
          </foreignObject>
        </g>
      ))}

      {/* Badge destri + linee guida + campi */}
      {BADGE_DESTRA.map((b) => (
        <g key={b.lettera}>
          <line x1={960} y1={b.y} x2={b.atterraggio.x} y2={b.atterraggio.y} stroke="#CFCFCF" strokeWidth="1" />
          <circle cx="974" cy={b.y} r="13" fill="#0E93A3" />
          <text x="974" y={b.y} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight={700} fill="#FFFFFF" fontFamily="Poppins, sans-serif">
            {b.lettera}
          </text>

          <text x="706" y={b.y - 10} fontSize="9" fill="#8A8A8A" letterSpacing="0.5" fontFamily="Manrope, sans-serif">COLORE</text>
          <foreignObject x="706" y={b.y - 6} width="110" height="20">
            <input
              style={inputStyle()}
              value={punti?.[b.lettera]?.colore ?? ""}
              onChange={(e) => onChange(b.lettera, "colore", e.target.value)}
            />
          </foreignObject>

          <text x="830" y={b.y - 10} fontSize="9" fill="#8A8A8A" letterSpacing="0.5" fontFamily="Manrope, sans-serif">CODICE</text>
          <foreignObject x="830" y={b.y - 6} width="110" height="20">
            <input
              style={inputStyle()}
              value={punti?.[b.lettera]?.codice ?? ""}
              onChange={(e) => onChange(b.lettera, "codice", e.target.value)}
            />
          </foreignObject>
        </g>
      ))}

      {/* Legenda zone */}
      <g fontFamily="Manrope, sans-serif" fontSize="10" fill="#6B6B6B">
        <text x="250" y="400">1 Pupilla / alone pupillare</text>
        <text x="430" y="400">2 Zona interna</text>
        <text x="590" y="400">3 Zona mediana</text>
        <text x="740" y="400">4 Zona esterna / bordo limbale</text>
      </g>
    </svg>
  );
}
