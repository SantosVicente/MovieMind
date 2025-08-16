import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import React from "react";
import Image from "next/image";
import { LucideArrowRight } from "lucide-react";

const categories = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 14,
    name: "Fantasy",
  },
  {
    id: 36,
    name: "History",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science Fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 10752,
    name: "War",
  },
  {
    id: 37,
    name: "Western",
  },
];

const translateCategory = (id: number) => {
  const translations: { [key: number]: string } = {
    28: "Ação",
    12: "Aventura",
    16: "Animação",
    35: "Comédia",
    80: "Crime",
    99: "Documentário",
    18: "Drama",
    10751: "Família",
    14: "Fantasia",
    36: "História",
    27: "Terror",
    10402: "Música",
    9648: "Mistério",
    10749: "Romance",
    878: "Ficção Científica",
    10770: "Filme para TV",
    53: "Suspense",
    10752: "Guerra",
    37: "Faroeste",
  };
  return translations[id] || id;
};

export const CategoriesCarousel = () => {
  return (
    <div className="flex flex-col items-center justify-center py-4 ">
      <div className="w-full flex justify-between items-center px-4 sm:px-0 mb-8">
        <div className="w-full">
          <h2 className="text-2xl font-bold text-primary text-center xl:text-left w-full">
            Descubra por categorias
          </h2>
          <p className="hidden xl:block text-zinc-400 text-sm  text-left w-full">
            Navegue pelas categorias para encontrar filmes que se encaixam no
            seu gosto. Clique na seta para ver mais opções.
          </p>
        </div>
      </div>

      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full relative "
      >
        <div className="hidden xl:flex items-center gap-2 absolute top-0 right-10 -translate-y-12">
          <CarouselPrevious className="text-zinc-100" />
          <CarouselNext className="text-zinc-100" />
        </div>
        <CarouselContent>
          {categories.map((category) => (
            <CarouselItem key={category.id} className="basis-1/2 lg:basis-1/5">
              <div className="p-0">
                <Card className="aspect-square  rounded-xl flex flex-col items-center justify-between shadow-md">
                  <CardContent className="flex w-full flex-col items-center justify-center px-6">
                    {/* Imagem centralizada com shadow */}
                    <div className="aspect-square w-full flex items-center justify-center  bg-zinc-800 shadow-lg">
                      {/* Placeholder para imagem, substitua pelo src real se houver */}
                      {/*<Image
                        src={`/categories/${category.id}.png`}
                        alt={category.name}
                        className="w-12 h-12 object-contain"
                      />8*/}
                    </div>
                    {/* Nome traduzido + seta */}
                    <div className="mt-2 flex items-center justify-between w-full">
                      <span
                        className={`text-zinc-100 font-medium ${
                          category.id === 878
                            ? "text-xs my-[2px] md:text-sm md:my-0"
                            : "text-sm"
                        }`}
                      >
                        {translateCategory(category.id)}
                      </span>
                      <Link
                        href={`/categories/${category.id}`}
                        className="text-zinc-100"
                      >
                        <LucideArrowRight size={18} />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
