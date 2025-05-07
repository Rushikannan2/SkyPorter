import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 pb-24">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center text-black">
          About Our Team
        </h1>
        
        <div className="max-w-3xl mx-auto space-y-6">
          <section className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-black">Our Mission</h2>
            <p className="text-gray-700 text-base leading-relaxed">
              We are passionate about revolutionizing the flight booking and luggage management system
              by integrating web development with optimization techniques. Our goal is to make complex
              tasks easier and more efficient using the Simplex method.
            </p>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-xl md:text-2xl font-semibold mb-6 text-black">Our Team</h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
                  RK
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black">V T Rushi Kannan</h3>
                  <p className="text-gray-600">Lead Developer</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
                  ZS
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black">Zia Shieh</h3>
                  <p className="text-gray-600">Lead Developer</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
                  PS
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black">Dr. P Sudarshan Babu</h3>
                  <p className="text-gray-600">Project Advisor</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-black">Our Technology Stack</h2>
            <ul className="space-y-3 text-gray-700 text-base">
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Modern Web Development
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Optimization Techniques
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Simplex Method Implementation
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Responsive Design
              </li>
            </ul>
          </section>

          <div className="text-center mt-8">
            <Link href="/">
              <a className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-base font-medium shadow-md">
                Back to Home
              </a>
            </Link>
          </div>
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-700 text-sm">
            © 2025 Flight Luggage System. Developed by Zia Shieh, V T Rushi Kannan, Dr. P Sudarshan Babu. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 
