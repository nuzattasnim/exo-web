
import { useState, useEffect } from "react";
import { Bus, BookedSeat, BusService } from "@/lib/services/bus.service";

export function useBuses() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [bookedSeats, setBookedSeats] = useState<BookedSeat[]>([]);
  const [myBookedSeats, setMyBookedSeats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and load data on mount
  useEffect(() => {
    BusService.initializeData();
    refreshData();
  }, []);

  const refreshData = () => {
    setBuses(BusService.getBuses());
    setBookedSeats(BusService.getBookedSeats());
    setMyBookedSeats(BusService.getMyBookedSeats());
    setIsLoading(false);
  };

  const bookSeat = (busId: string, rowIndex: number, colIndex: number, userDetails: { username: string; destination: string }) => {
    BusService.bookSeat(busId, rowIndex, colIndex, userDetails);
    refreshData();
  };

  // If you need to manually set/modify items as requested
  const updateBuses = (newBuses: Bus[]) => {
      BusService.saveBuses(newBuses);
      refreshData();
  }

  const updateBookings = (newBookings: BookedSeat[]) => {
      BusService.saveBookedSeats(newBookings);
      refreshData();
  }

  return {
    buses,
    bookedSeats,
    myBookedSeats,
    isLoading,
    bookSeat,
    updateBuses,
    updateBookings,
    refreshData
  };
}
