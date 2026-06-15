import { Link } from 'react-router-dom';
import { Star, MapPin, Clock } from 'lucide-react';
import { ImageWithFallback } from '@shared/ui/imgWrapper/ImageWithFallback';
import { SceneTypeBadge } from '@entities/sceneType';
import type { ExcursionResponse } from '../types/excursion';

interface ExcursionCardProps {
    excursion: ExcursionResponse;
    linkTo?: string;
    showGuideName?: boolean;
}

export const ExcursionCard = ({
                                  excursion,
                                  linkTo,
                                  showGuideName = true
                              }: ExcursionCardProps) => {
    const link = linkTo || `/excursion/${excursion.id}`;

    // Определяем тип контента (один или несколько)
    const contentTypes = excursion.contentTypes || (excursion.contentType ? [excursion.contentType] : []);

    return (
        <Link
            to={link}
            className="group bg-white rounded-xl overflow-hidden border border-stone-200/60 hover:shadow-lg hover:border-stone-300 transition-all no-underline"
        >
            {/* Изображение */}
            <div className="relative h-44 overflow-hidden">
                <ImageWithFallback
                    src={excursion.thumbnailUrl || '/placeholder-image.jpg'}
                    alt={excursion.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Бейджи в левом верхнем углу */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                {/* Бейдж типа контента */}
                    {contentTypes.length > 0 && contentTypes.slice(0, 2).map((type) => (
                        <SceneTypeBadge key={type} type={type} size="sm" />
                    ))}
                    {contentTypes.length > 2 && (
                        <span className="px-1.5 py-0.5 bg-stone-800/70 text-white text-[10px] rounded-md">
                            +{contentTypes.length - 2}
                        </span>
                )}

                    {/* Бейдж статуса публикации */}
                    {/*<span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${*/}
                    {/*    excursion.isPublished*/}
                    {/*        ? 'bg-green-100 text-green-700'*/}
                    {/*        : 'bg-amber-100 text-amber-700'*/}
                    {/*}`}>*/}
                    {/*    {excursion.isPublished ? 'Опубликовано' : 'Черновик'}*/}
                    {/*</span>*/}
            </div>
            </div>

            {/* Контент */}
            <div className="p-4">
                <h3 className="text-stone-900 mb-1 text-[15px] font-semibold line-clamp-1">
                    {excursion.title}
                </h3>

                <p className="text-stone-500 mb-3 text-[13px] leading-5 line-clamp-2">
                    {excursion.description || 'Описание отсутствует'}
                </p>

                {/* Теги */}
                {excursion.tagsNames && excursion.tagsNames.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                        {excursion.tagsNames.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-stone-400 text-xs">#{tag}</span>
                        ))}
                        {excursion.tagsNames.length > 3 && (
                            <span className="text-stone-400 text-xs">+{excursion.tagsNames.length - 3}</span>
                        )}
                    </div>
                    )}

                {/* Автор*/}
                <div className="flex items-center gap-1 text-stone-400 text-xs mb-2">
                    <MapPin className="w-3 h-3" />
                    <span>{excursion.workspaceName || 'Неизвестный гид'}</span>
                </div>

                {/* Статистика */}
                <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                    <div className="flex items-center gap-1 text-stone-500 text-xs">
                        <Clock className="w-3 h-3" />
                        {excursion.duration || '—'}
                    </div>
                    <div className="flex items-center gap-1 text-stone-500 text-xs">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{excursion.viewCount?.toLocaleString() || 0} просмотров</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};