import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQSection() {
  const faqs = [
    {
      question: "Это действительно бесплатно?",
      answer:
        "Да, полностью бесплатно. Слушайте онлайн и скачивайте треки без подписки, без скрытых платежей и без ограничений по количеству.",
    },
    {
      question: "Откуда берётся музыка?",
      answer:
        "Наши алгоритмы автоматически собирают треки с тысяч открытых источников в интернете: YouTube, SoundCloud, Bandcamp, музыкальных архивов и многих других платформ.",
    },
    {
      question: "В каком формате можно скачать треки?",
      answer:
        "Поддерживаются форматы MP3 (128, 192, 320 кбит/с), FLAC и WAV. Вы сами выбираете нужное качество перед скачиванием.",
    },
    {
      question: "Нужна ли регистрация?",
      answer:
        "Для прослушивания и скачивания регистрация не нужна. Аккаунт понадобится только если хотите сохранять плейлисты и историю прослушивания.",
    },
    {
      question: "Как быстро появляются новые треки?",
      answer:
        "База обновляется непрерывно — новинки обычно появляются в течение нескольких минут после публикации на оригинальных платформах.",
    },
    {
      question: "Работает ли сайт на мобильном телефоне?",
      answer:
        "Да, сайт полностью адаптирован для смартфонов и планшетов. Плеер работает в фоновом режиме, пока вы пользуетесь другими приложениями.",
    },
  ]

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-orbitron">Частые вопросы</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-space-mono">
            Ответы на популярные вопросы о SoundWave — музыкальной платформе без ограничений.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-violet-500/20 mb-4">
                <AccordionTrigger className="text-left text-lg font-semibold text-white hover:text-violet-400 font-orbitron px-6 py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 leading-relaxed px-6 pb-4 font-space-mono">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
