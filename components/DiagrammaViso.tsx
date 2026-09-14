export default function DiagrammaViso() {
  return (
    <svg width="100%" viewBox="0 0 520 460" className="max-w-[460px] mx-auto">
      {[60, 120, 180, 240, 300, 360, 420].map((x) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="420" stroke="#F0F0F0" strokeWidth="1" />
      ))}
      {[0, 60, 120, 180, 240, 300, 360, 420].map((y) => (
        <line key={`h${y}`} x1="0" y1={y} x2="460" y2={y} stroke="#F0F0F0" strokeWidth="1" />
      ))}

      <line x1="20" y1="140" x2="440" y2="140" stroke="#D8D8D8" strokeWidth="1" />
      <line x1="20" y1="260" x2="440" y2="260" stroke="#D8D8D8" strokeWidth="1" />
      <line x1="20" y1="380" x2="440" y2="380" stroke="#D8D8D8" strokeWidth="1" />

      <path
        d="M 195 18 C 195 2 265 2 265 18 C 265 30 195 30 195 18 Z"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="2"
      />

      <path
        d="M 110 150
           C 100 70 150 32 230 30
           C 310 32 360 70 350 150
           C 340 130 320 118 296 118
           C 296 100 280 90 230 90
           C 180 90 164 100 164 118
           C 140 118 120 130 110 150 Z"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="2"
      />

      <path
        d="M 118 148
           C 112 210 116 290 140 340
           C 160 378 195 404 230 404
           C 265 404 300 378 320 340
           C 344 290 348 210 342 148"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="2"
      />

      <path
        d="M 116 200 C 100 200 96 232 112 244 C 118 248 122 244 120 236"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="1.5"
      />
      <path
        d="M 344 200 C 360 200 364 232 348 244 C 342 248 338 244 340 236"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="1.5"
      />

      <path
        d="M 148 214 C 162 200 190 198 208 210 C 194 206 168 208 148 214 Z"
        fill="#1A1A1A"
      />
      <path
        d="M 312 214 C 298 200 270 198 252 210 C 266 206 292 208 312 214 Z"
        fill="#1A1A1A"
      />

      <path
        d="M 152 232 C 165 222 195 222 210 232 C 195 240 165 240 152 232 Z"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="1.4"
      />
      <path d="M 205 228 C 213 224 219 224 224 227" fill="none" stroke="#1A1A1A" strokeWidth="1.4" />
      <circle cx="181" cy="232" r="7" fill="none" stroke="#1A1A1A" strokeWidth="1.2" />
      <circle cx="181" cy="232" r="3" fill="#1A1A1A" />

      <path
        d="M 308 232 C 295 222 265 222 250 232 C 265 240 295 240 308 232 Z"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="1.4"
      />
      <path d="M 255 228 C 247 224 241 224 236 227" fill="none" stroke="#1A1A1A" strokeWidth="1.4" />
      <circle cx="279" cy="232" r="7" fill="none" stroke="#1A1A1A" strokeWidth="1.2" />
      <circle cx="279" cy="232" r="3" fill="#1A1A1A" />

      <path
        d="M 222 240 C 218 264 214 280 220 288 C 226 292 234 292 240 288 C 246 280 242 264 238 240"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="1.3"
      />

      <path
        d="M 190 322 C 208 314 218 314 230 318 C 242 314 252 314 270 322
           C 254 330 244 332 230 332 C 216 332 206 330 190 322 Z"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="1.4"
      />
      <path d="M 190 322 C 208 330 252 330 270 322" fill="none" stroke="#1A1A1A" strokeWidth="1" />

      <line x1="196" y1="400" x2="192" y2="440" stroke="#1A1A1A" strokeWidth="1.6" />
      <line x1="264" y1="400" x2="268" y2="440" stroke="#1A1A1A" strokeWidth="1.6" />

      <g fontFamily="Poppins, sans-serif" fontSize="12" fontWeight={700} fill="#1A1A1A">
        <text x="465" y="105" writingMode="vertical-rl">SUPERIORE</text>
        <text x="465" y="215" writingMode="vertical-rl">MEDIA</text>
        <text x="465" y="335" writingMode="vertical-rl">INFERIORE</text>
      </g>
      <g fontFamily="Manrope, sans-serif" fontSize="9" fill="#6B6B6B">
        <text x="450" y="105" writingMode="vertical-rl">cm</text>
        <text x="450" y="220" writingMode="vertical-rl">cm</text>
        <text x="450" y="340" writingMode="vertical-rl">cm</text>
      </g>

      <line x1="445" y1="0" x2="445" y2="140" stroke="#1A1A1A" strokeWidth="1" />
      <line x1="445" y1="140" x2="445" y2="260" stroke="#1A1A1A" strokeWidth="1" />
      <line x1="445" y1="260" x2="445" y2="380" stroke="#1A1A1A" strokeWidth="1" />

      <line x1="500" y1="10" x2="500" y2="380" stroke="#1A1A1A" strokeWidth="1" />
      <text
        x="512"
        y="195"
        writingMode="vertical-rl"
        fontFamily="Poppins, sans-serif"
        fontSize="11"
        fontWeight={700}
        fill="#1A1A1A"
      >
        LUNGHEZZA VISO
      </text>

      <text x="0" y="432" fontFamily="Poppins, sans-serif" fontSize="13" fontWeight={700} fill="#1A1A1A">
        OCCHIO
      </text>
      <line x1="0" y1="452" x2="400" y2="452" stroke="#1A1A1A" strokeWidth="1" />
      {[0, 80, 160, 240, 320, 400].map((x) => (
        <line key={x} x1={x} y1="446" x2={x} y2="452" stroke="#1A1A1A" strokeWidth="1" />
      ))}
      {[40, 120, 200, 280, 360].map((x) => (
        <text
          key={x}
          x={x}
          y="446"
          textAnchor="middle"
          fontFamily="Manrope, sans-serif"
          fontSize="9"
          fill="#6B6B6B"
        >
          cm
        </text>
      ))}
    </svg>
  );
}
