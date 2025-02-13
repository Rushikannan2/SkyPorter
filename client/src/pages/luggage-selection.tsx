import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Luggage } from "lucide-react";

interface LuggageInfo {
  weight: string;
  count: string;
}

export default function LuggageSelection() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const bookingData = searchParams.get("booking");
  const [luggageInfo, setLuggageInfo] = useState<LuggageInfo[]>([{ weight: "", count: "1" }]);
  
  if (!bookingData) {
    setLocation("/flights");
    return null;
  }

  const booking = JSON.parse(decodeURIComponent(bookingData));
  const passengerCount = booking.passengerCount;

  const addLuggage = () => {
    setLuggageInfo([...luggageInfo, { weight: "", count: "1" }]);
  };

  const updateLuggage = (index: number, field: keyof LuggageInfo, value: string) => {
    const newLuggageInfo = [...luggageInfo];
    newLuggageInfo[index] = { ...newLuggageInfo[index], [field]: value };
    setLuggageInfo(newLuggageInfo);
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
          </div>

          {luggageInfo.map((luggage, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium">Luggage {index + 1}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Weight (kg)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="32"
                    value={luggage.weight}
                    onChange={(e) => updateLuggage(index, "weight", e.target.value)}
                    placeholder="Max 32 kg"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Number of Bags</Label>
                  <Input
                    type="number"
                    min="1"
                    max="3"
                    value={luggage.count}
                    onChange={(e) => updateLuggage(index, "count", e.target.value)}
                    placeholder="Max 3 bags"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button 
            variant="outline" 
            onClick={addLuggage}
            disabled={luggageInfo.length >= 3}
            className="w-full"
          >
            Add Another Luggage
          </Button>

          <div className="pt-4 border-t">
            <Button className="w-full" size="lg">
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
