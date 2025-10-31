"use client";

import Image from "next/image";
import Logo from "@/app/icon.png";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LucideMenu,
  LucideSearch,
  LucideUser,
  LucideLogOut,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { usePathname } from "next/navigation";

const BACKEND_OAUTH_URL = "http://localhost:3004/auth/google/login";
const BACKEND_ME_URL = "http://localhost:3004/me";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState("");
  const [user, setUser] = useState<UserProfile | null>(null);

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
  }, [API_URL, API_KEY, categories.length]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          const response = await fetch(BACKEND_ME_URL, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData: UserProfile = await response.json();
            setUser(userData);
          } else {
            console.error("Falha ao autenticar token. Fazendo logout.");
            localStorage.removeItem("authToken");
            setUser(null);
          }
        } catch (error) {
          console.error("Erro ao conectar ao backend:", error);
          localStorage.removeItem("authToken");
          setUser(null);
        }
      }
    };

    fetchUserProfile();
  }, [pathname]);

  const handleClose = () => setOpen(false);
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    handleClose();
    router.push("/");
  };

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

      <div className="flex md:hidden items-center gap-2">
        {!user ? (
          <a href={BACKEND_OAUTH_URL}>
            <Button variant="ghost" size="icon">
              <LucideUser className="w-6 h-6" />
            </Button>
          </a>
        ) : (
          <Avatar className="w-9 h-9">
            <AvatarImage src={user.picture} alt={user.name} />
            <AvatarFallback>
              {user.name
                ? user.name.charAt(0).toUpperCase()
                : user.email.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="cursor-pointer p-2">
            <LucideMenu size={30} className="text-zinc-100" />
          </SheetTrigger>
          <SheetContent
            className="w-full bg-zinc-900 text-white flex flex-col"
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

            <nav className="flex flex-col mt-6 space-y-3 px-8 flex-1">
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
            </nav>

            {user && (
              <div className="mt-auto p-4 px-8 border-t border-zinc-700">
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start gap-2"
                >
                  <LucideLogOut className="w-5 h-5" />
                  Sair
                </Button>
              </div>
            )}
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
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      <div className="hidden md:flex items-center gap-4">
        <Input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="w-40 bg-zinc-800 text-white border-zinc-700"
        />
        <Button size="icon" variant="ghost" onClick={handleSearch}>
          <LucideSearch className="w-5 h-5 text-zinc-400" />
        </Button>
        {!user ? (
          // Se não está logado, mostra o botão de Login
          // Este é um LINK (<a>) e não um <Button> para causar o redirecionamento
          <a
            href={BACKEND_OAUTH_URL}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
          >
            Login
          </a>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={user.picture} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    ? user.name.charAt(0).toUpperCase()
                    : user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-900 text-white border-zinc-700">
              <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-700" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer focus:bg-zinc-800"
              >
                <LucideLogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};
