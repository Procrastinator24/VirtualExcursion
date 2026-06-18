import { Link } from 'react-router-dom';

export const AboutPage = () => {
    return (
        <div className="bg-white">
            {/* Hero секция */}
            <div className="relative w-full bg-cover bg-center bg-no-repeat h-96 flex items-center justify-center"
                 style={{backgroundImage: "url('/aboutHero.png')"}}>
                <div className="absolute inset-0 bg-black/50"/>
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-white text-5xl font-semibold font-['Inter'] leading-[60px] mb-2">
                        О проекте Культуриум
                    </h1>
                    <p className="text-white text-2xl font-semibold font-['Inter'] leading-8 max-w-2xl mx-auto">
                        Откройте для себя культурное наследие через увлекательные виртуальные экскурсии.
                    </p>
                </div>
            </div>

            {/* Миссия */}
            <div className="max-w-[1280px] mx-auto px-6 py-16">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
                    <div className="flex-1">
                        <h2 className="text-stone-900 text-3xl font-semibold font-['Inter'] leading-10 mb-3">
                            Наша миссия
                        </h2>
                        <div className="text-neutral-950 text-lg font-normal font-['Inter'] leading-6 space-y-4">
                            <p>
                                «Культуриум» — это платформа для проведения виртуальных экскурсий по музеям, историческим
                                местам и объектам культурного наследия.
                            </p>
                            <p>
                                Проект развивается в рамках грантовой инициативы «Историческая VR-экскурсия» при участии
                                Сибирского федерального университета, профильного института, студентов, преподавателей,
                                исторических консультантов и музеев-партнёров.
                            </p>
                            <p>
                                Мы создаём удобную цифровую среду, где экскурсоводы и образовательные организации могут
                                проводить онлайн-экскурсии, демонстрировать экспонаты, исторические пространства,
                                3D-модели и мультимедийные материалы. Такой формат помогает сделать знакомство с историей
                                и культурой более доступным, наглядным и интересным для школьников, студентов и широкой
                                аудитории.
                            </p>
                        </div>
                    </div>

                    {/* Декоративные карточки */}
                    <div className="relative w-80 shrink-0 hidden lg:block">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden rotate-[5deg] mb-4">
                            <img src="/aboutpageKras.png" alt="Экскурсия" className="w-full h-52 object-cover"/>
                            <div className="p-4">
                                <h3 className="text-stone-900 text-lg font-semibold font-['Inter'] leading-6">
                                    Красноярск: история города на Енисее
                                </h3>
                                <p className="text-stone-950 text-sm font-normal font-['Inter'] leading-4 mt-1">
                                    Красноярский краевой краеведческий музей
                                </p>
                            </div>
                            <div className="absolute top-2 right-2 flex gap-1">
                                <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-medium font-['Inter'] rounded-lg outline outline-1 outline-orange-600">
                                    3D-модель
                                </span>
                                <span className="px-2 py-1 bg-blue-100 text-sky-700 text-xs font-medium font-['Inter'] rounded-lg outline outline-1 outline-sky-700">
                                    Фото
                                </span>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden -rotate-[14deg] absolute top-32 -left-16 w-72">
                            <img src="/aboutpageMusem.png" alt="Экскурсия" className="w-full h-52 object-cover"/>
                            <div className="p-4">
                                <h3 className="text-stone-900 text-lg font-semibold font-['Inter'] leading-6">
                                    Тульский музей изобразительных искусств
                                </h3>
                                <div className="flex gap-2 mt-2 text-sm font-medium font-['Inter']">
                                    <span>19 экскурсий</span>
                                    <span>56 экспонатов</span>
                                </div>
                            </div>
                            <div className="absolute top-2 right-2">
                                <span className="px-2 py-1 bg-sky-50 text-neutral-600 text-xs font-medium font-['Inter'] rounded-lg outline outline-1 outline-zinc-500">
                                    Новый
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ценности */}
            <div className="max-w-[1280px] mx-auto px-6 py-20">
                <h2 className="text-stone-900 text-3xl font-semibold font-['Inter'] leading-10 text-center mb-6">
                    Наши ценности
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        {
                            title: 'Доступность',
                            desc: 'Культурное наследие должно быть открыто для разных аудиторий — независимо от места проживания, возраста и возможности посетить музей лично.'
                        },
                        {
                            title: 'Удобство',
                            desc: 'Помогаем музеям, экскурсоводам, преподавателям и студентам создавать и публиковать виртуальные экскурсии без лишней технической сложности.'
                        },
                        {
                            title: 'Качество',
                            desc: 'Платформа поддерживает аккуратное оформление экскурсий: с понятной структурой, визуальными материалами и удобным маршрутом для зрителя.'
                        },
                        {
                            title: 'Наглядность',
                            desc: 'Изображения, панорамы, 3D-модели, видео и интерактивные элементы помогают авторам показывать экспонаты, места и события более выразительно.'
                        },
                        {
                            title: 'Образование',
                            desc: 'Виртуальные экскурсии могут быть частью учебного, музейного и просветительского процесса, помогая изучать историю понятнее, нагляднее и интереснее.'
                        },
                        {
                            title: 'Сотрудничество',
                            desc: 'Проект объединяет гидов, музеи, университет, студентов, преподавателей и авторов, развивая цифровой формат работы с культурным наследием.'
                        }
                    ].map((item, idx) => (
                        <div key={idx} className="p-6 bg-white rounded-2xl outline outline-1 outline-stone-300">
                            <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center mb-3">
                                <div className="w-6 h-6 bg-stone-600 rounded"/>
                            </div>
                            <h3 className="text-stone-900 text-xl font-semibold font-['Inter'] leading-6 mb-2">
                                {item.title}
                            </h3>
                            <p className="text-stone-500 text-base font-normal font-['Inter'] leading-6">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Партнёры */}
            <div className="max-w-[1280px] mx-auto px-6 pt-20 pb-28">
                <h2 className="text-stone-900 text-3xl font-semibold font-['Inter'] leading-10 text-center mb-10">
                    Наши партнеры
                </h2>
                <div className="flex flex-wrap justify-center items-center gap-12">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-stone-900 rounded-[10px] flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-white rounded"/>
                            </div>
                            <span className="text-stone-900 text-2xl font-semibold font-['Inter'] leading-7">
                                HistoryVR
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Как это работает */}
            <div className="bg-stone-900 py-16">
                <div className="max-w-[1280px] mx-auto px-6 text-center">
                    <h2 className="text-white text-3xl font-semibold font-['Inter'] leading-10 mb-1">
                        Как это работает
                    </h2>
                    <p className="text-white text-xl font-normal font-['Inter'] leading-7 mb-12">
                        От знакомства с платформой до создания собственной экскурсии — всего четыре шага
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'Создайте аккаунт',
                                desc: 'Зарегистрируйтесь и получите личное рабочее пространство.'
                            },
                            {
                                step: '02',
                                title: 'Расширьте возможности',
                                desc: 'Подайте заявку, чтобы получить доступ к созданию и публикации.'
                            },
                            {
                                step: '03',
                                title: 'Собирайте экскурсии',
                                desc: 'Создавайте экспонаты, добавляйте сцены и объединяйте их в подборки.'
                            },
                            {
                                step: '04',
                                title: 'Публикуйте экскурсии',
                                desc: 'Делитесь готовыми экскурсиями с другими пользователями.'
                            }
                        ].map((item) => (
                            <div key={item.step} className="flex flex-col items-center gap-5">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                    <span className="text-white text-lg font-bold font-['Inter'] leading-7">
                                        {item.step}
                                    </span>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-white text-xl font-semibold font-['Inter'] leading-7 mb-1">
                                        {item.title}
                                    </h3>
                                    <p className="text-stone-400 text-base font-normal font-['Inter'] leading-5 max-w-xs">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12">
                        <Link
                            to="/auth"
                            className="inline-flex items-center gap-3 px-3.5 py-3 bg-white rounded-[10px] text-stone-900 text-base font-medium font-['Inter'] leading-6 hover:bg-stone-100 transition-colors"
                        >
                            Зарегистрироваться
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;