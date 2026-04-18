import { useState, useRef, useEffect, useCallback } from "react"
import { Slider } from "@/components/ui/slider"
import Icon from "@/components/ui/icon"
import { playerStore, type Track } from "@/lib/player-store"

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [, forceUpdate] = useState(0)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    return playerStore.subscribe(() => forceUpdate((n) => n + 1))
  }, [])

  const track = playerStore.current

  useEffect(() => {
    if (!track?.preview_url) return
    const audio = audioRef.current
    if (!audio) return
    audio.src = track.preview_url
    audio.volume = isMuted ? 0 : volume
    if (playerStore.isPlaying) audio.play().catch(() => {})
    else audio.pause()
  }, [track?.preview_url, playerStore.isPlaying])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (playerStore.isPlaying) audio.play().catch(() => {})
    else audio.pause()
  }, [playerStore.isPlaying])

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    setCurrentTime(audio.currentTime)
    setDuration(audio.duration || 0)
    setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0)
  }, [])

  const handleEnded = useCallback(() => {
    playerStore.next()
  }, [])

  const handleSeek = useCallback(([v]: number[]) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    audio.currentTime = (v / 100) * audio.duration
    setProgress(v)
  }, [])

  const handleVolume = useCallback(([v]: number[]) => {
    setVolume(v)
    setIsMuted(false)
    if (audioRef.current) audioRef.current.volume = v
  }, [])

  const toggleMute = useCallback(() => {
    setIsMuted((m) => {
      if (audioRef.current) audioRef.current.volume = m ? volume : 0
      return !m
    })
  }, [volume])

  if (!track) return null

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleTimeUpdate}
      />
      <div className="fixed bottom-0 left-0 right-0 z-[9998] bg-black/97 backdrop-blur-xl border-t border-violet-500/30">
        {/* Expanded queue */}
        {isExpanded && (
          <div className="max-w-2xl mx-auto px-4 py-3 border-b border-violet-500/20 max-h-64 overflow-y-auto">
            {playerStore.queue.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">Очередь пуста — найдите музыку выше</p>
            ) : (
              playerStore.queue.map((t, i) => (
                <button
                  key={t.id + i}
                  onClick={() => playerStore.play(i)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg mb-1 transition-colors text-left ${
                    i === playerStore.currentIndex
                      ? "bg-violet-600/20 text-violet-300"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {t.cover ? (
                      <img src={t.cover} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded bg-violet-900 flex items-center justify-center shrink-0">
                        <Icon name="Music" size={13} className="text-violet-300" />
                      </div>
                    )}
                    {i === playerStore.currentIndex && playerStore.isPlaying ? (
                      <Icon name="Volume2" size={13} className="text-violet-400 shrink-0" />
                    ) : null}
                    <div className="min-w-0">
                      <span className="text-sm font-medium truncate block">{t.title}</span>
                      <span className="text-xs opacity-60 truncate block">{t.artist}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-xs opacity-50">{formatTime(t.duration)}</span>
                    <a
                      href={t.preview_url}
                      download
                      onClick={(e) => e.stopPropagation()}
                      className="opacity-50 hover:opacity-100 transition-opacity"
                    >
                      <Icon name="Download" size={13} />
                    </a>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {/* Player bar */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Track info */}
          <div className="flex items-center gap-3 w-48 min-w-0 shrink-0">
            {track.cover ? (
              <img src={track.cover} alt={track.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-purple-900 flex items-center justify-center shrink-0">
                <Icon name="Music2" size={18} className="text-white" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{track.title}</p>
              <p className="text-gray-400 text-xs truncate">{track.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="flex items-center gap-4">
              <button onClick={() => playerStore.prev()} className="text-gray-400 hover:text-white transition-colors">
                <Icon name="SkipBack" size={18} />
              </button>
              <button
                onClick={() => playerStore.togglePlay()}
                className="w-9 h-9 rounded-full bg-violet-600 hover:bg-violet-500 flex items-center justify-center transition-colors"
              >
                <Icon name={playerStore.isPlaying ? "Pause" : "Play"} size={16} className="text-white" />
              </button>
              <button onClick={() => playerStore.next()} className="text-gray-400 hover:text-white transition-colors">
                <Icon name="SkipForward" size={18} />
              </button>
            </div>
            <div className="flex items-center gap-2 w-full max-w-md">
              <span className="text-gray-500 text-xs w-8 text-right">{formatTime(currentTime)}</span>
              <Slider
                value={[progress]}
                onValueChange={handleSeek}
                max={100}
                step={0.1}
                className="flex-1 [&_[role=slider]]:bg-violet-400 [&_[role=slider]]:border-violet-400"
              />
              <span className="text-gray-500 text-xs w-8">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3 w-48 justify-end shrink-0">
            <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors hidden sm:block">
              <Icon name={isMuted || volume === 0 ? "VolumeX" : volume < 0.5 ? "Volume1" : "Volume2"} size={16} />
            </button>
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={handleVolume}
              max={1}
              step={0.01}
              className="w-20 hidden sm:flex [&_[role=slider]]:bg-violet-400 [&_[role=slider]]:border-violet-400"
            />
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-violet-400 transition-colors ml-1"
            >
              <Icon name={isExpanded ? "ChevronDown" : "ListMusic"} size={18} />
            </button>
            <a
              href={track.preview_url}
              download
              className="text-gray-400 hover:text-violet-400 transition-colors"
              title="Скачать превью"
            >
              <Icon name="Download" size={16} />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
