import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/">
            <a className="text-2xl font-bold text-primary">React UI</a>
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link href="/">
              <a className="text-foreground hover:text-primary transition-colors">
                Home
              </a>
            </Link>
            <Link href="/flights">
              <a className="text-foreground hover:text-primary transition-colors">
                Flight Search
              </a>
            </Link>
            <Link href="/components">
              <a className="text-foreground hover:text-primary transition-colors">
                Components
              </a>
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <SunIcon className="h-5 w-5" />
          </Button>
          <Button>Get Started</Button>
        </div>
      </div>
    </nav>
  );
}