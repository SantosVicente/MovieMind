"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AuthCallbackLogic() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("authToken", token);

      router.push("/");
    } else {
      console.error("Falha no login: Token não encontrado na URL.");
      router.push("/");
    }
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Autenticando...</h1>
      <p className="text-zinc-400">Aguarde, estamos processando seu login.</p>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <AuthCallbackLogic />
    </Suspense>
  );
}
