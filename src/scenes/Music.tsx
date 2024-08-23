import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Loader } from 'lucide-react'
import AudioCard from '@/components/AudioCard'
import { getAllVideos, localVideoDetails } from '@/lib/FileSystemManager'
import { sortCollectionByDate } from '@/lib/utils'

import AudioPlayer from '@/components/AudioPlayer'

export default function Music() {
  let [searchParams, setSearchParams] = useSearchParams()
  const [audios, setAudios] = useState<localVideoDetails[]>(null)
  const [currentAudio, setCurrentAudio] = useState<localVideoDetails>(null)
  const [currentAudioSrc, setCurrentAudioSrc] = useState<string>(null)
  const [loading, setLoading] = useState(true)
  const audioId = searchParams.get('id')

  useEffect(() => {
    getAllVideos({ type: 'audio' })
      .then((audios) => {
        const sortedAudios = sortCollectionByDate(audios, 'downloadedAt', false)

        if (audioId) {
          const current = sortedAudios.find(
            (audio) => audio.videoId === audioId
          )

          setCurrentAudio(current)
          setAudios(sortedAudios)
          setCurrentAudioSrc(URL.createObjectURL(current.file))
        } else {
          setAudios(sortedAudios)
        }
      })
      .finally(() => setLoading(false))
  }, [audioId])

  function handleAudioEnded() {
    playAdjacent('next')
  }

  function selectAudio(id: string) {
    setSearchParams({ id })
  }

  function playAdjacent(adjacent: 'next' | 'previous') {
    const adjacentIndex = adjacent === 'next' ? 1 : -1

    const index = audios.findIndex((audio) => audio.videoId === audioId)
    const adjacentAudio = audios.at((index + adjacentIndex) % audios.length)

    URL.revokeObjectURL(currentAudioSrc)
    setSearchParams({ id: adjacentAudio.videoId })
  }

  function playPrevious() {
    playAdjacent('previous')
  }

  function playNext() {
    playAdjacent('next')
  }

  if (loading)
    return <Loader size={25} className="animate-spin block mx-auto my-12" />

  return (
    <main className="max-w-[var(--max-app-w)] mx-4 md:mx-auto">
      <div className="mb-8">
        <AudioPlayer
          src={currentAudioSrc}
          onEnded={handleAudioEnded}
          playNext={playNext}
          playPrevious={playPrevious}
          title={currentAudio?.title}
        />
      </div>

      <div className="space-y-3 overflow-hidden">
        {audios.map((audio) => (
          <AudioCard
            key={audio.videoId}
            imgSrc={audio.thumbnails.at(-1).url}
            title={audio.title}
            duration={+audio.lengthSeconds}
            onClick={() => selectAudio(audio.videoId)}
            selected={audio.videoId === audioId}
          />
        ))}
      </div>
    </main>
  )
}