import { Link } from "react-router-dom";
import { Plus, BookOpen, Layers, CheckCircle, Star, Eye, ArrowRight } from "lucide-react";
import { sceneTypeLabels, sceneTypeColors } from "@entities/sceneType";
import { ImageWithFallback } from "@shared/ui/imgWrapper/ImageWithFallback";
import { useEffect, useState } from "react";
import { excursionApi } from "@entities/excursion";
import { sceneApi } from "@entities/scene";
import { useAuth } from "@app/Contexts";
import type {ExcursionResponse} from "../../entities/excursion";
import type {Scene} from "../../entities/scene";

export const GuideDashboardPage = () => {
    const { user } = useAuth();
    const [myExcursions, setMyExcursions] = useState<ExcursionResponse[]>([]);
    const [myExhibits, setMyExhibits] = useState<Scene[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        excursionsCount: 0,
        exhibitsCount: 0,
        totalViews: 0,
        avgRating: 0,
    });

    // Загрузка данных
    useEffect(() => {
        const loadData = async () => {
            if (!user?.guideProfileId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                // Загружаем экскурсии гида
                const excursionsRes = await excursionApi.getByGuideId(user.guideProfileId);
                const excursionsList = excursionsRes.data || [];
                setMyExcursions(excursionsList);

                // Загружаем сцены гида
                const scenesRes = await sceneApi.getByGuideId(user.guideProfileId);
                const scenesList = scenesRes.data || [];
                setMyExhibits(scenesList);

                // Считаем статистику
                const totalViews = excursionsList.reduce((sum, ex) => sum + (ex.viewCount || 0), 0);
                const totalRating = excursionsList.reduce((sum, ex) => sum + (ex.rating || 0), 0);
                const avgRating = excursionsList.length > 0
                    ? (totalRating / excursionsList.length).toFixed(1)
                    : "0";

                setStats({
                    excursionsCount: excursionsList.length,
                    exhibitsCount: scenesList.length,
                    totalViews: totalViews,
                    avgRating: parseFloat(avgRating),
                });

            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user]);

    // Если не гид
    if (!user?.guideProfileId) {
        return (
            <div className="max-w-[1320px] mx-auto px-6 py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Доступ ограничен</h1>
                <p className="text-stone-500">
                    Эта страница доступна только для верифицированных гидов.
                </p>
                <Link to="/profile" className="mt-4 inline-block text-stone-600 underline">
                    Вернуться в профиль
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="max-w-[1320px] mx-auto px-6 py-8">
                <div className="animate-pulse">
                    <div className="h-10 bg-stone-200 rounded w-64 mb-8" />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl border border-stone-200/60 p-5">
                                <div className="w-12 h-12 bg-stone-200 rounded-xl mb-3" />
                                <div className="h-4 bg-stone-200 rounded w-24" />
                                <div className="h-6 bg-stone-200 rounded w-16 mt-1" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1320px] mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-stone-900" style={{ fontSize: 30, fontWeight: 600 }}>
                        Панель гида
                    </h1>
                    <p className="text-stone-500 mt-1" style={{ fontSize: 15 }}>
                        Управляйте своими экскурсиями и сценами
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link
                        to="/create-exhibit"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:border-stone-300 transition-colors no-underline"
                        style={{ fontSize: 13, fontWeight: 500 }}
                    >
                        <Plus className="w-4 h-4" /> Новая сцена
                    </Link>
                    <Link
                        to="/create-excursion"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 text-white hover:bg-stone-800 transition-colors no-underline"
                        style={{ fontSize: 13, fontWeight: 500 }}
                    >
                        <Plus className="w-4 h-4" /> Новая экскурсия
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Всего экскурсий", value: stats.excursionsCount, icon: <BookOpen className="w-5 h-5" />, color: "bg-violet-50 text-violet-600" },
                    { label: "Всего сцен", value: stats.exhibitsCount, icon: <Layers className="w-5 h-5" />, color: "bg-sky-50 text-sky-600" },
                    { label: "Всего просмотров", value: stats.totalViews.toLocaleString(), icon: <Eye className="w-5 h-5" />, color: "bg-amber-50 text-amber-600" },
                    { label: "Ср. рейтинг", value: stats.avgRating, icon: <Star className="w-5 h-5" />, color: "bg-emerald-50 text-emerald-600" },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl border border-stone-200/60 p-5 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <span className="text-stone-400 block" style={{ fontSize: 12 }}>{stat.label}</span>
                            <span className="text-stone-900 block" style={{ fontSize: 24, fontWeight: 600 }}>
                                {stat.value}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Qualification Status */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex items-center gap-4">
                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                <div className="flex-1">
                    <span className="text-emerald-900 block" style={{ fontSize: 14, fontWeight: 600 }}>
                        Квалификация подтверждена
                    </span>
                    <span className="text-emerald-700" style={{ fontSize: 13 }}>
                        Ваши учетные данные гида подтверждены. У вас есть полный доступ к созданию и публикации экскурсий.
                    </span>
                </div>
                <span className="text-emerald-600 shrink-0" style={{ fontSize: 12, fontWeight: 500 }}>
                    Подтверждён
                </span>
            </div>

            {/* My Excursions */}
            {myExcursions.length > 0 && (
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-stone-900" style={{ fontSize: 20, fontWeight: 600 }}>
                            Мои экскурсии
                        </h2>
                        <Link
                            to="/create-excursion"
                            className="flex items-center gap-1 text-stone-600 hover:text-stone-900 no-underline"
                            style={{ fontSize: 13, fontWeight: 500 }}
                        >
                            Создать <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="bg-white rounded-xl border border-stone-200/60 overflow-hidden">
                        {myExcursions.map((ex, i) => {
                            // Определяем тип контента для бейджа
                            const contentType = ex.contentType || 'mixed';

                            return (
                                <Link
                                    key={ex.id}
                                    to={`/excursion/${ex.id}`}
                                    className={`flex flex-wrap items-center gap-4 p-4 no-underline hover:bg-stone-50 transition-colors ${
                                        i < myExcursions.length - 1 ? "border-b border-stone-100" : ""
                                    }`}
                                >
                                    <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-stone-100">
                                        <ImageWithFallback
                                            src={ex.thumbnailUrl || '/placeholder-image.jpg'}
                                            alt={ex.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-stone-900 block" style={{ fontSize: 14, fontWeight: 600 }}>
                                            {ex.title}
                                        </span>
                                        <span className="text-stone-500" style={{ fontSize: 12 }}>
                                            {ex.scenes?.length || 0} сцен · {ex.duration || '—'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded ${sceneTypeColors[contentType] || 'bg-stone-100 text-stone-700'}`} style={{ fontSize: 10, fontWeight: 500 }}>
                                            {sceneTypeLabels[contentType] || contentType}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-stone-400 shrink-0" style={{ fontSize: 12 }}>
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                        {ex.rating || ex.favouritesCount || 0}
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full shrink-0 ${
                                        ex.isPublished
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'bg-amber-50 text-amber-700'
                                    }`} style={{ fontSize: 11, fontWeight: 500 }}>
                                        {ex.isPublished ? 'Опубликовано' : 'Черновик'}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* My Exhibits */}
            {myExhibits.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-stone-900" style={{ fontSize: 20, fontWeight: 600 }}>
                            Мои сцены
                        </h2>
                        <Link
                            to="/create-exhibit"
                            className="flex items-center gap-1 text-stone-600 hover:text-stone-900 no-underline"
                            style={{ fontSize: 13, fontWeight: 500 }}
                        >
                            Создать <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {myExhibits.map((scene) => {
                            const contentType = scene.contentType || 'image';

                            return (
                                <Link
                                    key={scene.id}
                                    to={`/scene/${scene.id}`}
                                    className="bg-white rounded-xl overflow-hidden border border-stone-200/60 hover:shadow-md transition-all no-underline"
                                >
                                    <div className="relative h-24 overflow-hidden bg-stone-100">
                                        <ImageWithFallback
                                            src={scene.thumbnailUrl || '/placeholder-image.jpg'}
                                            alt={scene.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <span className={`absolute top-2 left-2 px-1.5 py-0.5 rounded ${sceneTypeColors[contentType] || 'bg-stone-100 text-stone-700'}`} style={{ fontSize: 9, fontWeight: 500 }}>
                                            {sceneTypeLabels[contentType] || contentType}
                                        </span>
                                    </div>
                                    <div className="p-2.5">
                                        <span className="text-stone-800 block truncate" style={{ fontSize: 11, fontWeight: 500 }}>
                                            {scene.title}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Если нет ни экскурсий, ни сцен */}
            {myExcursions.length === 0 && myExhibits.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-stone-200/60">
                    <p className="text-stone-500 mb-4">У вас пока нет созданных экскурсий или сцен</p>
                    <div className="flex gap-3 justify-center">
                        <Link to="/create-excursion" className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors">
                            Создать экскурсию
                        </Link>
                        <Link to="/create-exhibit" className="px-4 py-2 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">
                            Создать сцену
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuideDashboardPage;