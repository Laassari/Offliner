import { useState } from 'react'
import { MoreVideoDetails } from 'ytdl-core'
import { Download, Loader } from 'lucide-react'

import { createWriteStream } from '@/lib/FileSystemManager'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { formatSeconds } from '@/lib/utils'
import { set } from '@/lib/videoStore'
import { useNavigate } from 'react-router-dom'

type Props = {
  videoDetails: MoreVideoDetails
}
export default function VideoDownloadCard({ videoDetails }: Props) {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [fetching, setFetching] = useState(false)
  const { thumbnails, title, video_url, lengthSeconds, videoId } = videoDetails

  async function downloadVideoStream() {
    const fileWriteStream = await createWriteStream(videoId)

    setFetching(true)
    const response = await fetch(`/api/video/download?url=${video_url}`)

    await response.body
      .pipeTo(fileWriteStream)
      .then(async () => {
        await set(videoId, { ...videoDetails, downloadedAt: new Date() })

        toast({
          title: `"${title}" Has been downloaded`,
          action: (
            <ToastAction
              altText="Play video"
              onClick={() => {
                navigate(`/videos/${videoId}`)
              }}
            >
              Play
            </ToastAction>
          ),
        })
      })
      .catch(console.error)
      .finally(async () => {
        setFetching(false)
      })
  }

  return (
    <div className="flex gap-4">
      <img
        src={thumbnails.at(-1).url}
        alt={title}
        className="rounded-lg object-cover"
        height={90}
        width={160}
      />
      <div className="flex-grow">
        <p className="text-lg font-semibold line-clamp-2">{title}</p>
        <p>Duration: {formatSeconds(+lengthSeconds)}</p>
      </div>
      <Button
        className="flex gap-2"
        disabled={fetching}
        onClick={downloadVideoStream}
      >
        {fetching ? (
          <Loader size={20} className="animate-spin" />
        ) : (
          <Download />
        )}
        Download
      </Button>
    </div>
  )
}
