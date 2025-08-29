"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  LucideUsers,
  LucideDatabase,
  LucideWandSparkles,
  LucideCompass,
} from "lucide-react";
import Image from "next/image";

export default function AboutUsPage() {
  return (
    <div className="flex flex-col items-center py-12 px-4 text-zinc-200">
      <div className="w-full max-w-5xl flex flex-col gap-16">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            Sobre o MovieMind
          </h1>
          <p className="mt-4 text-lg text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            Nossa missão é transformar a maneira como você descobre e se conecta
            com o universo do cinema. Chega de rolar infinitamente por
            catálogos. Aqui, encontrar o filme perfeito é uma experiência
            intuitiva e divertida.
          </p>
        </header>

        <Separator className="bg-zinc-700" />

        <section className="flex flex-col items-center">
          <h2 className="text-3xl font-semibold text-primary mb-8 text-center">
            A Nossa Magia: A Busca Inteligente
          </h2>
          <div className="bg-zinc-900/50 rounded-xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-lg border border-zinc-800">
            <div className="flex-shrink-0">
              <LucideWandSparkles className="text-primary" size={80} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-zinc-100 mb-2">
                Está com um filme na ponta da língua?
              </h3>
              <p className="text-zinc-300 leading-relaxed">
                Cansado de buscas que não entendem o que você quer? Nosso
                diferencial é uma busca que pensa como você. Basta descrever o
                que você procura de forma simples e nós fazemos o resto.
              </p>
              <p className="mt-4 text-zinc-400 bg-zinc-800 p-3 rounded-lg text-sm italic">
                {`Exemplo: "quero assistir uma fantasia parecida com Harry Potter
                e Nárnia, com um tom mais sombrio"`}
              </p>
              <p className="mt-3 text-zinc-300 leading-relaxed">
                Nossa plataforma analisa sua descrição e retorna uma lista de
                filmes que se encaixam perfeitamente no seu desejo, abrindo um
                mundo de novas possibilidades.
              </p>
            </div>
          </div>
        </section>

        <Separator className="bg-zinc-700" />

        <section>
          <h2 className="text-3xl font-semibold text-primary mb-8 text-center">
            O Que Oferecemos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-zinc-900 p-6 rounded-xl shadow-md flex flex-col items-center text-center border-transparent hover:border-primary transition-all duration-300">
              <CardContent className="flex flex-col items-center p-0">
                <LucideDatabase className="text-primary mb-4" size={48} />
                <h3 className="text-xl font-semibold text-zinc-100">
                  Banco de Dados Completo
                </h3>
                <p className="text-zinc-400 mt-2 text-sm">
                  Explore fichas técnicas, sinopses, avaliações e reviews de
                  milhares de filmes, dos clássicos aos lançamentos mais
                  recentes.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 p-6 rounded-xl shadow-md flex flex-col items-center text-center border-transparent hover:border-primary transition-all duration-300">
              <CardContent className="flex flex-col items-center p-0">
                <LucideCompass className="text-primary mb-4" size={48} />
                <h3 className="text-xl font-semibold text-zinc-100">
                  Navegação Intuitiva
                </h3>
                <p className="text-zinc-400 mt-2 text-sm">
                  Encontre filmes por gênero, popularidade ou através de nossas
                  listas selecionadas. A descoberta nunca foi tão fácil.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 p-6 rounded-xl shadow-md flex flex-col items-center text-center border-transparent hover:border-primary transition-all duration-300">
              <CardContent className="flex flex-col items-center p-0">
                <LucideUsers className="text-primary mb-4" size={48} />
                <h3 className="text-xl font-semibold text-zinc-100">
                  Comunidade Ativa
                </h3>
                <p className="text-zinc-400 mt-2 text-sm">
                  Leia reviews de outros apaixonados por cinema e compartilhe
                  suas próprias opiniões. Faça parte da nossa comunidade!
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="bg-zinc-700" />

        <section>
          <h2 className="text-3xl font-semibold text-primary mb-8 text-center">
            Nossa Equipe
          </h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-10">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-zinc-700 mb-4 flex items-center justify-center">
                <Image
                  src={
                    "https://suap.ifsp.edu.br/media/alunos/fotos/2022/wFNqIjDbZD23WJ9TP66oE40UD501WQvHrmQI89vigJw.jpg"
                  }
                  alt="João Vitor R. do Nascimento"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-full rounded-full aspect-square"
                />
              </div>
              <p className="text-lg font-semibold text-zinc-100">
                João Vitor R. do Nascimento
              </p>
              <p className="text-primary text-sm">Desenvolvedor</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-zinc-700 mb-4 flex items-center justify-center">
                <Image
                  src={
                    "https://suap.ifsp.edu.br/media/alunos/fotos/2022/WJvZps_WFd0AhOYq4DiatqwbioYZQU-iZJdSX2vwrAM.jpg"
                  }
                  alt="Matheus Rezende Maia"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-full rounded-full aspect-square"
                />
              </div>
              <p className="text-lg font-semibold text-zinc-100">
                Matheus Rezende Maia
              </p>
              <p className="text-primary text-sm">Desenvolvedor</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-zinc-700 mb-4 flex items-center justify-center">
                <Image
                  src={
                    "https://suap.ifsp.edu.br/media/alunos/fotos/2022/lphRU0fLBhEEHW-erEq1RN-MWNW2-or9gGqXacYbiig.jpg"
                  }
                  alt="Vicente dos Santos Silva"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-full rounded-full aspect-square"
                />
              </div>
              <p className="text-lg font-semibold text-zinc-100">
                Vicente dos Santos Silva
              </p>
              <p className="text-primary text-sm">Desenvolvedor</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-zinc-700 mb-4 flex items-center justify-center">
                <Image
                  src={
                    "https://suap.ifsp.edu.br/media/alunos/fotos/2022/sTkqeR4AH03vSdQMcK9ha1yvoVHFmWJ6Db-0whjpPwQ.jpg"
                  }
                  alt="Victor Hugo Montanari Dias"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-full rounded-full aspect-square"
                />
              </div>
              <p className="text-lg font-semibold text-zinc-100">
                Victor Hugo Montanari Dias
              </p>
              <p className="text-primary text-sm">Desenvolvedor</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
