export default function DiagrammaViso() {
  return (
    <svg width="100%" viewBox="0 0 300 380" className="max-w-[260px] mx-auto">
      {/* Linee guida orizzontali */}
      <line x1="20" y1="120" x2="280" y2="120" stroke="#E4E4E4" strokeDasharray="4 4" />
      <line x1="20" y1="220" x2="280" y2="220" stroke="#E4E4E4" strokeDasharray="4 4" />
      <line x1="20" y1="320" x2="280" y2="320" stroke="#E4E4E4" strokeDasharray="4 4" />

      {/* Etichette porzioni */}
      <text x="285" y="105" fontSize="9" fill="#6B6B6B" writingMode="vertical-rl">
        SUPERIORE
      </text>
      <text x="285" y="200" fontSize="9" fill="#6B6B6B" writingMode="vertical-rl">
        MEDIA
      </text>
      <text x="285" y="300" fontSize="9" fill="#6B6B6B" writingMode="vertical-rl">
        INFERIORE
      </text>

      {/* Chioma */}
      <path
        d="M 90 110 C 90 60 210 60 210 110 L 210 130 L 90 130 Z"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="1.5"
      />

      {/* Ovale viso */}
      <path
        d="M 90 125
           C 85 180, 88 250, 105 290
           C 118 315, 140 328, 150 328
           C 160 328, 182 315, 195 290
           C 212 250, 215 180, 210 125"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="1.5"
      />

      {/* Orecchie */}
      <path d="M 88 165 C 78 165 76 190 88 195" fill="none" stroke="#1A1A1A" strokeWidth="1.3" />
      <path d="M 212 165 C 222 165 224 190 212 195" fill="none" stroke="#1A1A1A" strokeWidth="1.3" />

      {/* Sopracciglia */}
      <path d="M 105 178 Q 118 170 132 178" fill="none" stroke="#1A1A1A" strokeWidth="1.3" />
      <path d="M 168 178 Q 182 170 195 178" fill="none" stroke="#1A1A1A" strokeWidth="1.3" />

      {/* Occhi */}
      <ellipse cx="119" cy="190" rx="11" ry="5" fill="none" stroke="#1A1A1A" strokeWidth="1.2" />
      <circle cx="119" cy="190" r="2" fill="#1A1A1A" />
      <ellipse cx="181" cy="190" rx="11" ry="5" fill="none" stroke="#1A1A1A" strokeWidth="1.2" />
      <circle cx="181" cy="190" r="2" fill="#1A1A1A" />

      {/* Naso */}
      <path d="M 148 195 C 146 212 144 222 150 226 C 154 222 154 216 152 195" fill="none" stroke="#1A1A1A" strokeWidth="1.2" />

      {/* Bocca */}
      <path d="M 130 250 Q 150 260 170 250" fill="none" stroke="#1A1A1A" strokeWidth="1.3" />

      {/* Linea verticale lunghezza */}
      <line x1="255" y1="65" x2="255" y2="320" stroke="#E4E4E4" />
      <text x="262" y="195" fontSize="9" fill="#6B6B6B" writingMode="vertical-rl">
        LUNGHEZZA VISO
      </text>
    </svg>
  );
}
