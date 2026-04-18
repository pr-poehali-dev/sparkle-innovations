import { Canvas, extend, useFrame } from "@react-three/fiber"
import { useAspect, useTexture } from "@react-three/drei"
import { useMemo, useRef, useState, useEffect, useCallback } from "react"
import * as THREE from "three"
import Icon from "@/components/ui/icon"
import { playerStore, type Track } from "@/lib/player-store"

const TEXTUREMAP = { src: "https://i.postimg.cc/XYwvXN8D/img-4.png" }
const DEPTHMAP = { src: "https://i.postimg.cc/2SHKQh2q/raw-4.webp" }

extend(THREE as unknown as Record<string, unknown>)

const WIDTH = 300
const HEIGHT = 300

const Scene = () => {
  const [rawMap, depthMap] = useTexture([TEXTUREMAP.src, DEPTHMAP.src])
  const meshRef = useRef<THREE.Mesh>(null)

  const material = useMemo(() => {
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      uniform sampler2D uTexture;
      uniform sampler2D uDepthMap;
      uniform vec2 uPointer;
      uniform float uProgress;
      uniform float uTime;
      varying vec2 vUv;

      // Simple noise function
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        vec2 uv = vUv;

        // Depth-based displacement
        float depth = texture2D(uDepthMap, uv).r;
        vec2 displacement = depth * uPointer * 0.01;
        vec2 distortedUv = uv + displacement;

        // Base texture
        vec4 baseColor = texture2D(uTexture, distortedUv);

        // Create scanning effect
        float aspect = ${WIDTH}.0 / ${HEIGHT}.0;
        vec2 tUv = vec2(uv.x * aspect, uv.y);
        vec2 tiling = vec2(120.0);
        vec2 tiledUv = mod(tUv * tiling, 2.0) - 1.0;

        float brightness = noise(tUv * tiling * 0.5);
        float dist = length(tiledUv);
        float dot = smoothstep(0.5, 0.49, dist) * brightness;

        // Flow effect based on progress
        float flow = 1.0 - smoothstep(0.0, 0.02, abs(depth - uProgress));

        // Violet scanning overlay
        vec3 mask = vec3(dot * flow * 3.0, 0.0, dot * flow * 10.0);

        // Combine effects
        vec3 final = baseColor.rgb + mask;

        gl_FragColor = vec4(final, 1.0);
      }
    `

    return new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: rawMap },
        uDepthMap: { value: depthMap },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uProgress: { value: 0 },
        uTime: { value: 0 },
      },
      vertexShader,
      fragmentShader,
    })
  }, [rawMap, depthMap])

  const [w, h] = useAspect(WIDTH, HEIGHT)

  useFrame(({ clock, pointer }) => {
    if (material.uniforms) {
      material.uniforms.uProgress.value = Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5
      material.uniforms.uPointer.value = pointer
      material.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  const scaleFactor = 0.3
  return (
    <mesh ref={meshRef} scale={[w * scaleFactor, h * scaleFactor, 1]} material={material}>
      <planeGeometry />
    </mesh>
  )
}

const SEARCH_URL = "https://functions.poehali.dev/6af7635d-b105-49fa-a16f-e45c39f4bd6b"

export const Hero3DWebGL = () => {
  const titleWords = "Sound Wave".split(" ")
  const subtitle = "Вся музыка мира — в одном месте. Слушай и скачивай бесплатно."
  const [visibleWords, setVisibleWords] = useState(0)
  const [subtitleVisible, setSubtitleVisible] = useState(false)
  const [searchVisible, setSearchVisible] = useState(false)
  const [delays, setDelays] = useState<number[]>([])
  const [subtitleDelay, setSubtitleDelay] = useState(0)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Track[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [source, setSource] = useState<"itunes" | "deezer">("itunes")

  useEffect(() => {
    setDelays(titleWords.map(() => Math.random() * 0.07))
    setSubtitleDelay(Math.random() * 0.1)
  }, [titleWords.length])

  useEffect(() => {
    if (visibleWords < titleWords.length) {
      const timeout = setTimeout(() => setVisibleWords(visibleWords + 1), 600)
      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => setSubtitleVisible(true), 800)
      return () => clearTimeout(timeout)
    }
  }, [visibleWords, titleWords.length])

  useEffect(() => {
    if (subtitleVisible) {
      const timeout = setTimeout(() => setSearchVisible(true), 600)
      return () => clearTimeout(timeout)
    }
  }, [subtitleVisible])

  const doSearch = useCallback(async (q: string, src = source) => {
    if (!q.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const res = await fetch(`${SEARCH_URL}?q=${encodeURIComponent(q)}&source=${src}&limit=20`)
      const data = await res.json()
      setResults(data.tracks || [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [source])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") doSearch(query)
  }

  const handleTagClick = (tag: string) => {
    setQuery(tag)
    doSearch(tag)
  }

  const handleSourceChange = (src: "itunes" | "deezer") => {
    setSource(src)
    if (query.trim()) doSearch(query, src)
  }

  const playTrack = (track: Track, index: number) => {
    playerStore.setQueue(results, index)
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-black to-transparent" />
        <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-black to-transparent" />
      </div>

      <div className="min-h-screen w-full absolute z-[60] px-6 flex justify-center flex-col gap-4 pt-24 pb-12">
        {/* Title */}
        <div className="text-3xl md:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold font-orbitron uppercase text-center">
          <div className="flex space-x-2 lg:space-x-6 overflow-hidden text-white justify-center">
            {titleWords.map((word, index) => (
              <div
                key={index}
                className={index < visibleWords ? "fade-in" : ""}
                style={{
                  animationDelay: `${index * 0.13 + (delays[index] || 0)}s`,
                  opacity: index < visibleWords ? undefined : 0,
                }}
              >
                {word}
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs md:text-xl xl:text-2xl overflow-hidden text-white font-bold max-w-4xl mx-auto text-center px-4">
          <div
            className={subtitleVisible ? "fade-in-subtitle" : ""}
            style={{
              animationDelay: `${titleWords.length * 0.13 + 0.2 + subtitleDelay}s`,
              opacity: subtitleVisible ? undefined : 0,
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Search bar */}
        <div className={`w-full max-w-2xl mx-auto transition-all duration-700 ${searchVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          {/* Source toggle */}
          <div className="flex gap-2 justify-center mb-3">
            {(["itunes", "deezer"] as const).map((s) => (
              <button
                key={s}
                onClick={() => handleSourceChange(s)}
                className={`text-xs px-4 py-1.5 rounded-full border transition-colors font-semibold ${
                  source === s
                    ? "bg-violet-600 border-violet-600 text-white"
                    : "border-violet-500/30 text-violet-300 hover:border-violet-400 bg-black/30"
                }`}
              >
                {s === "itunes" ? "iTunes" : "Deezer"}
              </button>
            ))}
          </div>

          <div className="relative flex items-center">
            <Icon name="Search" size={20} className="absolute left-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Поиск артиста, трека, альбома..."
              className="w-full bg-white/10 backdrop-blur-md border border-violet-500/40 rounded-full pl-12 pr-36 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:bg-white/15 transition-all text-base"
            />
            <button
              onClick={() => doSearch(query)}
              disabled={loading}
              className="absolute right-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-colors flex items-center gap-2"
            >
              {loading ? <Icon name="Loader2" size={14} className="animate-spin" /> : <Icon name="Search" size={14} />}
              Найти
            </button>
          </div>

          <div className="flex gap-2 mt-3 justify-center flex-wrap">
            {["Pop", "Hip-Hop", "Lofi", "Electronic", "Rock", "Jazz"].map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="text-xs text-violet-300 border border-violet-500/30 hover:border-violet-400 hover:text-violet-200 px-3 py-1 rounded-full transition-colors bg-black/30"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {searched && (
          <div className="w-full max-w-4xl mx-auto mt-2">
            {loading ? (
              <div className="flex justify-center py-10">
                <Icon name="Loader2" size={36} className="text-violet-400 animate-spin" />
              </div>
            ) : results.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Ничего не найдено. Попробуйте другой запрос.</p>
            ) : (
              <>
                <p className="text-gray-500 text-sm mb-3 text-center">Найдено {results.length} треков</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {results.map((track, i) => (
                    <div
                      key={track.id + i}
                      className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-violet-500/20 hover:border-violet-500/40 rounded-xl px-4 py-3 transition-all group"
                    >
                      {/* Cover */}
                      {track.cover ? (
                        <img src={track.cover} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-violet-900 flex items-center justify-center shrink-0">
                          <Icon name="Music" size={20} className="text-violet-300" />
                        </div>
                      )}
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{track.title}</p>
                        <p className="text-gray-400 text-xs truncate">{track.artist}</p>
                        {track.genre && <p className="text-violet-400 text-xs mt-0.5">{track.genre}</p>}
                      </div>
                      {/* Duration */}
                      <span className="text-gray-500 text-xs shrink-0">{track.duration > 0 ? `${Math.floor(track.duration / 60)}:${String(track.duration % 60).padStart(2, "0")}` : ""}</span>
                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        {track.preview_url && (
                          <button
                            onClick={() => playTrack(track, i)}
                            className="w-8 h-8 rounded-full bg-violet-600 hover:bg-violet-500 flex items-center justify-center transition-colors"
                          >
                            <Icon name="Play" size={14} className="text-white" />
                          </button>
                        )}
                        {track.preview_url && (
                          <a
                            href={track.preview_url}
                            download
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                            title="Скачать"
                          >
                            <Icon name="Download" size={14} className="text-gray-300" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="h-screen">
        <Canvas
          flat
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          }}
          camera={{ position: [0, 0, 1] }}
          style={{ background: "#000000" }}
        >
          <Scene />
        </Canvas>
      </div>
    </div>
  )
}

export default Hero3DWebGL