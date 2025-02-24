import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Luggage, Users, Calendar, Clock, PartyPopper } from "lucide-react";

// Simple confetti animation using CSS
const Confetti = () => (
  <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
    <div className="animate-confetti-1" />
    <div className="animate-confetti-2" />
    <div className="animate-confetti-3" />
    <div className="animate-confetti-4" />
    <div className="animate-confetti-5" />
    <div className="animate-confetti-6" />
  </div>
);

interface BookingConfirmationProps {
  // Add any props you need
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = () => {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const bookingData = searchParams.get("booking");

  if (!bookingData) {
    setLocation("/flights");
    return null;
  }

  const booking = JSON.parse(decodeURIComponent(bookingData));

  return (
    <div className="container mx-auto px-4 py-12">
      <Confetti />
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="text-center mb-6 animate-fadeIn">
            <PartyPopper className="h-16 w-16 mx-auto mb-4 text-yellow-500 animate-bounce" />
            <h1 className="text-3xl font-bold text-green-600 mb-2 animate-slideUp">
              Congratulations!
            </h1>
            <p className="text-gray-600 animate-slideUp animation-delay-200">
              Your flight has been successfully booked
            </p>
          </div>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plane className="h-6 w-6" />
              Booking Confirmation
            </div>
            <p className="text-sm text-muted-foreground">
              Booking ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
            </p>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Flight Details */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h3 className="font-medium flex items-center gap-2">
              <Plane className="h-4 w-4" /> Flight Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Airline</p>
                <p>{booking.flight.airline}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Flight Number</p>
                <p>{booking.flight.flightNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">From</p>
                <p>{booking.flight.from}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">To</p>
                <p>{booking.flight.to}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(booking.flight.departureTime).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {new Date(booking.flight.departureTime).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          {/* Passenger Details */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Users className="h-4 w-4" /> Passenger Details
            </h3>
            {booking.passengers.map((passenger: any, index: number) => (
              <div key={index} className="border p-4 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p>{passenger.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p>{passenger.age} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p>{passenger.gender.charAt(0).toUpperCase() + passenger.gender.slice(1)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Seat</p>
                    <p>Seat {booking.selectedSeats[index]}</p>
                  </div>
                </div>

                {/* Luggage Details per Passenger */}
                <div className="mt-4 border-t pt-4">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Luggage className="h-4 w-4" /> Luggage Details
                  </p>
                  {booking.luggage
                    .slice(index * Math.ceil(booking.luggage.length / booking.passengerCount), 
                           (index + 1) * Math.ceil(booking.luggage.length / booking.passengerCount))
                    .map((item: any, luggageIndex: number) => (
                      <p key={luggageIndex} className="ml-4">
                        Luggage {luggageIndex + 1}: {item.weight}kg
                      </p>
                    ))
                  }
                </div>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Price Breakdown</h3>
            <div className="space-y-2">
              <p className="flex justify-between">
                <span>Base Ticket Price (₹{booking.pricePerPerson.toLocaleString('en-IN')} × {booking.passengerCount})</span>
                <span>₹{booking.basePrice.toLocaleString('en-IN')}</span>
              </p>
              {booking.luggageCharges > 0 && (
                <p className="flex justify-between">
                  <span>Excess Luggage Charges</span>
                  <span>₹{booking.luggageCharges.toLocaleString('en-IN')}</span>
                </p>
              )}
              <p className="flex justify-between">
                <span>Seat Selection (₹400 × {booking.selectedSeats.length})</span>
                <span>₹{(booking.selectedSeats.length * 400).toLocaleString('en-IN')}</span>
              </p>
              <p className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total Amount</span>
                <span>₹{booking.totalPrice.toLocaleString('en-IN')}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button 
              className="flex-1"
              onClick={() => window.print()}
            >
              Download Ticket
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setLocation("/flights")}
            >
              Book Another Flight
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Add these styles to your global CSS file (app.css or similar)
const styles = `
.animate-confetti-1,
.animate-confetti-2,
.animate-confetti-3,
.animate-confetti-4,
.animate-confetti-5,
.animate-confetti-6 {
  width: 10px;
  height: 10px;
  background-color: #ff0000;
  position: absolute;
  animation: confetti 5s ease-in-out infinite;
}

.animate-confetti-2 { background-color: #00ff00; animation-delay: 0.2s; }
.animate-confetti-3 { background-color: #0000ff; animation-delay: 0.4s; }
.animate-confetti-4 { background-color: #ffff00; animation-delay: 0.6s; }
.animate-confetti-5 { background-color: #ff00ff; animation-delay: 0.8s; }
.animate-confetti-6 { background-color: #00ffff; animation-delay: 1s; }

@keyframes confetti {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}
`;

export default BookingConfirmation; 