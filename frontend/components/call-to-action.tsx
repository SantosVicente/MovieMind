import React from "react";
import Link from "next/link";
import { LucidePlay } from "lucide-react";
import { Button } from "@/components/ui/button";

const CallToAction: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg bg-gradient-to-b from-[#2a1850] via-[#3a256a] to-[#2a1850] p-10 flex flex-col items-center justify-center min-h-[340px]">
      {/* Waves Background */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 800 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ zIndex: 0 }}
      >
        <path
          d="M0 220 Q200 300 400 220 T800 220 V340 H0 Z"
          fill="#3a256a"
          opacity="0.5"
        />
        <path
          d="M0 260 Q200 340 400 260 T800 260 V340 H0 Z"
          fill="#2a1850"
          opacity="0.7"
        />
        <path
          d="M0 180 Q200 260 400 180 T800 180 V340 H0 Z"
          fill="#5b3fae"
          opacity="0.4"
        />
      </svg>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center drop-shadow-lg">
          Não encontrou o que procurava?
        </h2>
        <p className="text-sm sm:text-lg text-gray-300 text-center max-w-xl">
          Não se preocupe, estamos aqui para ajudar! Utilize a nossa busca
          avançada para encontrar filmes que se encaixem no seu gosto.
        </p>
        <Button
          asChild
          className="flex items-center gap-2 py-7 px-6 w-full sm:w-[70%] xl:w-2/4 text-lg font-semibold bg-primary hover:bg-primary/90 transition-colors duration-200"
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

export default CallToAction;
