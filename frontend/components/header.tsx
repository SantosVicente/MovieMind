import Image from "next/image";
import Logo from "@/app/icon.png";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LucideMenu } from "lucide-react";
import { Button } from "./ui/button";

export const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-accent">
      <div className="flex items-center gap-2">
        <Image src={Logo} alt="MovieMind Logo" width={40} height={40} />
        <h1 className="text-2xl font-bold">MovieMind</h1>
      </div>
      <div className="flex md:hidden">
        <Sheet>
          <SheetTrigger className="cursor-pointer p-2">
            <LucideMenu size={30} className="text-zinc-100" />
          </SheetTrigger>
          <SheetContent className="w-full">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <nav className="flex flex-col">
                <a
                  href="#"
                  className="py-2 text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="py-2 text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  About
                </a>
                <a
                  href="#"
                  className="py-2 text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Contact
                </a>
              </nav>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <nav className="hidden md:block">
        <ul className="flex space-x-4">
          <li>
            <a
              href="#"
              className="text-lg text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-lg text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-lg text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};
