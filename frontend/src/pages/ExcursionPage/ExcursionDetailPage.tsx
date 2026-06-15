import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, MapPin, Play, ChevronRight, Eye, Box, Image, Video, Globe, Bookmark, Share2, User } from 'lucide-react';
import { excursionApi } from '@entities/excursion/api/excursion.api';
import { favouriteApi } from '@entities/favourite/api/favourite.api';
import { ImageWithFallback } from '@shared/ui/imgWrapper/ImageWithFallback';
import type { ExcursionResponse } from '@entities/excursion/types/excursion';
import type { SceneShortResponse } from '@entities/scene/types/scene';

// Типы для иконок
const typeIcon: Record<string, React.ReactNode> = {
    vr: <Eye className="w-3.5 h-3.5" />,
    panorama: <Globe className="w-3.5 h-3.5" />,
    video: <Video className="w-3.5 h-3.5" />,
    image: <Image className="w-3.5 h-3.5" />,
    '3d': <Box className="w-3.5 h-3.5" />,
};

// Маппинг типа контента для отображения
const contentTypeLabels: Record<string, string> = {
    vr: 'VR',
    panorama: '360°',
    video: 'Video',
    '3d': '3D Model',
    image: 'Image',
};

const contentTypeColors: Record<string, string> = {
    vr: 'bg-purple-100 text-purple-700',
    panorama: 'bg-blue-100 text-blue-700',
    video: 'bg-red-100 text-red-700',
    '3d': 'bg-emerald-100 text-emerald-700',
    image: 'bg-amber-100 text-amber-700',
};

