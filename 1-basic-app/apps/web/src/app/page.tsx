import { Zap } from "lucide-react";
import { LockPanel } from "@/components/lock-panel";

export default function Home() {
  return (
    <section className="relative py-16 lg:py-24">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-sm font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
            <Zap className="h-4 w-4" />
            Celo Sepolia
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Laboratorio{" "}
            <span className="text-primary">Lock</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            La wallet ya está conectada. El siguiente paso es publicar{" "}
            <code className="text-sm">Lock.sol</code> en Sepolia y leerlo desde
            esta página.
          </p>
        </div>
        <div className="max-w-xl mx-auto">
          <LockPanel />
        </div>
      </div>
    </section>
  );
}
