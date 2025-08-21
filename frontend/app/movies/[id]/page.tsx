"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  original_title: string;
  backdrop_path: string | null;
  original_language: string;
  runtime: number;
  status: string;
  budget: number;
  revenue: number;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
  production_countries: { id: number; name: string }[];
  homepage?: string;
}

interface Review {
  id: string;
  author: string;
  content: string;
}

export default function MoviePage() {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const API_URL = process.env.NEXT_PUBLIC_TMDB_API_URL;
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  // Busca detalhes do filme
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`${API_URL}/movie/${id}?language=pt-BR`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        });
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error("Erro ao buscar filme:", err);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `${API_URL}/movie/${id}/reviews?language=pt-BR&page=${page}`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${API_KEY}`,
            },
          }
        );
        const data = await res.json();
        setReviews(data.results);
        setTotalPages(data.total_pages);
      } catch (err) {
        console.error("Erro ao buscar reviews:", err);
      }
    };

    if (API_URL && API_KEY && id) {
      fetchMovie();
      fetchReviews();
    }
  }, [id, page]);

  console.log(movie);

  if (!movie) {
    return (
      <div className="flex justify-center items-center h-screen text-zinc-300">
        Carregando detalhes do filme...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6 mb-12">
        {movie.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            width={400}
            height={600}
            className="rounded-xl shadow-lg object-cover"
          />
        ) : (
          <div className="w-[400px] h-[600px] flex items-center justify-center bg-zinc-700 text-white rounded-xl">
            Sem imagem
          </div>
        )}

        <div className="flex flex-col gap-4 text-zinc-200">
          <h1 className="text-4xl font-bold text-primary">{movie.title}</h1>
          <p className="text-zinc-400">
            Lançamento:{" "}
            {new Date(movie.release_date).toLocaleDateString("pt-BR")}
          </p>
          <p className="text-zinc-400">⭐ {movie.vote_average.toFixed(1)}</p>
          <div className="flex gap-2 flex-wrap">
            {movie.genres.map((genre) => (
              <Link key={genre.id} href={`/categories/${genre.id}`}>
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">
                  {genre.name}
                </span>
              </Link>
            ))}
          </div>
          <p className="text-zinc-300 leading-relaxed">{movie.overview}</p>

          <div className="mt-6 bg-zinc-900/40 rounded-xl p-6 text-zinc-300 shadow-md">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              Ficha Técnica
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <p>
                <span className="font-medium text-zinc-100">
                  Título Original:
                </span>{" "}
                {movie.original_title}
              </p>
              <p>
                <span className="font-medium text-zinc-100">
                  Idioma Original:
                </span>{" "}
                {movie.original_language.toUpperCase()}
              </p>
              <p>
                <span className="font-medium text-zinc-100">Duração:</span>{" "}
                {movie.runtime ? `${movie.runtime} min` : "Não informado"}
              </p>
              <p>
                <span className="font-medium text-zinc-100">Status:</span>{" "}
                {movie.status}
              </p>
              <p>
                <span className="font-medium text-zinc-100">Orçamento:</span>{" "}
                {movie.budget > 0
                  ? `$${movie.budget.toLocaleString()}`
                  : "Não informado"}
              </p>
              <p>
                <span className="font-medium text-zinc-100">Receita:</span>{" "}
                {movie.revenue > 0
                  ? `$${movie.revenue.toLocaleString()}`
                  : "Não informado"}
              </p>
              {movie.production_countries?.length > 0 && (
                <p>
                  <span className="font-medium text-zinc-100">Países:</span>{" "}
                  {movie.production_countries
                    .map((c: { id: number; name: string }) => c.name)
                    .join(", ")}
                </p>
              )}
              {movie.production_companies?.length > 0 && (
                <p className="col-span-2">
                  <span className="font-medium text-zinc-100">Produtoras:</span>{" "}
                  {movie.production_companies
                    .map(
                      (c: {
                        id: number;
                        name: string;
                        logo_path: string | null;
                      }) => c.name
                    )
                    .join(", ")}
                </p>
              )}
              {movie.homepage && (
                <p className="col-span-2">
                  <span className="font-medium text-zinc-100">
                    Site Oficial:
                  </span>{" "}
                  <a
                    href={movie.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {movie.homepage}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-8 max-w-7xl" />

      <div className="w-full max-w-6xl flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-primary">Reviews</h2>

        {reviews.length === 0 && (
          <p className="text-zinc-400">Nenhum review encontrado.</p>
        )}

        {reviews.map((review) => (
          <Card key={review.id} className="bg-zinc-900 shadow-md">
            <CardContent className="p-4">
              <p className="text-sm text-zinc-400 mb-2">
                Autor: {review.author}
              </p>
              <p className="text-zinc-200 text-sm">{review.content}</p>
            </CardContent>
          </Card>
        ))}

        {reviews.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-4">
            <Button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              variant="outline"
            >
              <ChevronLeft size={18} />
            </Button>
            <span className="text-zinc-300">
              Página {page} de {totalPages}
            </span>
            <Button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              variant="outline"
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
