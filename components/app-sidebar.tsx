"use client";

import * as React from "react";
import { ShieldCheck, Ticket } from "lucide-react";
import { usePathname } from "next/navigation";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";


// Menu items.
const items = [
	{
		title: "Booking",
		url: "/",
		icon: Ticket,
	},
	{
		title: "Admin",
		url: "/admin",
		icon: ShieldCheck,
	},
];

export function AppSidebar() {
	const pathname = usePathname();
	return (
		<Sidebar>
			<SidebarHeader className="p-0 gap-0">
				<div className="flex items-center justify-center h-16 py-4 font-bold text-xl">
					Selise Bus
				</div>
				<img src="/bus.jpg" alt="Bus" className="w-full object-cover" />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										isActive={pathname === item.url}
									>
										<Link href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
