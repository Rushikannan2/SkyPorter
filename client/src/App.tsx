import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/layout/navbar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Components from "@/pages/components";
import FlightSearch from "@/pages/flight-search";
import FlightResults from "@/pages/flight-results";
import FlightBooking from "@/pages/flight-booking";
import LuggageSelection from "@/pages/luggage-selection";
import SeatSelection from "@/pages/seat-selection";
import BookingConfirmation from "@/pages/booking-confirmation";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Switch>
          <Route path="/" component={FlightSearch} />
          <Route path="/flights" component={FlightSearch} />
          <Route path="/flight-results" component={FlightResults} />
          <Route path="/flight-booking" component={FlightBooking} />
          <Route path="/luggage-selection" component={LuggageSelection} />
          <Route path="/seat-selection" component={SeatSelection} />
          <Route path="/components" component={Components} />
          <Route path="/booking-confirmation" component={BookingConfirmation} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;