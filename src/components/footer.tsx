import Icon from "@/components/ui/icon"

export function Footer() {
  return (
    <footer className="bg-black border-t border-violet-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Music2" size={22} className="text-violet-400" />
              <h2 className="font-orbitron text-2xl font-bold text-white">
                Sound<span className="text-violet-400">Wave</span>
              </h2>
            </div>
            <p className="font-space-mono text-gray-300 mb-6 max-w-md">
              Вся музыка интернета в одном месте. Слушайте онлайн и скачивайте бесплатно.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors duration-200">
                <Icon name="Twitter" size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors duration-200">
                <Icon name="Github" size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors duration-200">
                <Icon name="Instagram" size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors duration-200">
                <Icon name="Mail" size={20} />
              </a>
            </div>
          </div>

          {/* Платформа */}
          <div>
            <h3 className="font-orbitron text-white font-semibold mb-4">Платформа</h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="font-space-mono text-gray-400 hover:text-violet-400 transition-colors duration-200">
                  Возможности
                </a>
              </li>
              <li>
                <a href="#applications" className="font-space-mono text-gray-400 hover:text-violet-400 transition-colors duration-200">
                  Как работает
                </a>
              </li>
              <li>
                <a href="#faq" className="font-space-mono text-gray-400 hover:text-violet-400 transition-colors duration-200">
                  Вопросы
                </a>
              </li>
            </ul>
          </div>

          {/* Компания */}
          <div>
            <h3 className="font-orbitron text-white font-semibold mb-4">Компания</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="font-space-mono text-gray-400 hover:text-violet-400 transition-colors duration-200">
                  О нас
                </a>
              </li>
              <li>
                <a href="#" className="font-space-mono text-gray-400 hover:text-violet-400 transition-colors duration-200">
                  Контакты
                </a>
              </li>
              <li>
                <a href="#" className="font-space-mono text-gray-400 hover:text-violet-400 transition-colors duration-200">
                  Политика конфиденциальности
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-violet-500/10">
          <p className="font-space-mono text-center text-gray-500 text-sm">
            © 2024 SoundWave. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  )
}
