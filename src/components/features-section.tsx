import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    title: "Поиск по всему интернету",
    description: "Автоматически собираем треки с YouTube, SoundCloud, Bandcamp и сотен других источников в реальном времени.",
    icon: "🌐",
    badge: "Умный",
  },
  {
    title: "Встроенный плеер",
    description: "Слушайте музыку прямо на сайте с красивым интерфейсом, очередью треков и управлением с клавиатуры.",
    icon: "🎧",
    badge: "Плеер",
  },
  {
    title: "Скачивание в один клик",
    description: "Скачивайте любой трек в MP3, FLAC или WAV без регистрации и ограничений — быстро и бесплатно.",
    icon: "⬇️",
    badge: "Бесплатно",
  },
  {
    title: "Умные рекомендации",
    description: "ИИ анализирует ваши вкусы и предлагает новые треки, похожие на то, что вы уже слушаете.",
    icon: "✨",
    badge: "ИИ",
  },
  {
    title: "Плейлисты и коллекции",
    description: "Создавайте личные плейлисты, сохраняйте любимые треки и делитесь подборками с друзьями.",
    icon: "📂",
    badge: "Личное",
  },
  {
    title: "Миллионы треков",
    description: "База постоянно обновляется: новинки появляются автоматически в течение нескольких минут после выхода.",
    icon: "🎵",
    badge: "Обновляется",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 font-sans">Всё что нужно меломану</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Слушай, скачивай и открывай новую музыку — без подписок и ограничений
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="glow-border hover:shadow-lg transition-all duration-300 slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">{feature.icon}</span>
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-card-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
