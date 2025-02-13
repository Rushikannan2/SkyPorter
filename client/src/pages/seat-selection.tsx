import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import type { Flight } from "@/lib/mock-flights";

interface BookingData {
  flight: Flight;
  category: string;
  passengerCount: number;
  luggage: Array<{ weight: string }>;
}

// Mock seat layout (6 rows x 6 seats)
const ROWS = 6;
const COLS = 6;

// Initialize seat availability (true = available)
const initialSeats = Array(ROWS).fill(null).map(() =>
  Array(COLS).fill(true)
);

// Store booked seats globally (this is a simple implementation, in reality this should be in a database)
const bookedSeats: { [key: string]: boolean } = {};

export default function SeatSelection() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const bookingData = searchParams.get("booking");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  if (!bookingData) {
    setLocation("/flights");
    return null;
  }

  const booking: BookingData = JSON.parse(decodeURIComponent(bookingData));
  const { flight, passengerCount, luggage } = booking;

  // Calculate total luggage weight
  const totalWeight = luggage.reduce((sum, item) => sum + Number(item.weight), 0);

  // Implement Simplex Method for Price Optimization
  const calculateTotalPrice = () => {
    // Decision Variables
    const basePrice = flight.price;
    const weightCost = 0.5; // ₹0.5 per kg
    const seatPremium = 200; // ₹200 per seat selection
    const classMultiplier = flight.class === 'economy' ? 1 :
                           flight.class === 'business' ? 1.5 : 2; // first class

    // Objective Function: Maximize Revenue while keeping price reasonable
    // Z = basePrice * passengers + weightCost * totalWeight + seatPremium * seats

    // Constraints:
    // 1. Total price cannot exceed 3x base price (affordability constraint)
    // 2. Luggage cost cannot exceed 50% of ticket price
    // 3. Minimum price must cover operational costs

    const passengerRevenue = basePrice * passengerCount * classMultiplier;
    const luggageCost = Math.min(
      totalWeight * weightCost * 100, // Convert to rupees
      passengerRevenue * 0.5 // Cannot exceed 50% of ticket price
    );
    const seatSelectionCost = selectedSeats.length * seatPremium;

    // Apply constraints
    const totalCost = passengerRevenue + luggageCost + seatSelectionCost;
    const maxAllowedPrice = basePrice * passengerCount * 3;

    return Math.min(Math.max(totalCost, basePrice * passengerCount), maxAllowedPrice);
  };

  const toggleSeat = (row: number, col: number) => {
    const seatId = `${row}-${col}`;

    // Check if seat is already booked
    if (bookedSeats[seatId]) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else if (selectedSeats.length < passengerCount) {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleConfirmBooking = () => {
    // Mark selected seats as booked
    selectedSeats.forEach(seatId => {
      bookedSeats[seatId] = true;
    });

    // In a real application, you would:
    // 1. Send this data to your backend
    // 2. Store in database
    // 3. Handle payment processing
    // 4. Generate booking confirmation

    // For now, we'll just show a success message
    alert('Booking confirmed! Total price: ₹' + calculateTotalPrice().toLocaleString('en-IN'));
    setLocation('/flights');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Select Your Seats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p>Flight: {flight.airline} {flight.flightNumber}</p>
            <p>Passengers: {passengerCount}</p>
            <p>Total Luggage Weight: {totalWeight}kg</p>
          </div>

          <div className="grid grid-cols-6 gap-2 max-w-md mx-auto">
            {Array(ROWS).fill(null).map((_, row) => (
              Array(COLS).fill(null).map((_, col) => {
                const seatId = `${row}-${col}`;
                const isBooked = bookedSeats[seatId];
                const isSelected = selectedSeats.includes(seatId);

                return (
                  <Button
                    key={seatId}
                    variant={isSelected ? "default" : "outline"}
                    className={`h-12 w-12 p-0 ${isBooked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => toggleSeat(row, col)}
                    disabled={isBooked || (!isSelected && selectedSeats.length >= passengerCount)}
                  >
                    {isSelected && <Check className="h-4 w-4" />}
                  </Button>
                );
              })
            ))}
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <p className="text-lg font-medium">Total Price</p>
              <p className="text-2xl font-bold">
                ₹{calculateTotalPrice().toLocaleString('en-IN')}
              </p>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleConfirmBooking}
              disabled={selectedSeats.length !== passengerCount}
            >
              Confirm Booking
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}