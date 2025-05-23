import { addHours, format } from "date-fns";

export interface Flight {
  id: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: Date;
  arrivalTime: Date;
  price: number;
  airline: string;
  flightNumber: string;
  class: string;
  duration: string;
}

const airlines = [
  "IndiGo",
  "Air India",
  "SpiceJet",
  "Vistara",
  "Go First"
];

function generateFlightNumber(): string {
  const prefix = "FL";
  const number = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}${number}`;
}

function generatePrice(flightClass: string): number {
  // Base price between ₹3,500 and ₹4,500
  const basePrice = Math.floor(Math.random() * 1000) + 3500;
  
  // Adjust multiplier for different classes
  const multiplier = flightClass === "economy" ? 1 : 
                    flightClass === "business" ? 1.2 : 
                    1.5; // first class - keeping the increase modest
  
  return Math.floor(basePrice * multiplier);
}

function calculateDuration(startTime: Date, endTime: Date): string {
  const diff = endTime.getTime() - startTime.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

export function generateFlights(
  departureCity: string,
  arrivalCity: string,
  date: Date,
  flightClass: string
): Flight[] {
  const flights: Flight[] = [];
  const numFlights = Math.floor(Math.random() * 5) + 3; // Generate 3-7 flights

  for (let i = 0; i < numFlights; i++) {
    const departureTime = new Date(date);
    // Generate flights between 6 AM and 10 PM
    const hour = Math.floor(Math.random() * 16) + 6;
    departureTime.setHours(hour);
    departureTime.setMinutes(Math.floor(Math.random() * 4) * 15); // Round to nearest 15 mins

    const flightDuration = Math.floor(Math.random() * 3) + 1; // 1-3 hours
    const arrivalTime = addHours(departureTime, flightDuration);

    flights.push({
      id: `flight-${i}`,
      departureCity,
      arrivalCity,
      departureTime,
      arrivalTime,
      price: generatePrice(flightClass),
      airline: airlines[Math.floor(Math.random() * airlines.length)],
      flightNumber: generateFlightNumber(),
      class: flightClass,
      duration: calculateDuration(departureTime, arrivalTime)
    });
  }

  return flights.sort((a, b) => a.departureTime.getTime() - b.departureTime.getTime());
}

export const mockFlights: Flight[] = [
  {
    id: "1",
    airline: "IndiGo",
    flightNumber: "6E-123",
    departureCity: "Mumbai",
    arrivalCity: "Delhi",
    departureTime: new Date("2024-03-20T10:00:00"),
    arrivalTime: new Date("2024-03-20T12:00:00"),
    duration: "2h 00m",
    price: 3500,  // Minimum base price
    class: "economy"
  },
  {
    id: "2",
    airline: "Air India",
    flightNumber: "AI-456",
    departureCity: "Mumbai",
    arrivalCity: "Delhi",
    departureTime: new Date("2024-03-20T14:00:00"),
    arrivalTime: new Date("2024-03-20T16:15:00"),
    duration: "2h 15m",
    price: 3800,  // Mid-range base price
    class: "business"
  },
  {
    id: "3",
    airline: "SpiceJet",
    flightNumber: "SG-789",
    departureCity: "Mumbai",
    arrivalCity: "Delhi",
    departureTime: new Date("2024-03-20T16:30:00"),
    arrivalTime: new Date("2024-03-20T18:30:00"),
    duration: "2h 00m",
    price: 4200,  // Higher base price
    class: "economy"
  },
  {
    id: "4",
    airline: "Vistara",
    flightNumber: "UK-101",
    departureCity: "Mumbai",
    arrivalCity: "Delhi",
    departureTime: new Date("2024-03-20T19:00:00"),
    arrivalTime: new Date("2024-03-20T21:00:00"),
    duration: "2h 00m",
    price: 4500,  // Maximum base price
    class: "first"
  }
];