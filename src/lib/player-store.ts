export interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  preview_url: string
  cover: string
  source: string
  genre: string
}

type Listener = () => void

class PlayerStore {
  queue: Track[] = []
  currentIndex: number = 0
  isPlaying: boolean = false
  private listeners: Set<Listener> = new Set()

  subscribe(fn: Listener) {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  private notify() {
    this.listeners.forEach((fn) => fn())
  }

  setQueue(tracks: Track[], startIndex = 0) {
    this.queue = tracks
    this.currentIndex = startIndex
    this.isPlaying = true
    this.notify()
  }

  play(index: number) {
    this.currentIndex = index
    this.isPlaying = true
    this.notify()
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying
    this.notify()
  }

  next() {
    if (this.queue.length === 0) return
    this.currentIndex = (this.currentIndex + 1) % this.queue.length
    this.isPlaying = true
    this.notify()
  }

  prev() {
    if (this.queue.length === 0) return
    this.currentIndex = (this.currentIndex - 1 + this.queue.length) % this.queue.length
    this.isPlaying = true
    this.notify()
  }

  get current(): Track | null {
    return this.queue[this.currentIndex] ?? null
  }
}

export const playerStore = new PlayerStore()
