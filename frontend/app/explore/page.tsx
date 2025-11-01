import { Suspense } from "react";
import { LucideLoader2 } from "lucide-react";
import ExplorePage from "@/components/ExplorePage";

function LoadingFallback() {
  return (
    <div className="flex h-[80vh] w-full items-center justify-center">
      <LucideLoader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}

export default function Explore() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ExplorePage />
    </Suspense>
  );
}
