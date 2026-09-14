import Image from "next/image";

export default function DiagrammaViso() {
  return (
    <div className="max-w-[460px] mx-auto">
      <Image
        src="/diagramma-viso.png"
        alt="Diagramma del viso con le porzioni superiore, media, inferiore e la lunghezza del viso"
        width={912}
        height={708}
        className="w-full h-auto"
      />
    </div>
  );
}
