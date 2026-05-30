import { Link } from "react-router";
import { Search, Eye, Box, Image, Video, Star, ArrowRight, ChevronRight, Sparkles, Globe } from "lucide-react";
import {sceneTypeLabels, sceneTypeColors, type SceneType} from "../../entities/sceneType"
import { ImageWithFallback } from "@shared/ui/imgWrapper/ImageWithFallback.tsx";
import {useEffect, useState} from "react";
import {ExcursionCard, ExcursionResponse} from "../../entities/excursion";
import {excursionApi} from "../../entities/excursion";
import type {GuideProfileResponse} from "../../entities/guides";
import {guideApi} from "../../entities/guides";
import {GuideCard} from "../../entities/guides/ui/GuideCard.tsx";


const sceneCategories: { type: SceneType; icon: React.ReactNode; desc: string }[] = [

    { type: "panorama", icon: <Globe className="w-6 h-6" />, desc: "Interactive 360\u00b0 photospheres" },
    { type: "video", icon: <Video className="w-6 h-6" />, desc: "Expert-narrated video walkthroughs" },
    { type: "3d", icon: <Box className="w-6 h-6" />, desc: "Detailed interactive 3D reconstructions" },
    { type: "image", icon: <Image className="w-6 h-6" />, desc: "High-resolution historical imagery" },

];

const howItWorks = [
    { step: "01", title: "Создайте аккаунт", desc: "Зарегистрируйтесь и получите личное рабочее пространство." },
    { step: "02", title: "Расширьте возможности", desc: "Подайте заявку, чтобы получить полный доступ к созданию и публикации." },
    { step: "03", title: "Собирайте экскурсии", desc: "Создавайте экспонаты, добавляйте сцены и объединяйте их в подборки." },
    { step: "04", title: "Публикуйте экскурсии", desc: "Делитесь готовыми экскурсиями с другими пользователями." },
];

