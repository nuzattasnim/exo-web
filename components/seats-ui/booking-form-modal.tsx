import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useBuses } from "@/hooks/use-buses";
import { DestinationList } from "@/lib/constants";
import { toast } from "sonner";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon, UserIcon } from "lucide-react";

interface BookingFormModalProps {
	readonly: boolean;
	open: boolean;
	setOpen: (open: boolean) => void;
	busId: string;
	rowIndex: number;
	colIndex: number;
	time: string;
	onSuccess?: () => void;
	bookedUsername?: string;
	bookedDestination?: string;
	isMySeat?: boolean;
}

export const BookingFormModal = ({
	readonly,
	open,
	setOpen,
	busId,
	rowIndex,
	colIndex,
	time,
	onSuccess,
	bookedUsername,
	bookedDestination,
	isMySeat,
}: BookingFormModalProps) => {
	const { bookSeat } = useBuses();

	const [username, setUsername] = useState("");
	const [destination, setDestination] = useState(DestinationList[0]);

	const submitHandler = (e: React.FormEvent) => {
		e.preventDefault();

		if (!username || !destination) return;

		bookSeat(busId, rowIndex, colIndex, {
			username,
			destination,
		});

		toast.success("Seat booked successfully!", {
			description: `Bus ${busId} - Seat ${rowIndex}-${colIndex} for ${username}`,
			duration: 3000,
		});

		setOpen(false);
		setUsername(""); // Reset form
		if (onSuccess) onSuccess();
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
				<div className="grid grid-cols-[160px_1fr] h-full">
					{/* Sidebar Summary */}
					<div className="bg-primary/5 p-6 border-r flex flex-col gap-4">
						<div className="space-y-1">
							<p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
								Bus ID
							</p>
							<p className="font-mono font-bold text-lg">
								{busId}
							</p>
						</div>
						<div className="space-y-1">
							<p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
								Seat
							</p>
							<p className="font-mono font-bold text-lg">
								{String.fromCharCode(65 + rowIndex)}
								{colIndex + 1}
							</p>
						</div>
						<div className="space-y-1">
							<p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
								Time
							</p>
							<div className="flex items-center gap-1.5 text-sm font-medium">
								<CalendarIcon className="h-4 w-4 text-muted-foreground" />
								{time}
							</div>
						</div>
					</div>

					{/* Form Section */}
					<div className="p-6">
						<DialogHeader className="mb-4">
							<DialogTitle>Details</DialogTitle>
						</DialogHeader>

						<form
							onSubmit={submitHandler}
							className="flex flex-col gap-5"
						>
							<div className="space-y-4">
								<div className="space-y-2">
									<p className="text-sm font-medium flex items-center gap-2">
										<UserIcon className="h-4 w-4" />{" "}
										Passenger Name
									</p>
									{readonly ? (
										<div className="p-2 border rounded-md bg-muted/50 text-sm">
											{bookedUsername ||
												username ||
												"John Doe"}
										</div>
									) : (
										<Input
											id="passenger_name"
											placeholder="e.g. John Doe"
											required
											value={username}
											onChange={(e) =>
												setUsername(e.target.value)
											}
										/>
									)}
								</div>

								<div className="space-y-2">
									<p className="text-sm font-medium flex items-center gap-2">
										<MapPinIcon className="h-4 w-4" />{" "}
										Destination
									</p>
									{readonly ? (
										<div className="p-2 border rounded-md bg-muted/50 text-sm">
											{bookedDestination || destination}
										</div>
									) : (
										<Select
											value={destination}
											onValueChange={setDestination}
										>
											<SelectTrigger id="destination-select">
												<SelectValue placeholder="Select destination" />
											</SelectTrigger>
											<SelectContent>
												{DestinationList.map(
													(
														item: string,
														index: number
													) => (
														<SelectItem
															key={index}
															value={item}
														>
															{item}
														</SelectItem>
													)
												)}
											</SelectContent>
										</Select>
									)}
								</div>
							</div>

							<div className="flex justify-end gap-2 mt-2">
								<Button
									variant="outline"
									type="button"
									onClick={() => setOpen(false)}
								>
									{readonly ? "Close" : "Cancel"}
								</Button>
								{!readonly && (
									<Button type="submit">
										Confirm Booking
									</Button>
								)}
							</div>
						</form>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
