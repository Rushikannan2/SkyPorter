import React, { useState, useEffect } from 'react';
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import type { Flight } from "@/lib/mock-flights";
import { TravelClass } from '../../../shared/types';

interface BookingData {
  flight: Flight;
  category: string;
  passengerCount: number;
  luggage: Array<{ weight: string }>;
  basePrice?: number;
  pricePerPerson?: number;
  luggageCharges?: number;
  passengers?: Array<{ name: string }>;
}

interface Luggage {
  weight: number;
  pieces: number;
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

interface SeatSelectionProps {
  // Add any props you need
}

export const SeatSelection: React.FC<SeatSelectionProps> = () => {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const bookingData = searchParams.get("booking");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
  // Initialize luggage state and travel class from booking data
  const [luggage, setLuggage] = useState<Luggage[]>(() => {
    if (!bookingData) return [];
    const booking: BookingData = JSON.parse(decodeURIComponent(bookingData));
    return booking.luggage.map(item => ({
      weight: Number(item.weight),
      pieces: 1
    }));
  });

  // Set initial travel class from booking data
  const [travelClass, setTravelClass] = useState<TravelClass>(() => {
    if (!bookingData) return TravelClass.ECONOMY;
    const booking: BookingData = JSON.parse(decodeURIComponent(bookingData));
    switch (booking.category?.toUpperCase()) {
      case 'BUSINESS':
        return TravelClass.BUSINESS;
      case 'FIRST CLASS':
        return TravelClass.FIRST;
      default:
        return TravelClass.ECONOMY;
    }
  });

  const [totalCost, setTotalCost] = useState<number>(0);
  const [message, setMessage] = useState<string>('');

  // Early return if no booking data
  if (!bookingData) {
    setLocation("/flights");
    return null;
  }

  const booking: BookingData = JSON.parse(decodeURIComponent(bookingData));
  const { flight, passengerCount } = booking;

  // Calculate total weight from current luggage state
  const calculateTotalWeight = () => {
    return luggage.reduce((sum, item) => sum + Number(item.weight), 0);
  };

  const SEAT_PRICE = 400; // Price per seat

  const calculateTotalPrice = () => {
    const baseFare = booking.basePrice || 0; // Already includes passenger count
    const seatSelectionCost = selectedSeats.length * SEAT_PRICE;
    const luggageCharges = booking.luggageCharges || 0;
    
    return {
      baseFare,
      pricePerPerson: booking.pricePerPerson,
      passengerCount: booking.passengerCount,
      luggageCharges,
      seatCost: seatSelectionCost,
      total: baseFare + luggageCharges + seatSelectionCost
    };
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
    alert('Booking confirmed! Total price: ₹' + calculateTotalPrice().total.toLocaleString('en-IN'));

    const bookingParam = encodeURIComponent(JSON.stringify({
      ...booking,
      selectedSeats,
      totalPrice: calculateTotalPrice().total
    }));
    
    setLocation(`/booking-confirmation?booking=${bookingParam}`);
  };

  const calculateLuggageCharges = async () => {
    try {
      if (!luggage.length) {
        setMessage('No luggage added yet');
        return 0;
      }

      const totalWeight = calculateTotalWeight();
      const response = await fetch('/api/calculate-luggage-charge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          luggageWeight: totalWeight,
          travelClass
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setTotalCost(result.totalFare);
        setMessage(result.message);
        return result.totalFare;
      } else {
        setMessage(result.message || 'Error calculating luggage charges');
        return 0;
      }
    } catch (error) {
      setMessage('Error calculating luggage charges');
      console.error('Error:', error);
      return 0;
    }
  };

  const addLuggage = () => {
    setLuggage([...luggage, { weight: 0, pieces: 1 }]);
  };

  const updateLuggageWeight = (index: number, weight: number) => {
    const newLuggage = [...luggage];
    newLuggage[index] = { ...newLuggage[index], weight };
    setLuggage(newLuggage);
  };

  const removeLuggage = (index: number) => {
    setLuggage(luggage.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (luggage.length > 0) {
      calculateLuggageCharges();
    }
  }, [luggage, travelClass]);

  // Update the getWeightLimit function
  const getWeightLimit = (travelClass: TravelClass): string => {
    const limits = {
      [TravelClass.ECONOMY]: 20,
      [TravelClass.BUSINESS]: 30,
      [TravelClass.FIRST]: 40
    };
    return `${limits[travelClass]}kg`;
  };

  // Update the getClassDescription function
  const getClassDescription = (travelClass: TravelClass): string => {
    const limits = {
      [TravelClass.ECONOMY]: 20,
      [TravelClass.BUSINESS]: 30,
      [TravelClass.FIRST]: 40
    };
    return `${travelClass} Class (${limits[travelClass]}kg limit)`;
  };

  // Add helper function to group luggage by passenger
  const getLuggageByPassenger = () => {
    const luggagePerPassenger = Math.ceil(luggage.length / passengerCount);
    const passengerLuggage = [];
    
    for (let i = 0; i < passengerCount; i++) {
      const start = i * luggagePerPassenger;
      const end = start + luggagePerPassenger;
      const currentPassengerLuggage = luggage.slice(start, end);
      const totalWeight = currentPassengerLuggage.reduce((sum, item) => sum + item.weight, 0);
      
      passengerLuggage.push({
        passengerIndex: i,
        luggage: currentPassengerLuggage,
        totalWeight,
        isOverLimit: totalWeight > Number(getWeightLimit(travelClass).replace('kg', ''))
      });
    }
    
    return passengerLuggage;
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
            <p>Travel Class: {travelClass}</p>
            <p>Weight Limit: {getWeightLimit(travelClass)}</p>
            <p>Total Luggage Weight: {calculateTotalWeight()}kg</p>
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
            <div className="space-y-2">
              <h3 className="font-medium">Final Price Breakdown:</h3>
              <p>Base Ticket (₹{calculateTotalPrice().pricePerPerson.toLocaleString('en-IN')} × {calculateTotalPrice().passengerCount}): 
                ₹{calculateTotalPrice().baseFare.toLocaleString('en-IN')}</p>
              {calculateTotalPrice().luggageCharges > 0 && (
                <p>Luggage Charges: ₹{calculateTotalPrice().luggageCharges.toLocaleString('en-IN')}</p>
              )}
              <p>Seat Selection (₹400 × {selectedSeats.length}): 
                ₹{calculateTotalPrice().seatCost.toLocaleString('en-IN')}</p>
              <div className="pt-2 border-t mt-2">
                <p className="text-lg font-bold flex justify-between">
                  <span>Final Total:</span>
                  <span>₹{calculateTotalPrice().total.toLocaleString('en-IN')}</span>
                </p>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleConfirmBooking}
              disabled={selectedSeats.length !== passengerCount}
            >
              Confirm Booking (₹{calculateTotalPrice().total.toLocaleString('en-IN')})
            </Button>
          </div>

          <div className="travel-class-selection mt-4">
            <label className="block text-sm font-medium mb-2">Travel Class:</label>
            <select 
              className="w-full p-2 border rounded"
              value={travelClass} 
              onChange={(e) => setTravelClass(e.target.value as TravelClass)}
            >
              <option value={TravelClass.ECONOMY}>{getClassDescription(TravelClass.ECONOMY)}</option>
              <option value={TravelClass.BUSINESS}>{getClassDescription(TravelClass.BUSINESS)}</option>
              <option value={TravelClass.FIRST}>{getClassDescription(TravelClass.FIRST)}</option>
            </select>
            <p className="text-sm text-gray-600 mt-1">
              Maximum luggage weight allowed: {getWeightLimit(travelClass)}
            </p>
          </div>

          <div className="luggage-list mt-4">
            <h3 className="text-lg font-medium mb-2">Luggage Details</h3>
            <p className="text-sm text-gray-600 mb-4">
              Current class weight limit: {getWeightLimit(travelClass)}
            </p>
            {luggage.map((item, index) => (
              <div key={index} className="luggage-item flex gap-2 mb-2">
                <input
                  type="number"
                  className="flex-1 p-2 border rounded"
                  value={item.weight}
                  onChange={(e) => updateLuggageWeight(index, Number(e.target.value))}
                  placeholder={`Weight in kg (max ${getWeightLimit(travelClass)})`}
                  min="0"
                  max={Number(getWeightLimit(travelClass).replace('kg', ''))}
                />
                <Button 
                  variant="destructive"
                  onClick={() => removeLuggage(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button 
              className="mt-2"
              onClick={addLuggage}
            >
              Add Luggage
            </Button>
          </div>

          <div className="summary mt-4 bg-muted p-4 rounded">
            <h3 className="font-medium mb-2">Summary</h3>
            <p>Selected Class: {travelClass}</p>
            <p>Number of Passengers: {passengerCount}</p>

            {/* Passenger Details with Individual Luggage */}
            <div className="mt-3 border-t pt-2">
              <p className="font-medium">Passenger Details:</p>
              {getLuggageByPassenger().map((passenger, index) => (
                <div key={index} className="mt-3 border-t pt-2">
                  <p className="font-medium">
                    {booking.passengers?.[index]?.name || `Passenger ${index + 1}`} 
                    (Limit: {getWeightLimit(travelClass)})
                  </p>
                  {passenger.luggage.map((item, luggageIndex) => (
                    <p key={luggageIndex} className="ml-4">
                      Luggage {luggageIndex + 1}: {item.weight}kg
                    </p>
                  ))}
                  <p className="ml-4 text-sm">
                    Total Weight: {passenger.totalWeight}kg
                    {passenger.isOverLimit ? (
                      <span className="text-red-500 ml-2">
                        (Exceeds {travelClass} limit by 
                        {(passenger.totalWeight - Number(getWeightLimit(travelClass).replace('kg', ''))).toFixed(1)}kg)
                      </span>
                    ) : (
                      <span className="text-green-600 ml-2">(Within limit)</span>
                    )}
                  </p>
                </div>
              ))}
            </div>

            {/* Show warnings only for passengers who exceed their limits */}
            {getLuggageByPassenger().some(p => p.isOverLimit) && (
              <div className="mt-4 text-red-500">
                <p>Warning:</p>
                {getLuggageByPassenger()
                  .filter(p => p.isOverLimit)
                  .map((passenger, index) => (
                    <p key={index} className="ml-2">
                      {booking.passengers?.[passenger.passengerIndex]?.name || 
                        `Passenger ${passenger.passengerIndex + 1}`} exceeds {travelClass} limit by 
                      {(passenger.totalWeight - Number(getWeightLimit(travelClass).replace('kg', ''))).toFixed(1)}kg
                    </p>
                  ))}
              </div>
            )}

            {/* Rest of the summary remains the same */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeatSelection;