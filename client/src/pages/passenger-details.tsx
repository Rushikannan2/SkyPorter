import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Luggage } from "lucide-react";
import { cn } from "@/lib/utils";

type Gender = "male" | "female" | "other";

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" }
];

export default function PassengerDetails() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender | "">("");

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black dark:text-white text-2xl">
            <Luggage className="h-6 w-6" />
            Passenger Details & Luggage Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">Passenger 1</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-black dark:text-white font-medium">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background text-black dark:text-white border-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age" className="text-black dark:text-white font-medium">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="bg-background text-black dark:text-white border-input"
                />
              </div>
            </div>

            <div className="mt-6">
              <Label className="text-black dark:text-white font-medium mb-3 block">Gender</Label>
              <div className="grid grid-cols-3 gap-3">
                {genderOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setGender(option.value as Gender)}
                    className={cn(
                      "p-4 rounded-md text-base font-bold transition-colors border-2",
                      gender === option.value
                        ? "bg-yellow-500 text-black border-yellow-600 hover:bg-yellow-600"
                        : "bg-yellow-100 dark:bg-yellow-500 text-black border-yellow-200 dark:border-yellow-600 hover:bg-yellow-200 dark:hover:bg-yellow-600"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Luggage Details</h3>
            <div className="space-y-2 text-black dark:text-white">
              <p>Travel Class: Economy</p>
              <p>Weight Limit: 20kg per person</p>
              <p>Excess Charge: ₹3000 per kg over limit</p>
            </div>
          </div>

          <Button 
            className="w-full bg-primary text-white hover:bg-primary/90" 
            size="lg"
          >
            Continue to Seat Selection
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 