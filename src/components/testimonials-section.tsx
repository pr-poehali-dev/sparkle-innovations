import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Алексей Петров",
    role: "Меломан, Москва",
    avatar: "/cybersecurity-expert-man.jpg",
    content:
      "Наконец-то нашёл сайт, где есть вообще всё! Искал редкие джазовые альбомы 60-х — нашёл за секунды. Скачал в FLAC без всяких регистраций.",
  },
  {
    name: "Мария Соколова",
    role: "Диджей, Санкт-Петербург",
    avatar: "/professional-woman-scientist.png",
    content:
      "Использую SoundWave для поиска новых треков перед сетами. База огромная, обновляется быстро. Скачивание в высоком качестве — просто мечта!",
  },
  {
    name: "Дмитрий Ли",
    role: "Музыкальный блогер",
    avatar: "/asian-woman-tech-developer.jpg",
    content:
      "Рекомендую всем своим подписчикам. Встроенный плеер удобнее чем Spotify, а скачать можно что угодно. Сервис работает безупречно.",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-card-foreground mb-4 font-sans">Нам доверяют меломаны</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Что говорят наши пользователи о SoundWave
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glow-border slide-up" style={{ animationDelay: `${index * 0.15}s` }}>
              <CardContent className="p-6">
                <p className="text-card-foreground mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-primary">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
