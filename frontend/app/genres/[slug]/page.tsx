"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { LucideLoader2, LucideFilm, LucideArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface MovieResult {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

interface Genre {
  id: number;
  name: string;
}

export default function GenrePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [movies, setMovies] = useState<MovieResult[]>([]);
  const [genreName, setGenreName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_TMDB_API_URL;
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  useEffect(() => {
    if (slug) {
      try {
        const storedCategories = localStorage.getItem("categories");
        if (storedCategories) {
          const categories: Genre[] = JSON.parse(storedCategories);
          const foundGenre = categories.find((g) => g.id.toString() === slug);
          if (foundGenre) {
            setGenreName(foundGenre.name);
          } else {
            setGenreName("Gênero Desconhecido");
          }
        } else {
          setGenreName("Gênero");
        }
      } catch (e) {
        console.error("Erro ao ler categorias do localStorage:", e);
        setGenreName("Gênero");
      }
    }
  }, [slug]);

  useEffect(() => {
    if (!slug || !API_URL || !API_KEY) {
      if (!API_URL || !API_KEY) {
        setError("Chaves de API não configuradas.");
        setIsLoading(false);
      }
      return;
    }

    const fetchMoviesByGenre = async () => {
      setIsLoading(true);
      setError(null);
      setMovies([]);

      try {
        const res = await fetch(
          `${API_URL}/discover/movie?with_genres=${slug}&language=pt-BR&page=1`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${API_KEY}`,
            },
          }
        );
        if (!res.ok) {
          throw new Error("Falha ao buscar dados do TMDB");
        }
        const data = await res.json();
        setMovies(data.results);
      } catch (err) {
        console.error(err);
        setError("Erro ao buscar filmes. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoviesByGenre();
  }, [slug, API_URL, API_KEY]);

  return (
    <div className="container mx-auto max-w-7xl p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">
        {isLoading && !genreName ? "Carregando..." : `Filmes de: ${genreName}`}
      </h1>

      <div className="mt-6 w-full">
        {isLoading && (
          <div className="flex justify-center items-center p-16">
            <LucideLoader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="flex justify-center p-16">
            <p className="text-red-500 text-center">{error}</p>
          </div>
        )}

        {!isLoading && !error && movies.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {!isLoading && !error && movies.length === 0 && (
          <div className="flex flex-col justify-center items-center p-16 text-center text-zinc-400">
            <LucideFilm className="w-16 h-16 mb-4" />
            <h3 className="text-xl font-semibold">Nenhum resultado</h3>
            <p>Não encontramos filmes para este gênero.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MovieCard({ movie }: { movie: MovieResult }) {
  return (
    <Link href={`/movies/${movie.id}`} className="p-0 h-full">
      <Card className="rounded-xl flex flex-col items-center justify-between shadow-md bg-zinc-900 hover:border hover:border-primary transition-all duration-200 h-full">
        <CardContent className="flex w-full flex-col items-center justify-center px-3">
          {movie.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={300}
              height={450}
              className="rounded-lg object-cover w-full h-[200px] sm:h-[250px] shadow-lg"
            />
          ) : (
            <div className="w-full h-[200px] sm:h-[250px] flex items-center justify-center bg-zinc-700 text-white rounded-lg">
              <LucideFilm className="w-10 h-10 text-zinc-500" />
            </div>
          )}

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
            {movie.release_date
              ? new Date(movie.release_date).toLocaleDateString("pt-BR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
              : "Sem data"}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
