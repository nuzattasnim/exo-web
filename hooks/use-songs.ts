import { useState, useEffect } from "react"
import { Song, SongService } from "@/lib/services/song.service"

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setIsLoading(true)
        const data = await SongService.getSongs()
        setSongs(data)
      } catch (err) {
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSongs()
  }, [])

  return { songs, isLoading, error }
}
