import React from "react";
import { Github, Mail } from "lucide-react";
import Logo from "@/app/icon.png";
import Image from "next/image";
import Link from "next/link";

const Footer: React.FC = () => (
  <footer className="w-full bg-[#222] text-gray-300 py-6 mt-10">
    <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Logo + descrição */}
      <div className="flex flex-col items-center md:items-start">
        <div className="flex items-center gap-2 mb-2">
          <Image
            src={Logo}
            alt="MovieMind Logo"
            width={30}
            height={30}
            className="rounded-full"
          />
          <span className="text-lg font-semibold">MovieMind</span>
        </div>
        <p className="text-sm text-gray-400">
          Descubra filmes personalizados com a ajuda da IA 🎬
        </p>
      </div>

      {/* Links rápidos */}
      <div className="flex flex-col items-center">
        <div className="flex flex-col">
          <h4 className="font-semibold text-white mb-2">Links</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/explore" className="hover:text-white">
                Pesquisar
              </Link>
            </li>

            <li>
              <Link href="/about" className="hover:text-white">
                Sobre nós
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-white">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Contato / Redes */}
      <div className="flex flex-col items-center md:items-end">
        <h4 className="font-semibold text-white mb-2">Contato</h4>
        <div className="flex gap-4">
          <Link
            href="mailto:contato@moviemind.com"
            className="hover:text-white"
          >
            <Mail className="w-5 h-5" />
          </Link>
          <Link
            href="https://github.com/SantosVicente/MovieMind"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white"
          >
            <Github className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>

    {/* Copy */}
    <div className="text-center text-xs text-gray-500 mt-6">
      &copy; {new Date().getFullYear()} MovieMind. Todos os direitos reservados.
    </div>
  </footer>
);

export default Footer;
