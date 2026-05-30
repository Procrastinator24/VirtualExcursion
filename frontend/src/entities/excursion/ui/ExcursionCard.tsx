import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { ImageWithFallback } from '@shared/ui/imgWrapper/ImageWithFallback';
import { SceneTypeBadge } from '@entities/sceneType';
import type { ExcursionResponse } from '../types/excursion.ts';

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

    return (
        <Link
            to={link}
            className="group bg-white rounded-xl overflow-hidden border border-stone-200/60 hover:shadow-lg hover:border-stone-300 transition-all no-underline"
        >
            {/* Изображение */}
            <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                    src={excursion.thumbnailUrl || '/placeholder-image.jpg'}
                    alt={excursion.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Бейдж типа контента */}
                {excursion.contentType && (
                    <div className="absolute top-3 left-3">
                        <SceneTypeBadge type={excursion.contentType} />
                    </div>
                )}
            </div>

            {/* Контент */}
            <div className="p-4">
                <h3 className="text-stone-900 mb-1" style={{ fontSize: 15, fontWeight: 600 }}>
                    {excursion.title}
                </h3>

                <p className="text-stone-500 mb-3 line-clamp-2" style={{ fontSize: 13, lineHeight: 1.5 }}>
                    {excursion.description || 'Описание отсутствует'}
                </p>

                <div className="flex items-center justify-between text-stone-400" style={{ fontSize: 12 }}>
                    {showGuideName && (
                        <span>{excursion.guideName || 'Неизвестный гид'}</span>
                    )}
                    <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-stone-600">{excursion.favouritesCount || 0}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};