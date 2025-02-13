import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, PlaneTakeoff } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/">
            <a className="text-2xl font-bold text-primary">FlightSearch</a>
          </Link>
          <div className="flex space-x-6">
            <Link href="/flights">
              <a className="flex items-center text-foreground hover:text-primary transition-colors">
                <PlaneTakeoff className="mr-2 h-4 w-4" />
                Search Flights
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
          <Link href="/flights">
            <Button>
              <PlaneTakeoff className="mr-2 h-4 w-4" />
              Search Now
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}