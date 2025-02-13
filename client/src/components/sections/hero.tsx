import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Build Beautiful React Apps
          <span className="text-primary block mt-2">
            With Modern Components
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          A production-ready component library built with React, TypeScript, and
          modern best practices. Start building faster today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg">
            Get Started
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline">
            View Components
          </Button>
        </div>
      </div>
    </section>
  );
}
