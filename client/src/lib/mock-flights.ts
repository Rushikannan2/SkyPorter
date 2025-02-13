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
}

const airlines = [
  "SkyWings",
  "BlueLine",
  "AirSpeed",
  "StarJet",
  "GlobalAir"
];

function generateFlightNumber(): string {
  const prefix = "FL";
  const number = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}${number}`;
}

function generatePrice(flightClass: string): number {
  const basePrice = Math.floor(Math.random() * 300) + 200;
  const multiplier = flightClass === "economy" ? 1 : 
                    flightClass === "business" ? 2.5 : 
                    4; // first class
  return Math.floor(basePrice * multiplier);
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
    departureTime.setHours(Math.floor(Math.random() * 24));
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
      class: flightClass
    });
  }

  return flights.sort((a, b) => a.departureTime.getTime() - b.departureTime.getTime());
}
