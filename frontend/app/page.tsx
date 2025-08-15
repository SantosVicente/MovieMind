"use client";

import { Button } from "@/components/ui/button";
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
    <div className="font-sans flex flex-1 flex-col items-center justify-center h-full p-8 pb-20 gap-16 sm:p-20">
      <div className="flex flex-col gap-[32px] items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center">Welcome to MovieMind</h1>
        <p className="text-lg text-center">
          Your personal movie recommendation system.
        </p>
        <Button
          onClick={() => {
            console.log(movies);
          }}
        >
          Get Started
        </Button>

        {movies.length === 0 && <p>No movies found.</p>}

        {movies.map((movie) => (
          <div
            key={movie.id}
            className="bg-white rounded-lg shadow-md p-6 w-full max-w-md flex flex-col gap-2 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-900">
              {movie.title}
            </h2>
            <p className="text-gray-600">{movie.genre}</p>
            <p className="text-gray-500 text-sm">
              Released: {movie.releaseYear}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
