"use client";

import CallToAction from "@/components/call-to-action";
import { CategoriesCarousel, Category } from "@/components/categories-carousel";
import { Hero } from "@/components/hero";
import { PopularMovies } from "@/components/popular-movies";
import { useEffect, useState } from "react";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_TMDB_API_URL;
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/genre/movie/list?language=pt-BR`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        });
        const data = await res.json();
        setCategories(data.genres);
        localStorage.setItem("categories", JSON.stringify(data.genres));
      } catch (err) {
        console.error("Erro ao buscar filmes:", err);
      }
    };

    if (API_URL && API_KEY && categories.length === 0) {
      fetchCategories();
    }
  }, []);

  return (
    <div className="font-sans flex flex-1 flex-col items-center justify-center h-full pb-20 gap-16">
      <Hero />

      <div className="w-full max-w-7xl space-y-9 mt-12 px-2">
        <CategoriesCarousel categories={categories} />

        <PopularMovies />

        <CallToAction />
      </div>
    </div>
  );
}
