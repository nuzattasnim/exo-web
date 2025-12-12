import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Dialog } from "@radix-ui/react-dialog";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const BookedSeatModal = ({
	open,
	setOpen,
	isMySeat,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
	isMySeat: boolean;
}) => {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogTitle className="sr-only">Seat Unavailable</DialogTitle>
				<div className="flex flex-col items-center justify-center p-6 text-center gap-4">
					<div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
						<AlertCircle className="h-6 w-6 text-red-600" />
					</div>
					<div className="space-y-2">
						<h3 className="font-semibold text-lg tracking-tight">
							Seat Unavailable
						</h3>
						<p className="text-sm text-muted-foreground">
							{isMySeat
								? "You have already booked this seat."
								: "This seat has already been booked by another passenger. Please select a different seat."}
						</p>
					</div>
					<Button
						className="w-full mt-2"
						variant="outline"
						onClick={() => setOpen(false)}
					>
						Close
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default BookedSeatModal;
