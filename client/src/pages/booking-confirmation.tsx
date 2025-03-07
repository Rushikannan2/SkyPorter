import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Luggage, Users, Calendar, Clock } from "lucide-react";

export const BookingConfirmation: React.FC = () => {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const searchParams = new URLSearchParams(window.location.search);
  const bookingData = searchParams.get("booking");

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    // Show content with delay
    setTimeout(() => {
      setShowContent(true);
    }, 3500);
  }, []);

  if (!bookingData) {
    setLocation("/flights");
    return null;
  }

  const booking = JSON.parse(decodeURIComponent(bookingData));
  
  // Add default values if they don't exist
  booking.selectedSeats = booking.selectedSeats || [];
  booking.luggage = booking.luggage || [];
  booking.passengerCount = booking.passengerCount || 1;

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Plane className="h-8 w-8 text-blue-500 animate-pulse" />
            </div>
          </div>
          <p className="text-lg text-gray-600 animate-pulse">Confirming your booking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 relative">
      {/* Flying Planes Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="animate-fly-across-1 absolute">✈️</div>
        <div className="animate-fly-across-2 absolute">🛩️</div>
        <div className="animate-fly-across-3 absolute">✈️</div>
      </div>

      {/* Celebration Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="animate-float-up-slow absolute -top-10 left-1/4 text-6xl">🎉</div>
        <div className="animate-float-up-medium absolute -top-10 left-1/2 text-6xl">✨</div>
        <div className="animate-float-up-fast absolute -top-10 right-1/4 text-6xl">🎊</div>
      </div>

      <Card className={`max-w-3xl mx-auto shadow-lg transform transition-all duration-1000 ${
        showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        <CardHeader className="text-center border-b bg-gradient-to-r from-green-50 to-blue-50">
          <div className="mb-6 space-y-2">
            <div className="text-6xl animate-bounce-slow mx-auto w-fit">✈️</div>
            <h1 className="text-3xl font-bold text-green-600 animate-fade-in">
              Booking Confirmed!
            </h1>
            <p className="text-gray-600 animate-fade-in-delay">
              Your journey is set to begin
            </p>
            <div className="text-sm text-muted-foreground animate-fade-in-delay-2">
              Booking ID: <span className="font-mono font-bold">{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 p-6">
          {/* Flight Details */}
          <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2 text-lg">
              <Plane className="h-5 w-5" /> Flight Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Airline</p>
                    <p className="font-medium">{booking.flight?.airline || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Flight Number</p>
                    <p className="font-medium">{booking.flight?.flightNumber || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="text-sm text-gray-500">From</p>
                    <p className="font-medium">{booking.flight?.departureCity || 'N/A'}</p>
                  </div>
                  <div className="text-2xl text-blue-500">→</div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">To</p>
                    <p className="font-medium">{booking.flight?.arrivalCity || 'N/A'}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {booking.flight?.departureTime ? new Date(booking.flight.departureTime).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {booking.flight?.departureTime ? new Date(booking.flight.departureTime).toLocaleTimeString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Passenger Details */}
          {(booking.passengers || []).map((passenger: any, index: number) => (
            <div key={index} className="rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-xl">
                <h4 className="font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Passenger {index + 1}
                </h4>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{passenger?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-medium">{passenger?.age ? `${passenger.age} years` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">{passenger?.gender ? passenger.gender.charAt(0).toUpperCase() + passenger.gender.slice(1) : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Seat</p>
                    <p className="font-medium">{booking.selectedSeats[index] || 'Not assigned'}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Luggage className="h-4 w-4" />
                    <p className="text-sm text-gray-500">Luggage Details</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(booking.luggage || [])
                      .slice(index * Math.ceil(booking.luggage.length / booking.passengerCount), 
                             (index + 1) * Math.ceil(booking.luggage.length / booking.passengerCount))
                      .map((item: any, luggageIndex: number) => (
                        <div key={luggageIndex} className="bg-gray-50 p-2 rounded">
                          Luggage {luggageIndex + 1}: <span className="font-medium">{item?.weight || 0}kg</span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Price Breakdown */}
          <div className="rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-6">
            <h3 className="font-semibold mb-4">Price Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Base Ticket Price (₹{(booking.pricePerPerson || 0).toLocaleString('en-IN')} × {booking.passengerCount})</span>
                <span className="font-medium">₹{(booking.basePrice || 0).toLocaleString('en-IN')}</span>
              </div>
              {(booking.luggageCharges || 0) > 0 && (
                <div className="flex justify-between items-center text-orange-600">
                  <span>Excess Luggage Charges</span>
                  <span className="font-medium">₹{(booking.luggageCharges || 0).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span>Seat Selection (₹400 × {booking.selectedSeats?.length || 0})</span>
                <span className="font-medium">₹{((booking.selectedSeats?.length || 0) * 400).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t mt-2 text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-green-600">₹{(booking.totalPrice || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700"
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

export default BookingConfirmation; 