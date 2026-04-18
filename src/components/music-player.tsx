import { useState, useRef, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import Icon from "@/components/ui/icon"

const DEMO_TRACKS = [
  { title: "Midnight Dreams", artist: "Luna Echo", duration: 214 },
  { title: "Electric Soul", artist: "Neon Pulse", duration: 187 },
  { title: "Ocean Drive", artist: "Wave Riders", duration: 243 },
  { title: "Cosmic Flow", artist: "StarDust", duration: 198 },
]

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(70)
  const [isMuted, setIsMuted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const track = DEMO_TRACKS[currentTrack]
  const elapsed = Math.floor((progress / 100) * track.duration)

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            handleNext()
            return 0
          }
          return p + 100 / track.duration
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, currentTrack])

  function handleNext() {
    setCurrentTrack((t) => (t + 1) % DEMO_TRACKS.length)
    setProgress(0)
  }

  function handlePrev() {
    setCurrentTrack((t) => (t - 1 + DEMO_TRACKS.length) % DEMO_TRACKS.length)
    setProgress(0)
  }

  function handleTrackSelect(index: number) {
    setCurrentTrack(index)
    setProgress(0)
    setIsPlaying(true)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9998] bg-black/95 backdrop-blur-xl border-t border-violet-500/30">
      {/* Expanded playlist */}
      {isExpanded && (
        <div className="max-w-2xl mx-auto px-4 py-3 border-b border-violet-500/20">
          {DEMO_TRACKS.map((t, i) => (
            <button
              key={i}
              onClick={() => handleTrackSelect(i)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg mb-1 transition-colors ${
                i === currentTrack
                  ? "bg-violet-600/20 text-violet-300"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                {i === currentTrack && isPlaying ? (
                  <Icon name="Volume2" size={14} className="text-violet-400" />
                ) : (
                  <Icon name="Music" size={14} />
                )}
                <span className="text-sm font-medium">{t.title}</span>
                <span className="text-xs opacity-60">{t.artist}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs opacity-50">{formatTime(t.duration)}</span>
                <button
                  onClick={(e) => { e.stopPropagation() }}
                  className="opacity-50 hover:opacity-100 transition-opacity"
                >
                  <Icon name="Download" size={13} />
                </button>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Player bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Track info */}
        <div className="flex items-center gap-3 w-48 min-w-0 shrink-0">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-purple-900 flex items-center justify-center shrink-0">
            <Icon name="Music2" size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{track.title}</p>
            <p className="text-gray-400 text-xs truncate">{track.artist}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrev}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Icon name="SkipBack" size={18} />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 rounded-full bg-violet-600 hover:bg-violet-500 flex items-center justify-center transition-colors"
            >
              <Icon name={isPlaying ? "Pause" : "Play"} size={16} className="text-white" />
            </button>
            <button
              onClick={handleNext}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Icon name="SkipForward" size={18} />
            </button>
          </div>
          <div className="flex items-center gap-2 w-full max-w-md">
            <span className="text-gray-500 text-xs w-8 text-right">{formatTime(elapsed)}</span>
            <Slider
              value={[progress]}
              onValueChange={([v]) => setProgress(v)}
              max={100}
              step={0.1}
              className="flex-1 [&_[role=slider]]:bg-violet-400 [&_[role=slider]]:border-violet-400"
            />
            <span className="text-gray-500 text-xs w-8">{formatTime(track.duration)}</span>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3 w-48 justify-end shrink-0">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-gray-400 hover:text-white transition-colors hidden sm:block"
          >
            <Icon name={isMuted || volume === 0 ? "VolumeX" : volume < 50 ? "Volume1" : "Volume2"} size={16} />
          </button>
          <Slider
            value={[isMuted ? 0 : volume]}
            onValueChange={([v]) => { setVolume(v); setIsMuted(false) }}
            max={100}
            className="w-20 hidden sm:flex [&_[role=slider]]:bg-violet-400 [&_[role=slider]]:border-violet-400"
          />
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-violet-400 transition-colors ml-1"
          >
            <Icon name={isExpanded ? "ChevronDown" : "ListMusic"} size={18} />
          </button>
          <button className="text-gray-400 hover:text-violet-400 transition-colors">
            <Icon name="Download" size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
