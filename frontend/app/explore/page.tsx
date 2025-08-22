"use client";

import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function Explore() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (query) {
      setInputValue(query);
    }
  }, [query]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Digite algo para buscar..."
        style={{
          padding: "10px",
          fontSize: "16px",
          width: "300px",
          textAlign: "center",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
    </div>
  );
}
