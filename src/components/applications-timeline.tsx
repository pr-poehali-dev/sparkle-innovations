import { Timeline } from "@/components/ui/timeline"

export function ApplicationsTimeline() {
  const data = [
    {
      title: "Находим музыку",
      content: (
        <div>
          <p className="text-white text-sm md:text-base font-normal mb-6 leading-relaxed">
            Наши боты круглосуточно обходят тысячи сайтов, стриминговых сервисов и музыкальных архивов —
            собирая треки со всего интернета в единую базу.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-violet-400 text-sm">
              <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
              YouTube, SoundCloud, Bandcamp и сотни других платформ
            </div>
            <div className="flex items-center gap-3 text-violet-400 text-sm">
              <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
              Обновление базы каждые несколько минут
            </div>
            <div className="flex items-center gap-3 text-violet-400 text-sm">
              <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
              Все жанры: от классики до современных новинок
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Слушаете онлайн",
      content: (
        <div>
          <p className="text-white text-sm md:text-base font-normal mb-6 leading-relaxed">
            Встроенный плеер работает прямо в браузере — никаких приложений и плагинов. Удобный интерфейс,
            очередь треков и синхронизация между устройствами.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-violet-400 text-sm">
              <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
              Воспроизведение в высоком качестве без буферизации
            </div>
            <div className="flex items-center gap-3 text-violet-400 text-sm">
              <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
              Создание очереди и плейлистов на ходу
            </div>
            <div className="flex items-center gap-3 text-violet-400 text-sm">
              <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
              Работает на телефоне, планшете и компьютере
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Скачиваете бесплатно",
      content: (
        <div>
          <p className="text-white text-sm md:text-base font-normal mb-6 leading-relaxed">
            Один клик — и трек у вас. Выбирайте формат, качество и скачивайте любое количество треков
            без регистрации, без подписки, без ограничений.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-violet-400 text-sm">
              <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
              MP3, FLAC, WAV — любой формат на выбор
            </div>
            <div className="flex items-center gap-3 text-violet-400 text-sm">
              <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
              Пакетное скачивание целых плейлистов
            </div>
            <div className="flex items-center gap-3 text-violet-400 text-sm">
              <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
              Без регистрации и без лимитов
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <section id="applications" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-10">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">Как это работает</h2>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            SoundWave собирает музыку с тысяч источников, чтобы вы могли слушать и скачивать всё
            в одном месте — просто и быстро.
          </p>
        </div>

        <div className="relative">
          <Timeline data={data} />
        </div>
      </div>
    </section>
  )
}
