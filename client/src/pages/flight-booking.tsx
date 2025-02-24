import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Flight } from "@/lib/mock-flights";
import { format } from "date-fns";

export default function FlightBooking() {
  const [, setLocation] = useLocation();
  const [category, setCategory] = useState("single");
  const [familySize, setFamilySize] = useState("3");

  // Get flight data from URL params
  const searchParams = new URLSearchParams(window.location.search);
  const flightData = searchParams.get("flight");

  if (!flightData) {
    setLocation("/flights");
    return null;
  }

  const flight: Flight = JSON.parse(decodeURIComponent(flightData));

  // Calculate total passengers based on category
  const getPassengerCount = () => {
    switch (category) {
      case "single":
        return 1;
      case "couple":
        return 2;
      case "family":
        return parseInt(familySize);
      default:
        return 1;
    }
  };

  // Calculate total base price based on passenger count and category
  const calculateTotalBasePrice = () => {
    const basePrice = flight.price;
    switch (category) {
      case "single":
        return basePrice; // Original price for single passenger
      case "couple":
        return basePrice * 2; // Double price for couple
      case "family":
        return basePrice * parseInt(familySize); // n times price for family
      default:
        return basePrice;
    }
  };

  const handleBooking = (flight: Flight) => {
    const travelClassMap = {
      economy: "Economy",
      business: "Business",
      first: "First Class"
    };

    const bookingData = {
      flight,
      category: travelClassMap[flight.class] || "Economy",
      passengerCount: getPassengerCount(),
      basePrice: calculateTotalBasePrice(), // Use the calculated total base price
      pricePerPerson: flight.price // Store original price per person
    };

    const bookingParam = encodeURIComponent(JSON.stringify(bookingData));
    setLocation(`/luggage-selection?booking=${bookingParam}`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Book Your Flight</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Flight Details Summary */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{flight.airline}</p>
                <p className="text-sm text-muted-foreground">{flight.flightNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground capitalize">{flight.class}</p>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="text-center">
                <p className="font-medium">{format(new Date(flight.departureTime), "hh:mm a")}</p>
                <p className="text-sm text-muted-foreground">{flight.departureCity}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">{flight.duration}</p>
              </div>
              <div className="text-center">
                <p className="font-medium">{format(new Date(flight.arrivalTime), "hh:mm a")}</p>
                <p className="text-sm text-muted-foreground">{flight.arrivalCity}</p>
              </div>
            </div>
          </div>

          {/* Passenger Category Selection */}
          <div className="space-y-2">
            <Label>Passenger Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single (1 passenger)</SelectItem>
                <SelectItem value="couple">Couple (2 passengers)</SelectItem>
                <SelectItem value="family">Family</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Family Size Input */}
          {category === "family" && (
            <div className="space-y-2">
              <Label>Number of Family Members</Label>
              <Input
                type="number"
                min="3"
                value={familySize}
                onChange={(e) => setFamilySize(e.target.value)}
                className="w-full"
              />
            </div>
          )}

          {/* Total Price */}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-medium">Price Breakdown:</p>
                <p className="text-sm text-gray-600">Base Price: ₹{flight.price.toLocaleString('en-IN')} per person</p>
                <p className="text-sm text-gray-600">Passengers: {getPassengerCount()}</p>
              </div>
              <p className="text-2xl font-bold">
                ₹{calculateTotalBasePrice().toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <Button className="w-full mt-4" size="lg" onClick={() => handleBooking(flight)}>
            Next
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}