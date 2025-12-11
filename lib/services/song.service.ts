import axios from "axios"

export interface Song {
  id: number
  title: string
  artist: string
  album: string
  year: number
}

export const SongService = {
  getSongs: async (): Promise<Song[]> => {
    try {
      const res = await axios.get<Song[]>("https://exo-service.vercel.app/api/kpop")
      return res.data
    } catch (error) {
      console.error("Failed to fetch songs", error)
      throw error
    }
  },
}
