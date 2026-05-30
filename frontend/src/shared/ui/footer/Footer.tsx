import { Compass } from "lucide-react";

export function Footer() {
    return(
    <footer className="bg-stone-900 text-stone-400 mt-auto">
        <div className="max-w-[1320px] mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                            <Compass className="w-4 h-4 text-white"/>
                        </div>
                        <span className="text-white" style={{fontSize: 16, fontWeight: 600}}>HistoryVR</span>
                    </div>
                    <p style={{fontSize: 13, lineHeight: 1.6}}>Платформа для представления историко-культурного наследия в формате виртуальных экскурсий.</p>
                </div>
                {[
                    {title: "Разделы", links: ["Экскурсии", "Экспонаты", "Авторы и музи", "ЭКскурсии по Красноярску"]},
                    {title: "Возможности", links: ["Создание экскурсий", "Условия публикации", "Рабочие пространства", "Добавление экспонатов"]},
                    {title: "О нас", links: ["О платформе", "Для авторов и организаций", "Условия использования", "Политика конфиденциальности"]},
                ].map((col) => (
                    <div key={col.title}>
                        <h4 className="text-white mb-3" style={{
                            fontSize: 13,
                            fontWeight: 600,
                            textTransform: "uppercase" as const,
                            letterSpacing: "0.05em"
                        }}>{col.title}</h4>
                        <div className="flex flex-col gap-2">
                            {col.links.map((l) => (
                                <span key={l}
                                      className="text-stone-400 hover:text-white cursor-pointer transition-colors"
                                      style={{fontSize: 13}}>{l}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-10 pt-6 border-t border-stone-800 text-center" style={{fontSize: 12}}>
                &copy; 2026 HistoryVR. All rights reserved.
            </div>
        </div>
    </footer>
    )
}
