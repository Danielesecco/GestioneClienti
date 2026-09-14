"use client";

const SPICCHI = [
  { valore: "spring_bright", stagione: "Spring", tipo: "bright", inizio: 0, fine: 45, colore: "#F4A259" },
  { valore: "spring_light", stagione: "Spring", tipo: "light", inizio: 45, fine: 90, colore: "#F7C59F" },
  { valore: "autumn_deep", stagione: "Autumn", tipo: "deep", inizio: 90, fine: 135, colore: "#B5651D" },
  { valore: "autumn_soft", stagione: "Autumn", tipo: "soft", inizio: 135, fine: 180, colore: "#C98A56" },
  { valore: "summer_soft", stagione: "Summer", tipo: "soft", inizio: 180, fine: 225, colore: "#B8A9C9" },
  { valore: "summer_light", stagione: "Summer", tipo: "light", inizio: 225, fine: 270, colore: "#CBD9E8" },
  { valore: "winter_deep", stagione: "Winter", tipo: "deep", inizio: 270, fine: 315, colore: "#2E4570" },
  { valore: "winter_bright", stagione: "Winter", tipo: "bright", inizio: 315, fine: 360, colore: "#5B7FB5" },
];

const STAGIONI_ARCO = [
  { id: "arco-spring", nome: "SPRING", inizio: 0, fine: 90, invertito: false },
  { id: "arco-autumn", nome: "AUTUMN", inizio: 90, fine: 180, invertito: true },
  { id: "arco-summer", nome: "SUMMER", inizio: 180, fine: 270, invertito: true },
  { id: "arco-winter", nome: "WINTER", inizio: 270, fine: 360, invertito: false },
];

const CX = 200;
const CY = 200;
const R_ESTERNO = 160;
const R_INTERNO = 55;
const R_ETICHETTA = 184;

function polare(angoloGradi: number, raggio: number) {
  const rad = ((angoloGradi - 90) * Math.PI) / 180;
  return { x: CX + raggio * Math.cos(rad), y: CY + raggio * Math.sin(rad) };
}

function pathSpicchio(inizio: number, fine: number) {
  const p1 = polare(inizio, R_ESTERNO);
  const p2 = polare(fine, R_ESTERNO);
  const p3 = polare(fine, R_INTERNO);
  const p4 = polare(inizio, R_INTERNO);
  const grandeArco = fine - inizio > 180 ? 1 : 0;
  return [
    `M ${p1.x} ${p1.y}`,
    `A ${R_ESTERNO} ${R_ESTERNO} 0 ${grandeArco} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${R_INTERNO} ${R_INTERNO} 0 ${grandeArco} 0 ${p4.x} ${p4.y}`,
    "Z",
  ].join(" ");
}

function pathArcoEtichetta(inizio: number, fine: number, invertito: boolean) {
  const a1 = invertito ? fine : inizio;
  const a2 = invertito ? inizio : fine;
  const sweep = invertito ? 0 : 1;
  const p1 = polare(a1, R_ETICHETTA);
  const p2 = polare(a2, R_ETICHETTA);
  return `M ${p1.x} ${p1.y} A ${R_ETICHETTA} ${R_ETICHETTA} 0 0 ${sweep} ${p2.x} ${p2.y}`;
}

export default function RuotaArmocromia({
  valore,
  onChange,
}: {
  valore: string | undefined;
  onChange: (v: string) => void;
}) {
  const selezionato = SPICCHI.find((s) => s.valore === valore);

  return (
    <div className="flex flex-col items-center">
      <svg width="100%" viewBox="0 0 400 400" className="max-w-[380px]">
        <defs>
          {STAGIONI_ARCO.map((s) => (
            <path
              key={s.id}
              id={s.id}
              d={pathArcoEtichetta(s.inizio, s.fine, s.invertito)}
              fill="none"
            />
          ))}
        </defs>

        {SPICCHI.map((s) => {
          const attivo = s.valore === valore;
          const metaAngolo = (s.inizio + s.fine) / 2;
          const puntoTipo = polare(metaAngolo, (R_ESTERNO + R_INTERNO) / 2);
          return (
            <g key={s.valore}>
              <path
                d={pathSpicchio(s.inizio, s.fine)}
                fill={s.colore}
                opacity={attivo ? 1 : 0.55}
                stroke="#FFFFFF"
                strokeWidth={2}
                className="cursor-pointer transition-opacity hover:opacity-90"
                onClick={() => onChange(s.valore)}
              />
              <text
                x={puntoTipo.x}
                y={puntoTipo.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="pointer-events-none select-none capitalize"
                fontSize="12"
                fontWeight={600}
                fill="#FFFFFF"
                fontFamily="Manrope, sans-serif"
              >
                {s.tipo}
              </text>
            </g>
          );
        })}

        {/* Nomi delle stagioni, curvi lungo il bordo esterno */}
        {STAGIONI_ARCO.map((s) => (
          <text key={s.id} fontSize="13" fontWeight={800} fill="#1A1A1A" fontFamily="Poppins, sans-serif" letterSpacing="1">
            <textPath href={`#${s.id}`} startOffset="50%" textAnchor="middle">
              {s.nome}
            </textPath>
          </text>
        ))}

        <circle cx={CX} cy={CY} r={R_INTERNO - 2} fill="#FFFFFF" stroke="#E4E4E4" />
        <text
          x={CX}
          y={CY - 4}
          textAnchor="middle"
          fontSize="12"
          fontWeight={700}
          fill="#1A1A1A"
          fontFamily="Poppins, sans-serif"
        >
          {selezionato ? selezionato.stagione : "Scegli"}
        </text>
        <text
          x={CX}
          y={CY + 12}
          textAnchor="middle"
          fontSize="10"
          fill="#6B6B6B"
          className="capitalize"
          fontFamily="Manrope, sans-serif"
        >
          {selezionato ? selezionato.tipo : "la stagione"}
        </text>

        {/* Etichette degli assi, come nel PDF */}
        <text x={CX} y={14} textAnchor="middle" fontSize="9" fill="#6B6B6B">
          Intensità alta
        </text>
        <text x={CX} y={392} textAnchor="middle" fontSize="9" fill="#6B6B6B">
          Intensità bassa
        </text>
        <text x={6} y={CY} textAnchor="start" fontSize="9" fill="#6B6B6B">
          Freddo
        </text>
        <text x={394} y={CY} textAnchor="end" fontSize="9" fill="#6B6B6B">
          Caldo
        </text>
      </svg>

      <p className="text-xs text-slate mt-2">
        Tocca uno spicchio per selezionare la stagione colore.
      </p>
    </div>
  );
}
