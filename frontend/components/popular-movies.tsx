"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LucideArrowRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Progress } from "./ui/progress";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

export const PopularMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_TMDB_API_URL;
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const progress = count > 0 ? (current * 100) / count : 0;

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

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(
          `${API_URL}/discover/movie?include_adult=false&include_video=false&language=pt-BR&page=1&sort_by=popularity.desc`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${API_KEY}`,
            },
          }
        );
        const data = await res.json();
        setMovies(data.results);
      } catch (err) {
        console.error("Erro ao buscar filmes:", err);
      }
    };

    if (API_URL && API_KEY && movies.length === 0) {
      fetchMovies();
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-4 ">
      <div className="w-full flex justify-between items-center px-4 sm:px-0 mb-8">
        <div className="w-full">
          <h2 className="text-2xl font-bold text-primary text-center xl:text-left w-full">
            Filmes Populares
          </h2>
          <p className="hidden xl:block text-zinc-400 text-sm text-left w-full">
            Navegue pelos mais assistidos do momento para encontrar filmes que
            se encaixam no seu gosto.
          </p>
        </div>
      </div>

      <Carousel
        opts={{ align: "start" }}
        className="w-full relative"
        setApi={setApi}
      >
        <div className="hidden xl:flex items-center justify-center w-[12rem] rounded-sm bg-zinc-900 h-10 gap-4 absolute top-0 right-0 -translate-y-18">
          <CarouselPrevious className="text-zinc-100 rounded-sm left-2 cursor-pointer" />
          <Progress value={progress} className="w-24 mx-12" />
          <CarouselNext className="text-zinc-100 rounded-sm right-2 cursor-pointer" />
        </div>

        <CarouselContent>
          {movies.length === 0 && (
            <div className="flex items-center justify-center w-full py-12">
              <p className="text-zinc-400">Nenhum filme encontrado.</p>
            </div>
          )}

          {movies.map((movie) => (
            <CarouselItem
              key={movie.id}
              className="basis-1/2 md:basis-1/3 lg:basis-1/5"
            >
              <Link href={`/movies/${movie.id}`} className="p-0">
                <Card className="rounded-xl flex flex-col items-center justify-between shadow-md bg-zinc-900 hover:border hover:border-primary transition-all duration-200">
                  <CardContent className="flex w-full flex-col items-center justify-center px-3">
                    {/* Poster do filme */}
                    {movie.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        width={300}
                        height={450}
                        className="rounded-lg object-cover w-full h-[200px] sm:h-[250px] shadow-lg"
                      />
                    ) : (
                      <div className="w-full h-[250px] flex items-center justify-center bg-zinc-700 text-white rounded-lg">
                        Sem imagem
                      </div>
                    )}

                    {/* Infos do filme */}
                    <div className="mt-2 flex items-center justify-between w-full">
                      <span className="text-zinc-100 font-medium text-sm line-clamp-1">
                        {movie.title}
                      </span>

                      <LucideArrowRight size={18} />
                    </div>
                    <p className="text-xs w-full text-zinc-400 text-left">
                      ⭐ {movie.vote_average.toFixed(1)}
                    </p>

                    <p className="text-xs w-full text-zinc-400">
                      {new Date(movie.release_date).toLocaleDateString(
                        "pt-BR",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        }
                      )}
                    </p>
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
