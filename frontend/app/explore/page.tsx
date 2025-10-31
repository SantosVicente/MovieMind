"use client";

import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LucideSearch,
  LucideWand2,
  LucideLoader2,
  LucideFilm,
  LucideArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface MovieResult {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

const ABSTRACT_SEARCH_URL = "http://localhost:3004/abstract-search";

export default function Explore() {
  const searchParams = useSearchParams();
  const { status } = useAuth();
  const query = searchParams.get("q");

  const [simpleSearchQuery, setSimpleSearchQuery] = useState("");
  const [abstractSearchQuery, setAbstractSearchQuery] = useState("");
  const [results, setResults] = useState<MovieResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("simple");
  const [hasSearched, setHasSearched] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_TMDB_API_URL;
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const handleSimpleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults([]);
    setHasSearched(true);

    try {
      const res = await fetch(
        `${API_URL}/search/movie?query=${encodeURIComponent(
          searchQuery
        )}&language=pt-BR`,
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
      setResults(data.results);
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar filmes. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAbstractSearch = async () => {
    if (!abstractSearchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults([]);
    setHasSearched(true);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Você precisa estar logado para usar a busca abstrata.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(ABSTRACT_SEARCH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: abstractSearchQuery }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(
          errData.error || "A IA não conseguiu processar sua solicitação."
        );
      }

      const movies: MovieResult[] = await response.json();
      setResults(movies);

      if (movies.length === 0) {
        setError("Não encontramos filmes para essa descrição.");
      }
    } catch (err) {
      let errorMessage = "Erro ao conectar com o servidor.";
      if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
      }
      console.error("Erro na busca abstrata:", err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      setSimpleSearchQuery(query);
      setActiveTab("simple");
      handleSimpleSearch(query);
    }
  }, [query]);

  return (
    <div className="container mx-auto max-w-7xl p-4 md:p-8">
      <Tabs
        defaultValue="simple"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full "
      >
        <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto">
          <TabsTrigger value="simple" className="cursor-pointer">
            Busca Simples
          </TabsTrigger>
          <TabsTrigger
            value="abstract"
            className="flex items-center gap-2 cursor-pointer relative"
            disabled={status !== "authenticated"}
          >
            {status !== "authenticated" && (
              <p className="absolute -top-9 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg  text-pink-400 text-xs shadow-lg whitespace-nowrap z-20">
                Você precisa estar logado para usar a busca abstrata.
              </p>
            )}
            Busca Abstrata <LucideWand2 className="w-4 h-4" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="simple">
          <div className="flex w-full max-w-lg mx-auto items-center space-x-2 mt-4">
            <Input
              type="text"
              value={simpleSearchQuery}
              onChange={(e) => setSimpleSearchQuery(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSimpleSearch(simpleSearchQuery)
              }
              placeholder="Ex: 'Homem-Aranha', 'Barbie', ..."
              className="bg-zinc-800 text-white"
            />
            <Button
              onClick={() => handleSimpleSearch(simpleSearchQuery)}
              disabled={isLoading}
            >
              {isLoading ? (
                <LucideLoader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LucideSearch className="w-4 h-4" />
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="abstract">
          <div className="flex flex-col w-full max-w-lg mx-auto items-center space-y-2 mt-4">
            <Textarea
              value={abstractSearchQuery}
              onChange={(e) => setAbstractSearchQuery(e.target.value)}
              placeholder="Descreva o filme que você procura... (ex: 'um filme tipo goosebumps' ou 'aquele filme de um cara que viaja no tempo num carro e o cientista tem cabelo branco')"
              className="bg-zinc-800 text-white min-h-[100px]"
            />
            <Button
              onClick={handleAbstractSearch}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <LucideLoader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <LucideWand2 className="w-4 h-4 mr-2" />
                  Buscar com IA
                </>
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12  w-full">
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

        {!isLoading && !error && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {!isLoading && !error && results.length === 0 && hasSearched && (
          <div className="flex flex-col justify-center items-center p-16 text-center text-zinc-400">
            <LucideFilm className="w-16 h-16 mb-4" />
            <h3 className="text-xl font-semibold">Nenhum resultado</h3>
            <p>Não encontramos filmes para sua busca.</p>
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
