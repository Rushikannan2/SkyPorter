import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, PlaneTakeoff } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateFlights } from "@/lib/mock-flights";

const flightClasses = [
  { value: "economy", label: "Economy" },
  { value: "business", label: "Business" },
  { value: "first", label: "First Class" }
];

export default function FlightSearch() {
  const [, setLocation] = useLocation();
  const [date, setDate] = useState<Date>();
  const [departureCity, setDepartureCity] = useState("");
  const [arrivalCity, setArrivalCity] = useState("");
  const [flightClass, setFlightClass] = useState("");
  const [searching, setSearching] = useState(false);

  const handleSearch = () => {
    if (!date || !departureCity || !arrivalCity || !flightClass) {
      return;
    }

    setSearching(true);
    // Simulate API call
    setTimeout(() => {
      const generatedFlights = generateFlights(
        departureCity,
        arrivalCity,
        date,
        flightClass
      );
      setSearching(false);

      // Redirect to results page with flight data
      const flightsParam = encodeURIComponent(JSON.stringify(generatedFlights));
      setLocation(`/flight-results?flights=${flightsParam}`);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8 relative min-h-screen bg-gray-50">
      <Card className="max-w-2xl mx-auto bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <PlaneTakeoff className="h-6 w-6" />
            Flight Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="departure" className="text-black font-medium">Departure City</Label>
              <Input
                id="departure"
                placeholder="Enter departure city"
                value={departureCity}
                onChange={(e) => setDepartureCity(e.target.value)}
                className="bg-white text-black border-gray-200 placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="arrival" className="text-black font-medium">Arrival City</Label>
              <Input
                id="arrival"
                placeholder="Enter arrival city"
                value={arrivalCity}
                onChange={(e) => setArrivalCity(e.target.value)}
                className="bg-white text-black border-gray-200 placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-black font-medium">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white text-black border-gray-200",
                      !date && "text-gray-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white border-gray-200" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="bg-white text-black"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-black font-medium">Class</Label>
              <div className="grid grid-cols-3 gap-2">
                {flightClasses.map((cls) => (
                  <button
                    key={cls.value}
                    onClick={() => setFlightClass(cls.value)}
                    className={cn(
                      "p-3 rounded-md text-sm font-bold transition-colors border",
                      flightClass === cls.value
                        ? "bg-blue-600 text-white border-blue-700 hover:bg-blue-700"
                        : "bg-white text-black border-gray-200 hover:bg-gray-100"
                    )}
                  >
                    {cls.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button 
            className="w-full bg-blue-600 text-white hover:bg-blue-700" 
            size="lg"
            onClick={handleSearch}
            disabled={!date || !departureCity || !arrivalCity || !flightClass || searching}
          >
            {searching ? "Searching..." : "Search Flights"}
          </Button>
        </CardContent>
      </Card>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 md:py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <p className="text-center text-black font-medium text-sm md:text-base">
            © 2025 Flight Luggage System. Developed by Ziya Shieh, V T Rushi Kannan, Dr. P Sudarshan Babu. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}