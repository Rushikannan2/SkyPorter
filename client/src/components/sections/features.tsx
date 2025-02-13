import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Code2, Layout, Shield, Sparkles } from "lucide-react";

const features = [
  {
    title: "Type Safe",
    description: "Built with TypeScript for enhanced developer experience and code quality.",
    icon: Code2
  },
  {
    title: "Modern Design",
    description: "Clean and modern UI components following the latest design trends.",
    icon: Layout
  },
  {
    title: "Best Practices",
    description: "Following React and TypeScript best practices and patterns.",
    icon: Shield
  },
  {
    title: "Easy to Use",
    description: "Simple API with comprehensive documentation and examples.",
    icon: Sparkles
  }
];

export default function Features() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <Card key={i} className="border-2">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
