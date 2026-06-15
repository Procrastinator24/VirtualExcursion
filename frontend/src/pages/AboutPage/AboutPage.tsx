import { Link } from 'react-router-dom';
import { ImageWithFallback } from '@shared/ui/imgWrapper/ImageWithFallback';

export const AboutPage = () => {
    return (
        <div className="bg-white">
            {/* Hero секция */}
            <div className="relative w-full bg-cover bg-center bg-no-repeat"
                 style={{backgroundImage: "url('/public/aboutHero.png')"}}>
                <div className="absolute inset-0 bg-black/50"/>
                <div className="relative z-10 flex flex-col justify-center items-center py-20 px-4">
                    <h1 className="text-white text-5xl font-semibold font-['Inter'] text-center mb-4">
                        О проекте Культуриум
                    </h1>
                    <p className="text-white text-2xl font-semibold font-['Inter'] text-center max-w-2xl">
                        Откройте для себя культурное наследие через увлекательные виртуальные экскурсии.
                        </p>
                    </div>
                </div>
            </section>

            {/* Миссия */}
            <div
                className="max-w-[1280px] mx-auto px-6 py-16 flex flex-col lg:flex-row justify-between items-start gap-10">
                <div className="flex-1">
                    <h2 className="text-stone-900 text-3xl font-semibold mb-3">Наша миссия</h2>
                    <div className="text-neutral-950 text-lg font-normal leading-6 space-y-4">
                        <p>
                            «Культуриум» — это платформа для проведения виртуальных экскурсий по музеям, историческим
                            местам и объектам культурного наследия.
                    </p>
                        <p>
                            ������ ����������� � ������ ��������� ���������� ������������� VR-���������� ��� �������
                            ���������� ������������ ������������, ����������� ���������, ���������, ��������������,
                            ������������ ������������� � ������-��������.
                        </p>
                        <p>
                            �� ������ ������� �������� �����, ��� ������������ � ��������������� ����������� �����
                            ��������� ������-���������, ��������������� ���������, ������������ ������������, 3D-������
                            � �������������� ���������. ����� ������ �������� ������� ���������� � �������� � ���������
                            ����� ���������, ��������� � ���������� ��� ����������, ��������� � ������� ���������.
                        </p>
                </div>
                </div>

                {/* Карточки-примеры (декоративные) */}
                <div className="relative w-80 shrink-0 hidden lg:block">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden rotate-[5deg] mb-4">
                        <img src="/public/aboutpageKras.png" alt="Экскурсия" className="w-full h-52 object-cover"/>
                        <div className="p-4">
                            <h3 className="text-stone-900 text-lg font-semibold">Красноярск: история города на
                                Енисее</h3>
                            <p className="text-stone-950 text-sm mt-1">Красноярский краевой краеведческий музей</p>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1">
                            <span
                                className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-lg">3D-модель</span>
                            <span className="px-2 py-1 bg-blue-100 text-sky-700 text-xs rounded-lg">Фото</span>
                        </div>
                    </div>
                    <div
                        className="bg-white rounded-2xl shadow-lg overflow-hidden -rotate-12 absolute top-32 -left-16 w-72">
                        <img src="/public/aboutpageMusem.png" alt="Экскурсия" className="w-full h-52 object-cover"/>
                        <div className="p-4">
                            <h3 className="text-stone-900 text-lg font-semibold">Тульский музей изобразительных
                                искусств</h3>
                            <div className="flex gap-2 mt-2 text-sm">
                                <span>19 экскурсий</span>
                                <span>56 экспонатов</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ценности */}
            <div className="max-w-[1280px] mx-auto px-6 py-16">
                <h2 className="text-stone-900 text-3xl font-semibold text-center mb-8">Наши ценности</h2>
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
                        <div key={idx} className="p-6 bg-white rounded-2xl border border-stone-300">
                            <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center mb-3">
                                <div className="w-6 h-6 bg-stone-600 rounded"/>
                                {/* Иконка-заглушка */}
                            </div>
                            <h3 className="text-stone-900 text-xl font-semibold mb-2">{item.title}</h3>
                            <p className="text-stone-500 text-base">{item.desc}</p>
                    </div>
                    ))}
                    </div>
                </div>

            {/* Партнёры */}
            <div className="max-w-[1280px] mx-auto px-6 py-16 text-center">
                <h2 className="text-stone-900 text-3xl font-semibold mb-8">Наши партнеры</h2>
                <div className="flex flex-wrap justify-center items-center gap-12">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-stone-900 rounded-lg flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-white rounded"/>
                </div>
                            <span className="text-stone-900 text-2xl font-semibold">HistoryVR</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Как это работает */}
            <div className="bg-stone-900 py-16">
                <div className="max-w-[1280px] mx-auto px-6 text-center">
                    <h2 className="text-white text-3xl font-semibold mb-2">Как это работает</h2>
                    <p className="text-white text-xl mb-12">От знакомства с платформой до создания собственной экскурсии
                        — всего четыре шага</p>
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
                            <div key={item.step} className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                    <span className="text-white text-lg font-bold">{item.step}</span>
                                </div>
                                <h3 className="text-white text-xl font-semibold">{item.title}</h3>
                                <p className="text-stone-400 text-base">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12">
                        <Link
                            to="/auth"
                            className="inline-flex items-center gap-2 px-4 py-3 bg-white rounded-lg text-stone-900 font-medium hover:bg-stone-100 transition-colors"
                        >
                            ������������������
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </Link>
                    </div>
                </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;