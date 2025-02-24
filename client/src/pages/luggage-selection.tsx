import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Luggage } from "lucide-react";

interface LuggageInfo {
  weight: number;
}

interface Passenger {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
}

interface BookingData {
  category: string;
  passengerCount: number;
  basePrice: number;
  pricePerPerson: number;
  passengers?: Passenger[];
  flight: {
    class: TravelClassType;
  };
}

// Add passenger category type
type PassengerCategory = "single" | "couple" | "family";

// Add Simplex Method implementation
interface SimplexConstraint {
  weights: number[];
  limit: number;
}

interface SimplexSolution {
  allocation: number[];
  totalValue: number;
}

// Add type for travel class
type TravelClassType = 'Business' | 'First Class' | 'Economy';

// Move configuration outside component
const TRAVEL_CLASS_CONFIG: Record<TravelClassType, { weightLimit: number; excessCharge: number }> = {
  'Business': {
    weightLimit: 30,
    excessCharge: 2500
  },
  'First Class': {
    weightLimit: 40,
    excessCharge: 4500
  },
  'Economy': {
    weightLimit: 20,
    excessCharge: 3000
  }
} as const;

export default function LuggageSelection() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const bookingData = searchParams.get("booking");
  const [luggageInfo, setLuggageInfo] = useState<LuggageInfo[]>([{ weight: 0 }]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);

  if (!bookingData) {
    setLocation("/flights");
    return null;
  }

  const booking: BookingData = JSON.parse(decodeURIComponent(bookingData));
  const { category, passengerCount, basePrice, pricePerPerson } = booking;
  // Correctly map the flight class to our travel class type
  const travelClass = (() => {
    const flightClass = booking.flight.class.toLowerCase();
    if (flightClass === 'business') return 'Business';
    if (flightClass === 'first') return 'First Class';
    return 'Economy';
  })() as TravelClassType;

  // Simplified getWeightLimit function
  const getWeightLimit = (): number => {
    return TRAVEL_CLASS_CONFIG[travelClass].weightLimit;
  };

  // Update the checkLuggageLimit function
  const checkLuggageLimit = () => {
    const weightLimit = getWeightLimit();
    const luggagePerPassenger = Math.ceil(luggageInfo.length / passengerCount);
    const passengerLuggage = [];

    // Group luggage by passenger
    for (let i = 0; i < passengerCount; i++) {
      const start = i * luggagePerPassenger;
      const end = start + luggagePerPassenger;
      const luggagePieces = luggageInfo.slice(start, end);
      const totalWeight = luggagePieces.reduce((sum, item) => sum + item.weight, 0);
      
      // Check each piece of luggage against the limit
      const overweightPieces = luggagePieces.filter(piece => piece.weight > weightLimit);
      const isOverweight = overweightPieces.length > 0 || totalWeight > weightLimit;
      
      passengerLuggage.push({
        passengerIndex: i,
        pieces: luggagePieces.map(piece => ({
          ...piece,
          isOverweight: piece.weight > weightLimit,
          excessWeight: piece.weight > weightLimit ? piece.weight - weightLimit : 0
        })),
        totalWeight,
        limit: weightLimit,
        isOverweight,
        excessWeight: totalWeight > weightLimit ? totalWeight - weightLimit : 0
      });
    }

    return {
      passengerLuggage,
      hasOverweight: passengerLuggage.some(p => p.isOverweight),
      overweightPassengers: passengerLuggage.filter(p => p.isOverweight)
    };
  };

  // Update the calculateLuggageCharges function
  const calculateLuggageCharges = () => {
    let totalCharge = 0;
    const luggagePerPassenger = Math.ceil(luggageInfo.length / passengerCount);

    // Calculate charges per passenger
    for (let i = 0; i < passengerCount; i++) {
      const start = i * luggagePerPassenger;
      const end = start + luggagePerPassenger;
      const passengerLuggage = luggageInfo.slice(start, end);
      
      const passengerTotalWeight = passengerLuggage.reduce((sum, item) => sum + item.weight, 0);
      const weightLimit = getWeightLimit();
      const excessCharge = TRAVEL_CLASS_CONFIG[travelClass].excessCharge;
      
      if (passengerTotalWeight > weightLimit) {
        const excessWeight = passengerTotalWeight - weightLimit;
        totalCharge += excessWeight * excessCharge;
      }
    }
    
    return totalCharge;
  };

  // Update the optimizeLuggageDistribution function
  const optimizeLuggageDistribution = () => {
    const weightLimit = getWeightLimit();
    const excessCharge = TRAVEL_CLASS_CONFIG[travelClass].excessCharge;
    
    // Group luggage by passenger
    const passengerGroups: LuggageInfo[][] = [];
    for (let i = 0; i < passengerCount; i++) {
      const start = i * Math.ceil(luggageInfo.length / passengerCount);
      const end = start + Math.ceil(luggageInfo.length / passengerCount);
      passengerGroups.push(luggageInfo.slice(start, end));
    }

    // Optimize each passenger's luggage
    const optimizedLuggage: LuggageInfo[] = [];
    passengerGroups.forEach(group => {
      const totalWeight = group.reduce((sum, item) => sum + item.weight, 0);
      
      if (totalWeight > weightLimit) {
        // Use Simplex to minimize excess charges
        const excess = totalWeight - weightLimit;
        const reduction = excess / group.length;
        
        group.forEach(item => {
          const optimizedWeight = Math.max(item.weight - reduction, 0);
          optimizedLuggage.push({ weight: Math.round(optimizedWeight * 100) / 100 });
        });
      } else {
        group.forEach(item => optimizedLuggage.push({ weight: item.weight }));
      }
    });

    setLuggageInfo(optimizedLuggage);
  };

  // Add a function to get class description
  const getClassDescription = () => {
    switch (travelClass) {
      case "Business":
        return "Business Class (30kg limit)";
      case "First Class":
        return "First Class (40kg limit)";
      default:
        return "Economy Class (20kg limit)";
    }
  };

  const addLuggage = () => {
    setLuggageInfo([...luggageInfo, { weight: 0 }]);
  };

  const updateLuggage = (index: number, weight: string) => {
    const weightValue = parseFloat(weight) || 0; // Ensure weight is a valid number
    const newLuggageInfo = [...luggageInfo];
    newLuggageInfo[index] = { weight: weightValue };
    setLuggageInfo(newLuggageInfo);
  };

  // Add this function to calculate total weight
  const calculateTotalWeight = () => {
    return luggageInfo.reduce((sum, item) => sum + item.weight, 0);
  };

  const updatePassenger = (
    index: number, 
    field: 'name' | 'age' | 'gender', 
    value: string | number
  ) => {
    const newPassengers = [...passengers];
    newPassengers[index] = {
      ...newPassengers[index] || { name: '', age: 0, gender: '' },
      [field]: value
    };
    setPassengers(newPassengers);
  };

  const handleNext = () => {
    const luggageCharges = calculateLuggageCharges();
    const totalPrice = basePrice + luggageCharges;

    const bookingWithDetails = {
      ...booking,
      luggage: luggageInfo,
      luggageCharges,
      totalPrice,
      travelClass,
      passengers
    };

    const bookingParam = encodeURIComponent(JSON.stringify(bookingWithDetails));
    setLocation(`/seat-selection?booking=${bookingParam}`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Luggage className="h-6 w-6" />
            Passenger Details & Luggage Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">Passenger Details</h3>
            {Array.from({ length: passengerCount }).map((_, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <p className="font-medium">
                  Passenger {index + 1} 
                  {category === "couple" && (index === 0 ? " (Primary)" : " (Secondary)")}
                  {category === "family" && index === 0 && " (Primary)"}
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Name</Label>
                    <Input
                      type="text"
                      placeholder="Enter name"
                      value={passengers[index]?.name || ''}
                      onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Age</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Enter age"
                      value={passengers[index]?.age || ''}
                      onChange={(e) => updatePassenger(index, 'age', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <select
                      className="w-full p-2 border rounded"
                      value={passengers[index]?.gender || ''}
                      onChange={(e) => updatePassenger(index, 'gender', e.target.value)}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                {category === "couple" && (
                  <p className="text-sm text-gray-500">
                    {index === 0 ? "Primary Passenger" : "Secondary Passenger"}
                  </p>
                )}
                {category === "family" && index === 0 && (
                  <p className="text-sm text-gray-500">Primary Passenger</p>
                )}
              </div>
            ))}
          </div>

          <div className="border-t pt-6">
            <h3 className="font-medium mb-4">Luggage Details</h3>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Travel Class: {travelClass}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Weight Limit: {getWeightLimit()}kg per person
              </p>
              <p className="text-sm text-muted-foreground">
                Excess Charge: ₹{TRAVEL_CLASS_CONFIG[travelClass].excessCharge} per kg over limit
              </p>
            </div>

            {luggageInfo.map((luggage, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label>Luggage {index + 1} Weight (kg)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={luggage.weight}
                    onChange={(e) => updateLuggage(index, e.target.value)}
                    placeholder={`Standard limit: ${getWeightLimit()}kg per person`}
                  />
                  {luggage.weight > getWeightLimit() && (
                    <p className="text-sm text-red-500">
                      Extra charges will apply for {luggage.weight - getWeightLimit()}kg excess weight
                    </p>
                  )}
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              onClick={addLuggage}
              disabled={luggageInfo.length >= passengerCount * 2}
              className="w-full"
            >
              Add Another Luggage
            </Button>
          </div>

          <div className="pt-4 border-t">
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">Price Breakdown:</p>
              <p>Base Ticket Price (₹{pricePerPerson.toLocaleString('en-IN')} × {passengerCount}): 
                ₹{basePrice.toLocaleString('en-IN')}</p>
              {calculateLuggageCharges() > 0 && (
                <p>Extra Luggage Charges: ₹{calculateLuggageCharges().toLocaleString('en-IN')}</p>
              )}
              <p className="text-lg font-bold">
                Subtotal: ₹{(basePrice + calculateLuggageCharges()).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-gray-500">
                * Seat selection charges (₹400 per seat × {passengerCount}) will be added in the next step
              </p>
            </div>
            <Button
              className="w-full"
              size="lg"
              onClick={handleNext}
              disabled={luggageInfo.some((l) => l.weight <= 0)}
            >
              Continue to Seat Selection
            </Button>
          </div>

          <div className="summary mt-4 bg-muted p-4 rounded">
            <h3 className="font-medium mb-2">Summary</h3>
            <p>Category: {category}</p>
            <p>Number of Passengers: {passengerCount}</p>
            
            <div className="mt-3 border-t pt-2">
              <p className="font-medium">Passenger Details:</p>
              {passengers.map((passenger, index) => (
                <p key={index} className="ml-4">
                  Passenger {index + 1}: {passenger.name} 
                  (Age: {passenger.age}, Gender: {passenger.gender.charAt(0).toUpperCase() + passenger.gender.slice(1)})
                </p>
              ))}
            </div>

            {checkLuggageLimit().passengerLuggage.map((passenger, index) => (
              <div key={index} className="mt-3 border-t pt-2">
                <p className="font-medium">
                  {passengers[index]?.name || `Passenger ${index + 1}`} (Limit: {getWeightLimit()}kg)
                </p>
                {passenger.pieces.map((piece, pieceIndex) => (
                  <p key={pieceIndex} className="ml-4">
                    Luggage {pieceIndex + 1}: {piece.weight}kg
                    {piece.isOverweight && (
                      <span className="text-red-500 ml-2">
                        (Exceeds {travelClass} limit by {piece.excessWeight.toFixed(1)}kg)
                      </span>
                    )}
                  </p>
                ))}
                <p className="ml-4 text-sm">
                  Total Weight: {passenger.totalWeight}kg
                  {passenger.isOverweight ? (
                    <span className="text-red-500 ml-2">
                      (Exceeds {travelClass} limit by {passenger.excessWeight.toFixed(1)}kg)
                    </span>
                  ) : (
                    <span className="text-green-600 ml-2">(Within limit)</span>
                  )}
                </p>
              </div>
            ))}

            {/* Show warnings for overweight luggage */}
            {checkLuggageLimit().hasOverweight && (
              <div className="mt-4 text-red-500">
                <p>Warning:</p>
                {checkLuggageLimit().overweightPassengers.map((passenger, index) => (
                  <p key={index} className="ml-2">
                    {passengers[passenger.passengerIndex]?.name || `Passenger ${passenger.passengerIndex + 1}`} 
                    exceeds {travelClass} limit by {passenger.excessWeight.toFixed(1)}kg
                  </p>
                ))}
              </div>
            )}
          </div>

          <Button
            variant="outline"
            onClick={optimizeLuggageDistribution}
            className="w-full mt-2"
          >
            Optimize Luggage Distribution
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
