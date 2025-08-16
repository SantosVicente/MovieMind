import Image from "next/image";
import { Button } from "./ui/button";
import { LucidePlay } from "lucide-react";
import Link from "next/link";

export const Hero = () => {
  return (
    <div className="flex flex-col h-full items-center w-full">
      <div className="relative w-full h-[450px]">
        {/* Imagem de fundo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/Container.svg')" }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#100c0c]/20 shadow-[0_20px_40px_20px_rgba(0,0,0,0.7)] pointer-events-none" />

        {/* Conteúdo acima */}
        <div className="relative flex flex-col items-center justify-center h-full">
          <Image
            src="/logo-abstract.svg"
            alt="MovieMind"
            width={0}
            height={0}
            sizes="100vw"
            className="w-52 h-52 object-contain"
          />

          <h1 className="text-3xl mt-16 font-bold text-center">
            Seja bem-vindo ao <br />
            <span className="text-primary">MovieMind</span>
          </h1>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-10 w-full px-4 sm:w-[60%]">
        <p className="text-sm text-zinc-400 font-medium text-center md:max-w-[600px] z-10">
          Descubra novos filmes, explore e receba sugestões personalizadas que
          se alinham com seus gostos e interesses através de um sistema de
          recomendação inteligente.
        </p>

        <Button
          asChild
          className="flex items-center gap-2 px-6 py-7 w-[70%] xl:w-1/3 text-lg font-semibold bg-primary hover:bg-primary/90 transition-colors duration-200"
        >
          <Link href="/explore" className="flex items-center gap-2">
            <LucidePlay />
            <span>Comece a Explorar</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};
