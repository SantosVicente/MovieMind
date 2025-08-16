"use client";

import { CategoriesCarousel } from "@/components/categories-carousel";
import { Hero } from "@/components/hero";
import { PopularMovies } from "@/components/popular-movies";
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

        <PopularMovies />
      </div>
    </div>
  );
}
