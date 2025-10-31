"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  LucideLoader2,
  LucideHistory,
  LucideFilm,
  LucideArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";

interface MovieResult {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  vote_average: number;
  release_date: string;
}

interface SearchHistoryItem {
  id: number;
  description: string;
  resultsJson: string;
  createdAt: string;
}

export default function HistoryPage() {
  const { status } = useAuth();
  const router = useRouter();

  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "loading" && status !== "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchHistory = async () => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("authToken");

        if (!token) {
          setError("Erro de autenticação.");
          setIsLoading(false);
          return;
        }

        try {
          const res = await fetch("http://localhost:3004/my-history", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            throw new Error("Não foi possível carregar o histórico.");
          }

          const data: SearchHistoryItem[] = await res.json();
          setHistory(data);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message || "Ocorreu um erro.");
          } else {
            setError("Ocorreu um erro desconhecido.");
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchHistory();
    }
  }, [status]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <LucideLoader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (status !== "authenticated") {
    return null;
  }

  if (history.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl p-4 md:p-8">
        <div className="flex flex-col justify-center items-center p-16 text-center text-zinc-400">
          <LucideHistory className="w-16 h-16 mb-4" />
          <h1 className="text-2xl font-semibold text-white mb-2">
            Seu histórico está vazio
          </h1>
          <p>
            As suas buscas abstratas com IA aparecerão aqui assim que você as
            fizer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl p-4 md:p-8">
      <h1 className="text-3xl font-bold text-white mb-6">
        Histórico de Buscas
      </h1>
      <div className="flex flex-col gap-8">
        {history.map((item) => (
          <HistoryItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function HistoryItemCard({ item }: { item: SearchHistoryItem }) {
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

  let movies: MovieResult[] = [];
  try {
    movies = JSON.parse(item.resultsJson);
  } catch (e) {
    console.error("Falha ao parsear resultsJson:", e);
    return null;
  }

  return (
    <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-6">
      <h2 className="text-lg font-semibold text-primary mb-2">Sua busca:</h2>
      <p className="text-zinc-300 italic mb-4">{item.description}</p>
      <p className="text-sm text-zinc-400 mb-4">
        Em:{" "}
        {new Date(item.createdAt).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      <Separator className="bg-zinc-700 mb-4" />
      <h3 className="text-md font-semibold text-white mb-4">
        Filmes encontrados:
      </h3>
      <div className="flex w-full overflow-x-auto gap-4 p-2">
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
    </div>
  );
}
