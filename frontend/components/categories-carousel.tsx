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
import { Progress } from "@/components/ui/progress";
import React, { useEffect, useState } from "react";
import {
  LucideArrowRight,
  LucideZap,
  LucideCompass,
  LucideFilm,
  LucideSmile,
  LucideShield,
  LucideBookOpen,
  LucideUsers,
  LucideStar,
  LucideGhost,
  LucideMusic,
  LucideSearch,
  LucideHeart,
  LucideRocket,
  LucideTv,
  LucideAlertTriangle,
  LucideSword,
  LucideLandmark,
  LucideFeather,
  LucideArchive,
} from "lucide-react";
import { count } from "console";

const categoryIcons = {
  28: <LucideZap size={70} />, // Ação
  12: <LucideCompass size={70} />, // Aventura
  16: <LucideFilm size={70} />, // Animação
  35: <LucideSmile size={70} />, // Comédia
  80: <LucideShield size={70} />, // Crime
  99: <LucideBookOpen size={70} />, // Documentário
  18: <LucideUsers size={70} />, // Drama
  10751: <LucideStar size={70} />, // Família
  14: <LucideGhost size={70} />, // Fantasia
  36: <LucideLandmark size={70} />, // História
  27: <LucideAlertTriangle size={70} />, // Terror
  10402: <LucideMusic size={70} />, // Música
  9648: <LucideSearch size={70} />, // Mistério
  10749: <LucideHeart size={70} />, // Romance
  878: <LucideRocket size={70} />, // Ficção científica
  10770: <LucideTv size={70} />, // Cinema TV
  53: <LucideArchive size={70} />, // Thriller
  10752: <LucideSword size={70} />, // Guerra
  37: <LucideFeather size={70} />, // Faroeste
};

export interface Category {
  id: number;
  name: string;
}

interface CategoriesCarouselProps {
  categories: Category[];
}

export const CategoriesCarousel = ({ categories }: CategoriesCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const progress = count > 1 ? (current * 100) / count : 0;

  useEffect(() => {
    if (!api) return;

    const update = () => {
      setCurrent(api.selectedScrollSnap() + 1);
      setCount(api.scrollSnapList().length);
    };

    update();

    api.on("select", update);

    return () => {
      api.off("select", update);
    };
  }, [api]);

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
        className="w-full relative"
        setApi={setApi}
      >
        <div className="hidden xl:flex items-center justify-center w-[12rem] rounded-sm bg-zinc-900 h-10 gap-4 absolute top-0 right-0 -translate-y-18">
          <CarouselPrevious className="text-zinc-100 rounded-sm left-2 cursor-pointer" />
          <Progress value={progress} className="w-24 mx-12" />
          <CarouselNext className="text-zinc-100 rounded-sm right-2 cursor-pointer" />
        </div>
        <CarouselContent>
          {categories.length === 0 && (
            <div className="flex items-center justify-center w-full py-12">
              <p className="text-zinc-400">Nenhuma categoria encontrada.</p>
            </div>
          )}
          {categories.map((category) => (
            <CarouselItem
              key={category.id}
              className="basis-1/2 md:basis-1/3 lg:basis-1/5"
            >
              <Link href={`/categories/${category.id}`} className="p-0">
                <Card className="aspect-square rounded-xl flex flex-col items-center justify-between shadow-md hover:border hover:border-primary transition-all duration-200 bg-zinc-900">
                  <CardContent className="flex w-full flex-col items-center justify-center px-6">
                    {/* Imagem centralizada com shadow */}
                    <div className="aspect-square w-full flex items-center justify-center">
                      <div className="text-primary">
                        {categoryIcons[
                          category.id as keyof typeof categoryIcons
                        ] || <LucideFilm />}
                      </div>
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
                        {category.name}
                      </span>
                      <div className="text-zinc-100">
                        <LucideArrowRight size={18} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
