"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, LucideArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Category } from "@/components/categories-carousel";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

export default function CategoryPage() {
  const { id } = useParams(); // pega o id da URL
  const [movies, setMovies] = useState<Movie[]>([]);
  const [categoryName, setCategoryName] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const API_URL = process.env.NEXT_PUBLIC_TMDB_API_URL;
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  // Busca filmes da categoria
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${API_URL}/discover/movie?include_adult=false&include_video=false&language=pt-BR&page=${page}&with_genres=${id}&sort_by=popularity.desc`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${API_KEY}`,
            },
          }
        );
        const data = await res.json();
        setMovies(data.results || []);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        console.error("Erro ao buscar filmes:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategoryName = async () => {
      try {
        const res = await fetch(`${API_URL}/genre/movie/list?language=pt-BR`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        });
        const data = await res.json();
        const category = data.genres.find((g: Category) => {
          return g.id.toString() === id;
        });
        if (category) setCategoryName(category.name);
      } catch (err) {
        console.error("Erro ao buscar nome da categoria:", err);
      }
    };

    if (API_URL && API_KEY && id) {
      fetchMovies();
      fetchCategoryName();
    }
  }, [id, page]);

  return (
    <div className="flex flex-col items-center justify-center py-8 ">
      <div className="w-full max-w-7xl flex flex-col gap-4 px-4 sm:px-0 mb-8">
        <h1 className="text-3xl font-bold text-primary text-center xl:text-left">
          {categoryName ? `Filmes de ${categoryName}` : "Carregando..."}
        </h1>
        <p className="hidden xl:block text-zinc-400 text-sm text-left">
          Confira os principais filmes desta categoria selecionada.
        </p>
      </div>

      {/* GRID de filmes */}
      {loading ? (
        <p className="text-zinc-400 text-center">Carregando filmes...</p>
      ) : (
        <div className="w-full max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4">
          {movies.length === 0 && (
            <p className="text-zinc-400 col-span-full text-center">
              Nenhum filme encontrado nesta categoria.
            </p>
          )}

          {movies.map((movie) => (
            <Link key={movie.id} href={`/movies/${movie.id}`} className="p-0">
              <Card className="rounded-xl py-3 flex flex-col items-center justify-between shadow-md bg-zinc-900 hover:border hover:border-primary transition-all duration-200 h-full">
                <CardContent className="flex w-full flex-col items-center justify-center px-3">
                  {/* Poster */}
                  {movie.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      width={300}
                      height={450}
                      className="rounded-lg object-cover w-full h-[220px] sm:h-[280px] shadow-lg"
                    />
                  ) : (
                    <div className="w-full h-[220px] sm:h-[280px] flex items-center justify-center bg-zinc-700 text-white rounded-lg">
                      Sem imagem
                    </div>
                  )}

                  {/* Infos */}
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
                    {new Date(movie.release_date).toLocaleDateString("pt-BR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="flex gap-4 mt-8">
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1 || loading}
          variant="outline"
        >
          <ChevronLeft size={18} />
        </Button>
        <span className="text-sm text-zinc-400 self-center">
          Página {page} de {totalPages}
        </span>
        <Button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages || loading}
          variant="outline"
        >
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
}
