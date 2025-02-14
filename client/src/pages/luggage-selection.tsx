import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Luggage } from "lucide-react";

interface LuggageInfo {
  weight: string;
}

export default function LuggageSelection() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const bookingData = searchParams.get("booking");
  const [luggageInfo, setLuggageInfo] = useState<LuggageInfo[]>([{ weight: "" }]);

  if (!bookingData) {
    setLocation("/flights");
    return null;
  }

  const booking = JSON.parse(decodeURIComponent(bookingData));
  const passengerCount = booking.passengerCount;
  const travelClass = booking.travelClass || "Economy"; // Default to Economy

  // Define max weight limits based on class
  const weightLimits: Record<string, number> = {
    Economy: 20,
    Business: 30,
    "First Class": 40,
  };
  const maxWeight = weightLimits[travelClass] || 20;

  const addLuggage = () => {
    setLuggageInfo([...luggageInfo, { weight: "" }]);
  };

  const updateLuggage = (index: number, weight: string) => {
    const newLuggageInfo = [...luggageInfo];
    newLuggageInfo[index] = { weight };
    setLuggageInfo(newLuggageInfo);
  };

  const handleNext = () => {
    const bookingWithLuggage = {
      ...booking,
      luggage: luggageInfo,
    };
    const bookingParam = encodeURIComponent(JSON.stringify(bookingWithLuggage));
    setLocation(`/seat-selection?booking=${bookingParam}`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Luggage className="h-6 w-6" />
            Luggage Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Total Passengers: {passengerCount}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Class: {travelClass} (Max {maxWeight}kg per luggage)
            </p>
          </div>

          {luggageInfo.map((luggage, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label>Luggage {index + 1} Weight (kg)</Label>
                <Input
                  type="number"
                  min="0"
                  max={maxWeight} // Dynamically set based on class
                  value={luggage.weight}
                  onChange={(e) => updateLuggage(index, e.target.value)}
                  placeholder={`Max ${maxWeight} kg`}
                />
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

          <div className="pt-4 border-t">
            <Button
              className="w-full"
              size="lg"
              onClick={handleNext}
              disabled={luggageInfo.some((l) => !l.weight || Number(l.weight) <= 0)}
            >
              Continue to Seat Selection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
