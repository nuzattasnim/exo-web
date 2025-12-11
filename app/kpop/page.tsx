import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import axios from "axios";

interface Song {
	id: number;
	title: string;
	artist: string;
	album: string;
	year: number;
}

async function getSongs() {
	try {
		const res = await axios.get<Song[]>(
			"https://exo-service.vercel.app/api/kpop"
		);
		return res.data;
	} catch (error) {
		console.error("Failed to fetch songs", error);
		return [];
	}
}

export default async function KpopPage() {
	const songs = await getSongs();

	return (
		<div className="flex flex-1 flex-col gap-8 p-4 md:p-8 animate-in fade-in duration-500">
			<div className="flex items-center justify-between space-y-2">
				<div>
					<h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
						K-Pop Hits
					</h2>
					<p className="text-muted-foreground">
						Top trending K-Pop songs fetched live.
					</p>
				</div>
			</div>

			<div className="rounded-xl border bg-card shadow-sm text-card-foreground">
				<Table>
					<TableCaption>A list of popular K-Pop songs.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]">ID</TableHead>
							<TableHead>Title</TableHead>
							<TableHead>Artist</TableHead>
							<TableHead>Album</TableHead>
							<TableHead className="text-right">Year</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{songs.length > 0 ? (
							songs.map((song) => (
								<TableRow
									key={song.id}
									className="hover:bg-muted/50 transition-colors"
								>
									<TableCell className="font-medium">
										{song.id}
									</TableCell>
									<TableCell className="font-semibold text-primary">
										{song.title}
									</TableCell>
									<TableCell>{song.artist}</TableCell>
									<TableCell>{song.album}</TableCell>
									<TableCell className="text-right">
										{song.year}
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={5}
									className="h-24 text-center"
								>
									No songs found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
