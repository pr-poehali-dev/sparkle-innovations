import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"

export function CTASection() {
  return (
    <section className="py-24 px-6 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
      <div className="max-w-4xl mx-auto text-center">
        <div className="slide-up">
          <div className="flex justify-center mb-6">
            <Icon name="Headphones" size={64} className="text-violet-400 opacity-80" />
          </div>
          <h2 className="text-5xl font-bold text-foreground mb-6 font-sans text-balance">Готовы погрузиться в музыку?</h2>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
            Миллионы треков из всего интернета — прямо сейчас. Слушайте онлайн или скачивайте
            в любом формате совершенно бесплатно.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 pulse-button text-lg px-8 py-4"
            >
              <Icon name="Play" size={20} className="mr-2" />
              Слушать сейчас
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-4 bg-transparent"
            >
              <Icon name="Download" size={20} className="mr-2" />
              Скачать треки
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
