"use client";

import { useEffect, useState } from "react";
import { useBuses } from "@/hooks/use-buses";
import { useSearchParams } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingFormModal } from "./components/seats-ui/booking-form-modal";
import BookedSeatModal from "./components/seats-ui/booked-seat-modal";

export default function SeatsPage({
	readonly: propReadonly = false,
}: {
	readonly?: boolean;
}) {
	const { buses, bookedSeats, isLoading, refreshData, myBookedSeats } =
		useBuses();
	const searchParams = useSearchParams();

	// Determine values from props OR URL params
	const urlReadonly = searchParams.get("readonly") === "true";
	const readonly = propReadonly || urlReadonly;

	const urlBusName = searchParams.get("busName");
	const urlTime = searchParams.get("time");

	const [selectedBusName, setSelectedBusName] = useState<string>("");
	const [selectedTime, setSelectedTime] = useState<string>("");

	// Extract unique options
	const busNames = Array.from(new Set(buses.map((b) => b.busname)));
	const times = Array.from(new Set(buses.map((b) => b.time)));

	const [isBookingFormModalOpen, setIsBookingFormModalOpen] = useState(false);
	const [isBookedModalOpen, setIsBookedModalOpen] = useState(false);
	const [selectedSeat, setSelectedSeat] = useState({
		rowIndex: 0,
		colIndex: 0,
	});

	// Set defaults when data loads OR when URL params change
	useEffect(() => {
		if (urlBusName) {
			setSelectedBusName(urlBusName);
		} else if (!selectedBusName && busNames.length > 0) {
			setSelectedBusName(busNames[0]);
		}

		if (urlTime) {
			setSelectedTime(urlTime);
		} else if (!selectedTime && times.length > 0) {
			setSelectedTime(times[0]);
		}
	}, [
		buses,
		busNames,
		times,
		selectedBusName,
		selectedTime,
		urlBusName,
		urlTime,
	]);

	const currentBus = buses.find(
		(b) => b.busname === selectedBusName && b.time === selectedTime
	);

	const seatClickHandler = (
		isAvailable: boolean,
		rowIndex: number,
		colIndex: number
	) => {
		setSelectedSeat({ rowIndex, colIndex });

		if (readonly) {
			if (isAvailable) return;
			setIsBookingFormModalOpen(true);
			return;
		}
		if (!isAvailable) {
			setIsBookedModalOpen(true);
			return;
		}
		setIsBookingFormModalOpen(true);
	};

	if (isLoading) {
		return <div className="p-10">Loading bus data...</div>;
	}

	return (
		<div className="flex flex-col gap-6 p-10">
			{!readonly && (
				<>
					<h1 className="text-2xl font-bold">Search Buses</h1>
					<div className="flex gap-4">
						<div className="w-[200px]">
							<label className="mb-2 block text-sm font-medium">
								Bus Name
							</label>
							<Select
								value={selectedBusName}
								onValueChange={setSelectedBusName}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select Bus" />
								</SelectTrigger>
								<SelectContent>
									{busNames.map((name) => (
										<SelectItem key={name} value={name}>
											{name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="w-[200px]">
							<label className="mb-2 block text-sm font-medium">
								Time
							</label>
							<Select
								value={selectedTime}
								onValueChange={setSelectedTime}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select Time" />
								</SelectTrigger>
								<SelectContent>
									{times.map((time) => (
										<SelectItem key={time} value={time}>
											{time}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</>
			)}

			<Card className="w-fit">
				<CardHeader>
					<CardTitle>Seat Availability</CardTitle>
				</CardHeader>
				<CardContent>
					{currentBus ? (
						<div className="flex flex-col gap-2">
							{/* <p className="text-sm text-muted-foreground mb-4">
								Bus ID: {currentBus.busid}
							</p> */}

							<div className="flex flex-col gap-2 p-4 bg-muted/20 rounded-lg">
								<div className="text-center font-bold mb-2">
									DRIVER
								</div>
								{currentBus.availableSeats.map(
									(row, rowIndex) => (
										<div
											key={rowIndex}
											className="flex gap-4 justify-center"
										>
											{row.map(
												(isAvailable, colIndex) => {
													const seatId = `${currentBus.busid}-${rowIndex}${colIndex}`;
													const isMapSeatMine =
														myBookedSeats.includes(
															seatId
														);

													const seatLabel = `${String.fromCharCode(
														65 + rowIndex
													)}${colIndex + 1}`;

													return (
														<div
															key={`${rowIndex}-${colIndex}`}
															className={`
                          h-10 w-10 flex items-center justify-center rounded-md border text-xs font-mono cursor-pointer
                          ${
								isAvailable
									? "border-gray-500 text-gray-500 hover:bg-gray-100"
									: isMapSeatMine && !readonly
									? "bg-green-500 border-green-600 text-white"
									: "bg-gray-300 border-gray-500 text-gray-500"
							}
                ${colIndex === 1 && "mr-10"}
                        `}
															onClick={() =>
																seatClickHandler(
																	isAvailable,
																	rowIndex,
																	colIndex
																)
															}
														>
															{seatLabel}
														</div>
													);
												}
											)}
										</div>
									)
								)}
							</div>
						</div>
					) : (
						<div className="text-muted-foreground">
							No bus found for the selected combination.
						</div>
					)}
				</CardContent>
			</Card>
			<BookingFormModal
				readonly={readonly}
				open={isBookingFormModalOpen}
				setOpen={setIsBookingFormModalOpen}
				busId={currentBus?.busid as string}
				rowIndex={selectedSeat.rowIndex}
				colIndex={selectedSeat.colIndex}
				time={currentBus?.time as string}
				onSuccess={refreshData}
				// Pass booked details if available
				bookedUsername={
					bookedSeats.find(
						(s) =>
							s.busid === currentBus?.busid &&
							s.seatid ===
								`${currentBus?.busid}-${selectedSeat.rowIndex}${selectedSeat.colIndex}`
					)?.username
				}
				bookedDestination={
					bookedSeats.find(
						(s) =>
							s.busid === currentBus?.busid &&
							s.seatid ===
								`${currentBus?.busid}-${selectedSeat.rowIndex}${selectedSeat.colIndex}`
					)?.destination
				}
				isMySeat={myBookedSeats.includes(
					`${currentBus?.busid}-${selectedSeat.rowIndex}${selectedSeat.colIndex}`
				)}
			/>
			<BookedSeatModal
				open={isBookedModalOpen}
				setOpen={setIsBookedModalOpen}
				isMySeat={myBookedSeats.includes(
					`${currentBus?.busid}-${selectedSeat.rowIndex}${selectedSeat.colIndex}`
				)}
			/>
		</div>
	);
}
