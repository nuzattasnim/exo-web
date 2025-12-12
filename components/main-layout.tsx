"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function MainLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	// Add paths where you want to hide the sidebar and navbar
	// for example: const hiddenPaths = ["/login", "/signup"];
	// const isHidden = hiddenPaths.includes(pathname);

	// For demonstration, let's assume no paths are hidden by default yet,
	// but the structure is here to easily add them.
	const hiddenPaths: string[] = ["/hidden-example"];
	const isHidden = hiddenPaths.includes(pathname);

	if (isHidden) {
		return <main className="min-h-screen w-full">{children}</main>;
	}

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="!bg-transparent">
				<SiteHeader />
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
