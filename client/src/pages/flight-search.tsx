import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, PlaneTakeoff, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateFlights, type Flight } from "@/lib/mock-flights";

const flightClasses = [
  { value: "economy", label: "Economy" },
  { value: "business", label: "Business" },
  { value: "first", label: "First Class" }
];

export default function FlightSearch() {
  const [date, setDate] = useState<Date>();
  const [departureCity, setDepartureCity] = useState("");
  const [arrivalCity, setArrivalCity] = useState("");
  const [flightClass, setFlightClass] = useState("");
  const [flights, setFlights] = useState<Flight[]>([]);
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
      setFlights(generatedFlights);
      setSearching(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlaneTakeoff className="h-6 w-6" />
            Flight Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="departure">Departure City</Label>
              <Input
                id="departure"
                placeholder="Enter departure city"
                value={departureCity}
                onChange={(e) => setDepartureCity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="arrival">Arrival City</Label>
              <Input
                id="arrival"
                placeholder="Enter arrival city"
                value={arrivalCity}
                onChange={(e) => setArrivalCity(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Class</Label>
              <Select value={flightClass} onValueChange={setFlightClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {flightClasses.map((cls) => (
                    <SelectItem key={cls.value} value={cls.value}>
                      {cls.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            className="w-full" 
            size="lg"
            onClick={handleSearch}
            disabled={!date || !departureCity || !arrivalCity || !flightClass || searching}
          >
            {searching ? "Searching..." : "Search Flights"}
          </Button>
        </CardContent>
      </Card>

      {flights.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Available Flights</h2>
          {flights.map((flight) => (
            <Card key={flight.id} className="hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Airline</p>
                    <p className="font-medium">{flight.airline}</p>
                    <p className="text-sm text-muted-foreground">{flight.flightNumber}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <p className="text-xl font-bold">{format(flight.departureTime, "HH:mm")}</p>
                      <p className="text-sm text-muted-foreground">{flight.departureCity}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
                    <div className="text-center">
                      <p className="text-xl font-bold">{format(flight.arrivalTime, "HH:mm")}</p>
                      <p className="text-sm text-muted-foreground">{flight.arrivalCity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${flight.price}</p>
                    <p className="text-sm text-muted-foreground capitalize">{flight.class}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}