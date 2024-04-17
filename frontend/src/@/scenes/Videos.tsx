import VideoCard from '@/components/VideoCard'
import { getAllVideos, localVideoDetails } from '@/lib/FileSystemManager'
import { useEffect, useState } from 'react'

export default function Videos() {
  const [videos, setVideos] = useState<localVideoDetails[]>([])

  useEffect(() => {
    getAllVideos().then(setVideos)
  }, [])

  if (!videos.length) return <p>No videos downloaded yet!</p>

  return (
    <main className="grid gap-8 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mx-8">
      {videos.map((video) => (
        <VideoCard videoInfo={video} key={video.videoId} />
      ))}
    </main>
  )
}