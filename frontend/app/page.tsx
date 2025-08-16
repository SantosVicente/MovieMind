"use client";

import { Button } from "@/components/ui/button";
import { LucideImageOff, LucideInfo, LucidePlay } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface DataType {
  id: number;
  title: string;
  genre: string;
  releaseYear: number;
}

export default function Home() {
  const [movies, setMovies] = useState<DataType[]>([]);

  useEffect(() => {
    const data: DataType[] = [
      {
        id: 1,
        title: "Inception",
        genre: "Sci-Fi",
        releaseYear: 2010,
      },
      {
        id: 2,
        title: "The Dark Knight",
        genre: "Action",
        releaseYear: 2008,
      },
      {
        id: 3,
        title: "Interstellar",
        genre: "Sci-Fi",
        releaseYear: 2014,
      },
    ];
    setMovies(data);
  }, []);

  return (
    <div className="font-sans flex flex-1 flex-col items-center justify-center h-full pb-20 gap-16 sm:p-20">
      <div className="flex flex-col h-full items-center w-full sm:items-start">
        <div className="relative w-full h-[450px]">
          {/* Imagem de fundo */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/Container.svg')" }}
          />

          {/* Gradiente em cima */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/100" />

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
          <p className="text-sm text-zinc-400 font-medium text-center">
            Descubra novos filmes, explore e receba sugestões personalizadas que
            se alinham com seus gostos e interesses através de um sistema de
            recomendação inteligente.
          </p>

          <Button
            onClick={() => {
              console.log(movies);
            }}
            className="flex items-center gap-2 px-6 py-7 w-[60%] text-lg font-semibold bg-primary hover:bg-primary/90 transition-colors duration-200"
          >
            <LucidePlay />
            Comece a Explorar
          </Button>
        </div>
      </div>

      <div className="w-full max-w-5xl mt-12 px-8">
        <h2 className="text-2xl font-bold mb-6 text-primary text-center">
          Explore as recomendações
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-zinc-900 rounded-xl shadow-lg p-6 flex flex-col items-start border border-zinc-800 hover:border-primary transition-colors"
            >
              <h3 className="text-xl font-semibold text-primary mb-2">
                {movie.title}
              </h3>

              {/* simulação de imagem */}
              <div className="w-full h-40 bg-zinc-800 rounded-md mb-4 flex items-center justify-center">
                <LucideImageOff size={90} />
              </div>

              <span className="text-zinc-400 text-sm mb-1">
                Gênero: <span className="text-zinc-200">{movie.genre}</span>
              </span>
              <span className="text-zinc-400 text-sm">
                Ano: <span className="text-zinc-200">{movie.releaseYear}</span>
              </span>
              <Button className="mt-4 bg-primary text-white hover:bg-primary/90 w-full">
                <LucideInfo className="mr-2" size={18} />
                Ver Informações
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
