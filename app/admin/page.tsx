"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBuses } from "@/hooks/use-buses";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightIcon, BusFrontIcon, Loader2 } from "lucide-react";

import { BUS_NAMES, TIMES } from "@/lib/constants";

export default function AdminPage() {
	const router = useRouter();
	const { isLoading } = useBuses();
	const [selectedBusName, setSelectedBusName] = useState<string>("");
	const [selectedTime, setSelectedTime] = useState<string>("");

	const handleNavigate = () => {
		if (!selectedBusName || !selectedTime) return;

		// Navigate to seats-ui with query params
		const queryParams = new URLSearchParams({
			readonly: "true",
			busName: selectedBusName,
			time: selectedTime,
		});

		router.push(`/?${queryParams.toString()}`);
	};

	if (isLoading)
		return (
			<div className="flex justify-center items-center p-10 min-h-[50vh]">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);

	return (
		<div className="flex flex-col gap-8 p-10 max-w-[90%] w-[680px] mx-auto">
			<div className="flex justify-between items-start">
				<div className="space-y-2">
					<h1 className="text-3xl font-bold tracking-tight">
						Admin Panel
					</h1>
					<p className="text-muted-foreground">
						Select a bus and schedule to view the booked seats.
					</p>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Bus Configuration</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-6">
					<div className="grid grid-cols-2 gap-6">
						<div className="space-y-2">
							<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Bus Name
							</label>
							<Select
								value={selectedBusName}
								onValueChange={setSelectedBusName}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select a Bus" />
								</SelectTrigger>
								<SelectContent>
									{BUS_NAMES.map((bus) => (
										<SelectItem
											key={bus.id}
											value={bus.name}
										>
											{bus.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Time
							</label>
							<Select
								value={selectedTime}
								onValueChange={setSelectedTime}
								disabled={!selectedBusName}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select Time" />
								</SelectTrigger>
								<SelectContent>
									{TIMES.map((time) => (
										<SelectItem key={time} value={time}>
											{time}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{selectedBusName && selectedTime && (
						<div className="flex justify-end pt-4 border-t">
							<Button
								size="lg"
								className="gap-2"
								onClick={handleNavigate}
							>
								<BusFrontIcon className="h-5 w-5" />
								View Seats of ({selectedBusName})
								<ArrowRightIcon className="h-4 w-4 ml-2" />
							</Button>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
