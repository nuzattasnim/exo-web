import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<div className="flex flex-1 flex-col items-center justify-center min-h-[50vh] space-y-8 text-center animate-in fade-in zoom-in duration-500">
			<div className="space-y-4">
				<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
					Welcome to the Future
				</h1>
				<p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
					Experience the next generation of web applications. Built
					with precision, designed for you.
				</p>
			</div>

			<div className="flex items-center gap-4">
				<Button
					size="lg"
					className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all"
				>
					Get Started
				</Button>
				<Button
					size="lg"
					variant="outline"
					className="rounded-full px-8 hover:bg-secondary/80"
				>
					Learn More
				</Button>
			</div>
		</div>
	);
}
