import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Clock, ArrowRight } from "lucide-react";
import type { Flight } from "@/lib/mock-flights";

export default function FlightResults() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const flightsData = searchParams.get("flights");
  
  if (!flightsData) {
    setLocation("/flights");
    return null;
  }

  const flights: Flight[] = JSON.parse(decodeURIComponent(flightsData));

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Available Flights</h1>
      <div className="space-y-4">
        {flights.map((flight) => (
          <Card key={flight.id} className="hover:border-primary transition-colors">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Airline</p>
                  <p className="font-medium">{flight.airline}</p>
                  <p className="text-sm text-muted-foreground">{flight.flightNumber}</p>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {format(new Date(flight.departureTime), "hh:mm a")}
                      </p>
                      <p className="text-sm text-muted-foreground">{flight.departureCity}</p>
                    </div>
                    <div className="flex flex-col items-center mx-4">
                      <p className="text-sm text-muted-foreground">{flight.duration}</p>
                      <ArrowRight className="h-4 w-4 text-muted-foreground my-1" />
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {format(new Date(flight.arrivalTime), "hh:mm a")}
                      </p>
                      <p className="text-sm text-muted-foreground">{flight.arrivalCity}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">₹{flight.price.toLocaleString('en-IN')}</p>
                  <p className="text-sm text-muted-foreground capitalize">{flight.class}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
