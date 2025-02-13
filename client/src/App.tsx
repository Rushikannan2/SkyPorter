import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/layout/navbar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Components from "@/pages/components";
import FlightSearch from "@/pages/flight-search";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/components" component={Components} />
          <Route path="/flights" component={FlightSearch} />
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