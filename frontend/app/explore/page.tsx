"use client";

import { useSearchParams } from "next/navigation";

export default function Explore() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  return <div>Buscando por: {query}</div>;
}
