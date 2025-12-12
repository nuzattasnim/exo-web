
import { BUS_NAMES, TIMES, RANDOM_NAMES, DestinationList } from "@/lib/constants";

export interface Bus {
  busname: string;
  busid: string;
  time: string;
  availableSeats: boolean[][];
}

export interface BookedSeat {
  busid: string;
  seatid: string;
  username: string;
  destination: string;
  time: string;
}

const STORAGE_KEYS = {
  BUSES: "exo_buses",
  BOOKED: "exo_booked_seats",
};

export class BusService {
  private static generateSeatLayout(): boolean[][] {
    return Array(10)
      .fill(null)
      .map(() => Array(4).fill(null).map(() => Math.random() > 0.3)); // 70% chance of being true (available)
  }

  private static generateDummyBuses(): Bus[] {
    const buses: Bus[] = [];
    let idCounter = 1;

    // Generate a bus for EVERY combination of Bus Name and Time
    BUS_NAMES.forEach((busDef) => {
        TIMES.forEach((time) => {
            // const busid = `S${20 + idCounter}`; // e.g., S21, S22
            buses.push({
                busname: busDef.name,
                busid: busDef.id,
                time: time,
                availableSeats: this.generateSeatLayout(),
            });
            idCounter++;
        });
    });

    return buses;
  }

  private static generateDummyBookings(buses: Bus[]): BookedSeat[] {
    const bookings: BookedSeat[] = [];
    const usedSeats = new Set<string>();

    buses.forEach((bus) => {
        // Iterate through the seat layout to find booked seats (false)
        bus.availableSeats.forEach((row, rowIndex) => {
            row.forEach((isAvailable, colIndex) => {
                if (!isAvailable) {
                     // If seat is false (booked), generate a booking entry
                     // Construct a seat ID. Assuming format like "BusID-RowCol" e.g., "S24-00" (Row 0, Col 0)
                     // Ensuring it matches the user's example style "S24-00"
                     const seatId = `${bus.busid}-${rowIndex}${colIndex}`;
                     
                     if (!usedSeats.has(seatId)) {
                        const randomUser = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
                        bookings.push({
                            busid: bus.busid,
                            seatid: seatId,
                            username: randomUser,
                            destination: DestinationList[Math.floor(Math.random() * DestinationList.length)],
                            time: bus.time
                        });
                        usedSeats.add(seatId);
                     }
                }
            })
        })
    });

    return bookings;
  }

  static initializeData() {
    if (typeof window === "undefined") return;

    const existingBuses = localStorage.getItem(STORAGE_KEYS.BUSES);
    if (!existingBuses) {
      const buses = this.generateDummyBuses();
      const bookings = this.generateDummyBookings(buses);
      
      localStorage.setItem(STORAGE_KEYS.BUSES, JSON.stringify(buses));
      localStorage.setItem(STORAGE_KEYS.BOOKED, JSON.stringify(bookings));
    }
  }

  static getBuses(): Bus[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.BUSES);
    return data ? JSON.parse(data) : [];
  }

  static getBookedSeats(): BookedSeat[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.BOOKED);
    return data ? JSON.parse(data) : [];
  }
  
  static getMyBookedSeats(): string[] {
      if (typeof window === "undefined") return [];
      const data = localStorage.getItem("exo_my_booked_seats");
      return data ? JSON.parse(data) : [];
  }

  static saveBuses(buses: Bus[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.BUSES, JSON.stringify(buses));
  }

  static saveBookedSeats(seats: BookedSeat[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.BOOKED, JSON.stringify(seats));
  }
  
  static bookSeat(busId: string, rowIndex: number, colIndex: number, userDetails: {username: string, destination: string}) {
      const buses = this.getBuses();
      const bookings = this.getBookedSeats();
      
      const busIndex = buses.findIndex(b => b.busid === busId);
      if (busIndex === -1) return;
      
      const bus = buses[busIndex];
      // Check if already booked
      if (!bus.availableSeats[rowIndex][colIndex]) return; // Already booked
      
      // Update seat to false (booked)
      bus.availableSeats[rowIndex][colIndex] = false;
      buses[busIndex] = bus;
      
      // Add booking
      const seatId = `${busId}-${rowIndex}${colIndex}`;
      bookings.push({
          busid: busId,
          seatid: seatId,
          username: userDetails.username,
          destination: userDetails.destination,
          time: bus.time
      });
      
      // Save to "My Bookings" as well
      const myBookings = this.getMyBookedSeats();
      myBookings.push(seatId);
      localStorage.setItem("exo_my_booked_seats", JSON.stringify(myBookings));
      
      this.saveBuses(buses);
      this.saveBookedSeats(bookings);
  }
}