export const HomePage = () => {
    const [search, setSearch] = useState("");
    const [excursions, setExcursions] = useState<ExcursionResponse[]>([]);
    const [authors, setAuthors] = useState<GuideProfileResponse[]>([])

    useEffect(() => {
        excursionApi.getAll().then((ex) => {
            console.log(ex.data, typeof ex.data)
            setExcursions(ex.data.slice(0,4))
        })
        guideApi.getAllGuides().then((g) => {
            setAuthors(g.data.slice(0,3))
        })
    }, []);
    return (
        <div>
            {/* Hero */}
            <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img src="/HeroHome.png" alt="Museum" className="w-full h-full object-cover"/>
                    <div
                        className="absolute inset-0 bg-gradient-to-b from-stone-900/70 via-stone-900/50 to-stone-900/80"/>
                </div>
                <div className="relative z-10 max-w-2xl mx-auto text-center px-6">
                    <div
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white/90 mb-6"
                        style={{fontSize: 13}}>
                        <Sparkles className="w-3.5 h-3.5"/> Платформа виртуальных исторических экскурсий
                    </div>
                    <h1 className="text-white mb-4" style={{fontSize: 44, fontWeight: 600, lineHeight: 1.15}}>
                        Исследуйте прошлое
                        через виртуальные экскурсии
                    </h1>
                    <p className="text-white/75 mb-8 mx-auto max-w-lg" style={{fontSize: 16, lineHeight: 1.7}}>
                        Исследуйте культурное наследие, музейные экспозиции и исторические материалы в единой цифровой
                        среде
                    </p>
                    <div className="flex items-center bg-white rounded-xl overflow-hidden shadow-xl max-w-lg mx-auto">
                        <Search className="w-5 h-5 text-stone-400 ml-4 shrink-0"/>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Поиск экскурсий, музеев, эпох..."
                            className="flex-1 px-3 py-3.5 border-none outline-none bg-transparent text-stone-900"
                            style={{fontSize: 15}}
                        />
                        <Link to="/catalog"
                              className="m-1.5 px-5 py-2.5 bg-stone-900 text-white rounded-lg no-underline hover:bg-stone-800 transition-colors shrink-0"
                              style={{fontSize: 14, fontWeight: 500}}>
                            Explore
                        </Link>
                    </div>
                    <div className="flex items-center justify-center gap-6 mt-6 text-white/60" style={{fontSize: 13}}>
                        {/*<span>{excursions.length}+ Excursions</span>*/}
                        {/*<span className="w-1 h-1 rounded-full bg-white/30" />*/}
                        {/*<span>{authors.length}+ Expert Guides</span>*/}
                        {/*<span className="w-1 h-1 rounded-full bg-white/30" />*/}
                        {/*<span>{museums.length}+ Museums</span>*/}
                    </div>
                </div>
            </section>

            {/* Featured Excursions */}
            <section className="max-w-[1320px] mx-auto px-6 py-16">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-stone-900" style={{fontSize: 28, fontWeight: 600}}>Экскурсии</h2>
                        <p className="text-stone-500 mt-1" style={{fontSize: 15}}>Увлекательные путешествия по
                            истории</p>
                    </div>
                    <Link to="/catalog"
                          className="flex items-center gap-1 text-stone-600 hover:text-stone-900 no-underline transition-colors"
                          style={{fontSize: 14, fontWeight: 500}}>
                        Смотреть все <ArrowRight className="w-4 h-4"/>
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {excursions.map((ex) => (
                        <ExcursionCard key={ex.id} excursion={ex}/>
                    ))}
                </div>
            </section>
            {/*Exhibits*/}
            <section className="max-w-[1320px] mx-auto px-6 py-16">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-stone-900" style={{fontSize: 28, fontWeight: 600}}>Экспонаты</h2>
                        <p className="text-stone-500 mt-1" style={{fontSize: 15}}>Увлекательные путешествия по
                            истории</p>
                    </div>
                    <Link to="/catalog"
                          className="flex items-center gap-1 text-stone-600 hover:text-stone-900 no-underline transition-colors"
                          style={{fontSize: 14, fontWeight: 500}}>
                        Смотреть все <ArrowRight className="w-4 h-4"/>
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {excursions.map((ex) => (
                        <ExcursionCard key={ex.id} excursion={ex}/>
                    ))}
                </div>
            </section>

            {/* Scene Type Categories */}
            <section className="bg-white border-y border-stone-200/60">
                <div className="max-w-[1320px] mx-auto px-6 py-16">
                    <div className="text-center mb-10">
                        <h2 className="text-stone-900" style={{fontSize: 28, fontWeight: 600}}>Форматы экскурсии</h2>
                        <p className="text-stone-500 mt-1" style={{fontSize: 15}}>Разные возможности знакомства с культурным наследием</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {sceneCategories.map((cat) => (
                            <Link key={cat.type} to="/catalog"
                                  className="group flex flex-col items-center text-center p-6 rounded-xl border border-stone-200/60 hover:border-stone-300 hover:shadow-md transition-all no-underline bg-[#FAFAF8]">
                                <div
                                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-3 ${sceneTypeColors[cat.type]}`}>
                                    {cat.icon}
                                </div>
                                <span className="text-stone-900 mb-1"
                                      style={{fontSize: 14, fontWeight: 600}}>{sceneTypeLabels[cat.type]}</span>
                                <span className="text-stone-400"
                                      style={{fontSize: 12, lineHeight: 1.4}}>{cat.desc}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Authors & Museums */}
            <section className="max-w-[1320px] mx-auto px-6 py-16">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-stone-900" style={{fontSize: 28, fontWeight: 600}}>Экскурсоводы и музеи</h2>
                        <p className="text-stone-500 mt-1" style={{fontSize: 15}}>Материалы от проверенных специалистов и учреждений культуры</p>
                    </div>
                    <Link to="/authors"
                          className="flex items-center gap-1 text-stone-600 hover:text-stone-900 no-underline transition-colors"
                          style={{fontSize: 14, fontWeight: 500}}>
                        Смотреть все <ArrowRight className="w-4 h-4"/>
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {authors.map((m) => (
                        <GuideCard guide={m}/>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="bg-stone-900">
                <div className="max-w-[1320px] mx-auto px-6 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-white" style={{fontSize: 28, fontWeight: 600}}>Как это работает</h2>
                        <p className="text-stone-400 mt-1" style={{fontSize: 15}}>От знакомства с платформой до создания собственной экскурсии — всего четыре шага</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {howItWorks.map((item) => (
                            <div key={item.step} className="text-center">
                                <div
                                    className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4 text-white"
                                    style={{fontSize: 18, fontWeight: 700}}>
                                    {item.step}
                                </div>
                                <h3 className="text-white mb-2"
                                    style={{fontSize: 16, fontWeight: 600}}>{item.title}</h3>
                                <p className="text-stone-400" style={{fontSize: 13, lineHeight: 1.6}}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <Link to="/catalog"
                              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-stone-900 rounded-lg no-underline hover:bg-stone-100 transition-colors"
                              style={{fontSize: 14, fontWeight: 500}}>
                            Зарегистрироваться <ChevronRight className="w-4 h-4"/>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
