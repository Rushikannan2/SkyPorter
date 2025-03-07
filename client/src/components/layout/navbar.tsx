import { Link } from "wouter";

export default function Navbar() {
  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <a className="text-xl md:text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
              FlightSearch
            </a>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/about">
              <a className="text-gray-700 hover:text-blue-600 transition-colors">
                About
              </a>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}