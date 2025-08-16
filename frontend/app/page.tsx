"use client";

import { CategoriesCarousel } from "@/components/categories-carousel";
import { Hero } from "@/components/hero";
import { Button } from "@/components/ui/button";
import { LucideImageOff, LucideInfo } from "lucide-react";
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
    <div className="font-sans flex flex-1 flex-col items-center justify-center h-full pb-20 gap-16">
      <Hero />

      <div className="w-full max-w-7xl space-y-9 mt-12 px-2">
        <CategoriesCarousel />

        <div className="w-full flex justify-between items-center px-4 sm:px-0 mb-8">
          <div className="w-full">
            <h2 className="text-2xl font-bold text-primary text-center xl:text-left w-full">
              Explore as recomendações
            </h2>
            <p className="hidden xl:block text-zinc-400 text-sm  text-left w-full">
              Navegue pelas recomendações para encontrar filmes que se encaixam
              no seu gosto. Clique na seta para ver mais opções.
            </p>
          </div>
        </div>
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
