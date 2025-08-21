"use client";

import Image from "next/image";
import Logo from "@/app/icon.png";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LucideMenu, LucideSearch } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { useEffect, useState } from "react";
import { Category } from "./categories-carousel";

export const Header = () => {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if (search.trim() !== "") {
      router.push(`/explore?q=${encodeURIComponent(search)}`);
    } else {
      router.push(`/explore`);
    }
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState<boolean>(false);
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

  const handleClose = () => setOpen(false);

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-accent">
      <Link href="/" className="flex items-center gap-2">
        <Image
          className="select-none"
          src={Logo}
          alt="MovieMind Logo"
          width={40}
          height={40}
          draggable={false}
        />
        <h1 className="text-2xl font-bold select-none">MovieMind</h1>
      </Link>

      <div className="flex md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="cursor-pointer p-2">
            <LucideMenu size={30} className="text-zinc-100" />
          </SheetTrigger>
          <SheetContent
            className="w-full bg-zinc-900 text-white"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <SheetHeader>
              <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
            </SheetHeader>

            <div className="flex items-center gap-2 mt-4 px-8">
              <Input
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 bg-zinc-800 text-white border-zinc-700"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  handleSearch();
                  handleClose();
                }}
              >
                <LucideSearch className="w-5 h-5 text-zinc-400" />
              </Button>
            </div>

            <nav className="flex flex-col mt-6 space-y-3 px-8">
              <Link
                href="/"
                className="hover:text-zinc-200 text-zinc-400"
                onClick={handleClose}
              >
                Home
              </Link>

              <div>
                <h3 className="text-sm font-semibold text-zinc-300 mb-2">
                  Gêneros
                </h3>
                <ul className="grid grid-cols-2 gap-2">
                  {categories.length === 0 && (
                    <li className="col-span-2">
                      <p className="text-zinc-400">
                        Nenhuma categoria encontrada.
                      </p>
                    </li>
                  )}
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/genres/${category.id}`}
                        className="block px-2 py-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-sm"
                        onClick={handleClose}
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/about"
                className="hover:text-zinc-200 text-zinc-400 mt-2"
                onClick={handleClose}
              >
                Sobre
              </Link>
              <Link
                href="/contact"
                className="hover:text-zinc-200 text-zinc-400"
                onClick={handleClose}
              >
                Contato
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      <nav className="hidden md:flex flex-1 justify-center">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/"
                  className="text-lg font-medium text-zinc-400 hover:text-zinc-200 px-3 py-2"
                >
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-zinc-400 hover:text-zinc-200">
                Gêneros
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-zinc-900 text-white ">
                <ul className="grid grid-cols-4 gap-2 min-w-[600px]">
                  {categories.length === 0 && (
                    <li className="col-span-4">
                      <p className="text-zinc-400">
                        Nenhuma categoria encontrada.
                      </p>
                    </li>
                  )}
                  {categories.map((category) => (
                    <li key={category.id}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={`/genres/${category.id}`}
                          className="block px-4 py-2 hover:bg-zinc-800"
                        >
                          {category.name}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/about"
                  className="text-lg font-medium text-zinc-400 hover:text-zinc-200 px-3 py-2"
                >
                  Sobre
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/contact"
                  className="text-lg font-medium text-zinc-400 hover:text-zinc-200 px-3 py-2"
                >
                  Contato
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      <div className="hidden md:flex items-center gap-2">
        <Input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="w-40 bg-zinc-800 text-white border-zinc-700"
        />
        <Link href="/explore">
          <Button size="icon" variant="ghost" onClick={handleSearch}>
            <LucideSearch className="w-5 h-5 text-zinc-400" />
          </Button>
        </Link>
      </div>
    </header>
  );
};