export const ExcursionDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [excursion, setExcursion] = useState<ExcursionResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFavourite, setIsFavourite] = useState(false);
    const [isFavouriteLoading, setIsFavouriteLoading] = useState(false);

    // Загрузка экскурсии
    useEffect(() => {
        if (!id) return;

        const fetchExcursion = async () => {
            setLoading(true);
            try {
                const response = await excursionApi.getById(parseInt(id));
                setExcursion(response.data);

                // Увеличиваем счётчик просмотров
                //await excursionApi.incrementViewCount(parseInt(id));
            } catch (err) {
                console.error('Failed to load excursion:', err);
                setError('Не удалось загрузить экскурсию');
            } finally {
                setLoading(false);
            }
        };

        fetchExcursion();
    }, [id]);

    // Проверка наличия в избранном
    useEffect(() => {
        if (!excursion) return;

        const checkFavourite = async () => {
            try {
                const response = await favouriteApi.isFavourite({ excursionId: excursion.id });
                setIsFavourite(response.data);
            } catch (err) {
                console.error('Failed to check favourite:', err);
            }
        };

        checkFavourite();
    }, [excursion]);

    // Добавление/удаление из избранного
    const toggleFavourite = async () => {
        if (!excursion) return;

        setIsFavouriteLoading(true);
        try {
            if (isFavourite) {
                // Нужно получить ID записи избранного для удаления
                // Пока сделаем через отдельный эндпоинт
                await favouriteApi.removeByExcursion(excursion.id);
                setIsFavourite(false);
            } else {
                await favouriteApi.add({ excursionId: excursion.id });
                setIsFavourite(true);
            }
        } catch (err) {
            console.error('Failed to toggle favourite:', err);
        } finally {
            setIsFavouriteLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-[1320px] mx-auto px-6 py-8">
                <div className="animate-pulse">
                    <div className="h-80 bg-stone-200 rounded-xl mb-8" />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="h-8 bg-stone-200 rounded w-3/4 mb-4" />
                            <div className="h-4 bg-stone-200 rounded w-full mb-2" />
                            <div className="h-4 bg-stone-200 rounded w-5/6 mb-2" />
                            <div className="h-4 bg-stone-200 rounded w-4/6" />
                        </div>
                        <div>
                            <div className="h-32 bg-stone-200 rounded" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !excursion) {
        return (
            <div className="max-w-[1320px] mx-auto px-6 py-20 text-center">
                <p className="text-stone-500">{error || 'Экскурсия не найдена'}</p>
                <Link to="/catalog" className="mt-4 inline-block text-stone-600 underline">
                    Вернуться к каталогу
                </Link>
            </div>
        );
    }

    // Определяем тип контента для отображения бейджей
    const contentType = excursion.contentType || '3d';
    const scenes = excursion.scenes || [];

    return (
        <div>
            {/* Hero */}
            <div className="relative h-80">
                <ImageWithFallback
                    src={excursion.thumbnailUrl || '/placeholder.jpg'}
                    alt={excursion.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 max-w-[1320px] mx-auto px-6 pb-8">
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`px-2.5 py-1 rounded-md ${contentTypeColors[contentType]}`} style={{ fontSize: 12, fontWeight: 500 }}>
                            {contentTypeLabels[contentType] || contentType}
                        </span>
                        {excursion.isPublished ? (
                            <span className="px-2.5 py-1 rounded-md bg-green-100 text-green-700" style={{ fontSize: 12, fontWeight: 500 }}>
                                Опубликовано
                            </span>
                        ) : (
                            <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-700" style={{ fontSize: 12, fontWeight: 500 }}>
                                Черновик
                            </span>
                        )}
                    </div>
                    <h1 className="text-white" style={{ fontSize: 36, fontWeight: 600 }}>
                        {excursion.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-white/70" style={{ fontSize: 13 }}>
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {excursion.guideName || 'Неизвестный гид'}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {excursion.duration || '—'}
                        </span>
                        <span className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {excursion.rating || excursion.viewCount || 0} просмотров
                        </span>
                        {excursion.tagsNames && excursion.tagsNames.length > 0 && (
                            <span className="flex items-center gap-1">
                                #{excursion.tagsNames[0]}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-[1320px] mx-auto px-6 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <div className="bg-white rounded-xl border border-stone-200/60 p-6">
                            <h2 className="text-stone-900 mb-3" style={{ fontSize: 20, fontWeight: 600 }}>
                                Об экскурсии
                            </h2>
                            <p className="text-stone-600" style={{ fontSize: 15, lineHeight: 1.7 }}>
                                {excursion.description || 'Описание отсутствует'}
                            </p>
                            <p className="text-stone-500 mt-3" style={{ fontSize: 14, lineHeight: 1.7 }}>
                                Эта экскурсия включает {scenes.length} сцен. Следуйте маршруту через исторические объекты,
                                с интерактивными точками интереса, открывающими исторический контекст на каждом шагу.
                            </p>
                        </div>

                        {/* Route Timeline */}
                        {scenes.length > 0 && (
                            <div className="bg-white rounded-xl border border-stone-200/60 p-6">
                                <h2 className="text-stone-900 mb-5" style={{ fontSize: 20, fontWeight: 600 }}>
                                    Маршрут экскурсии
                                </h2>
                                <div className="space-y-0">
                                    {scenes.map((scene, index) => {
                                        const sceneType = scene.sceneContentType || '3d';
                                        return (
                                            <div key={scene.sceneId} className="flex gap-4">
                                                {/* Timeline line */}
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${contentTypeColors[sceneType]}`}>
                                                        {typeIcon[sceneType] || <Box className="w-3.5 h-3.5" />}
                                                    </div>
                                                    {index < scenes.length - 1 && <div className="w-px flex-1 bg-stone-200 my-1" />}
                                                </div>
                                                {/* Content */}
                                                <Link
                                                    to={`/scene/${excursion.id}/${scene.sceneId}`}
                                                    className="flex-1 group mb-4 no-underline"
                                                >
                                                    <div className="flex gap-4 p-3 rounded-xl hover:bg-stone-50 transition-colors -ml-1">
                                                        <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-stone-100">
                                                            <ImageWithFallback
                                                                src={scene.sceneThumbnailUrl || '/placeholder.jpg'}
                                                                alt={scene.sceneTitle}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                                                <span className="text-stone-900" style={{ fontSize: 14, fontWeight: 600 }}>
                                                                    {scene.sceneTitle}
                                                                </span>
                                                                <span className={`px-1.5 py-0.5 rounded ${contentTypeColors[sceneType]}`} style={{ fontSize: 10, fontWeight: 500 }}>
                                                                    {contentTypeLabels[sceneType] || sceneType}
                                                                </span>
                                                            </div>
                                                            <p className="text-stone-500 line-clamp-1" style={{ fontSize: 13 }}>
                                                                {scene.sceneDescription || 'Без описания'}
                                                            </p>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 shrink-0 mt-1" />
                                                    </div>
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-5">
                        {/* Start Button */}
                        <div className="bg-white rounded-xl border border-stone-200/60 p-5 sticky top-24">
                            <Link
                                to={scenes.length > 0 ? `/scene/${excursion.id}/${scenes[0].sceneId}` : '#'}
                                className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl transition-colors ${
                                    scenes.length > 0
                                        ? 'bg-stone-900 text-white hover:bg-stone-800'
                                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                                }`}
                                style={{ fontSize: 15, fontWeight: 500 }}
                            >
                                <Play className="w-4 h-4" /> Начать экскурсию
                            </Link>
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={toggleFavourite}
                                    disabled={isFavouriteLoading}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-colors ${
                                        isFavourite
                                            ? 'bg-stone-100 border-stone-200 text-stone-900'
                                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                                    }`}
                                    style={{ fontSize: 13 }}
                                >
                                    <Bookmark className={`w-4 h-4 ${isFavourite ? 'fill-stone-900' : ''}`} />
                                    {isFavourite ? 'Сохранено' : 'Сохранить'}
                                </button>
                                <button
                                    onClick={() => navigator.share?.({ title: excursion.title, url: window.location.href })}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
                                    style={{ fontSize: 13 }}
                                >
                                    <Share2 className="w-4 h-4" /> Поделиться
                                </button>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="bg-white rounded-xl border border-stone-200/60 p-5">
                            <span className="text-stone-400 mb-3 block" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Детали
                            </span>
                            <div className="space-y-3" style={{ fontSize: 13 }}>
                                {[
                                    ['Продолжительность', excursion.duration || '—'],
                                    ['Сцены', `${scenes.length} ${scenes.length === 1 ? 'сцена' : 'сцен'}`],
                                    ['Гид', excursion.guideName || '—'],
                                    ['Просмотры', excursion.viewCount?.toLocaleString() || '0'],
                                    ['Дата создания', new Date(excursion.createdAt).toLocaleDateString('ru-RU')],
                                ].map(([label, value]) => (
                                    <div key={label} className="flex justify-between">
                                        <span className="text-stone-400">{label}</span>
                                        <span className="text-stone-700" style={{ fontWeight: 500 }}>{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tags */}
                        {excursion.tagsNames && excursion.tagsNames.length > 0 && (
                            <div className="bg-white rounded-xl border border-stone-200/60 p-5">
                                <span className="text-stone-400 mb-3 block" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Теги
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {excursion.tagsNames.map((tag, idx) => (
                                        <Link
                                            key={idx}
                                            to={`/catalog?tag=${encodeURIComponent(tag)}`}
                                            className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
                                            style={{ fontSize: 12 }}
                                        >
                                            #{tag}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExcursionDetailPage;