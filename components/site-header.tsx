import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
	return (
		<header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 sticky top-0 z-10 w-full">
			<div className="flex items-center gap-2 px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-2 h-4" />
				<span className="font-semibold">My Premium App</span>
			</div>
			<div className="ml-auto px-4">
				<Button variant="ghost" size="sm">
					Login
				</Button>
				<Button size="sm">Get Started</Button>
			</div>
		</header>
	);
}
