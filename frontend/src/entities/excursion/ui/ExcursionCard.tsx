import { Link } from 'react-router-dom';
import { ImageWithFallback } from '@shared/ui/imgWrapper/ImageWithFallback';
import type { ExcursionResponse } from '../types/excursion';

interface ExcursionCardProps {
    excursion: ExcursionResponse;
    linkTo?: string;
}

// Определяем цвет бейджа в зависимости от типа контента
const getContentTypeStyles = (type?: string) => {
    switch (type?.toLowerCase()) {
        case '3d':
            return 'bg-orange-100 outline-orange-600 text-orange-600';
        case 'panorama':
            return 'bg-blue-100 outline-blue-600 text-blue-600';
        case 'video':
            return 'bg-red-100 outline-red-600 text-red-600';
        case 'image':
            return 'bg-green-100 outline-green-600 text-green-600';
        default:
            return 'bg-gray-100 outline-gray-500 text-gray-600';
    }
};

const getContentTypeLabel = (type?: string) => {
    switch (type?.toLowerCase()) {
        case '3d': return '3D-модель';
        case 'panorama': return 'Панорама';
        case 'video': return 'Видео';
        case 'image': return 'Фото';
        default: return type || 'Контент';
    }
};

export const ExcursionCard = ({
                                  excursion,
                                  linkTo,
                              }: ExcursionCardProps) => {
    const link = linkTo || `/excursion/${excursion.id}`;

    // Уникальные типы контента
    const contentTypes = excursion.contentTypes || [];

    return (
        <Link
            to={link}
            className="w-72 relative inline-flex flex-col justify-start items-start no-underline group hover:opacity-90 transition-opacity"
        >
            {/* Изображение */}
            <div className="relative w-72 h-44 rounded-lg overflow-hidden">
                <ImageWithFallback
                    src={excursion.thumbnailUrl || 'https://placehold.co/302x180'}
                    alt={excursion.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Бейджи типов контента (абсолютные, в правом верхнем углу) */}
                <div className="absolute top-2 right-2 inline-flex justify-end items-start gap-1.5 flex-wrap content-start">
                    {contentTypes.length > 0 && contentTypes.slice(0, 2).map((type) => (
                        <div
                            key={type}
                            className={`px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] inline-flex flex-col justify-start items-center gap-2.5 ${getContentTypeStyles(
                                type
                            )}`}
                        >
                            <div className="text-xs font-medium font-['Inter'] leading-4">
                                {getContentTypeLabel(type)}
                            </div>
                        </div>
                    ))}
                    {contentTypes.length > 2 && (
                        <div className="px-2 py-1 bg-stone-800/80 rounded-lg inline-flex flex-col justify-start items-center gap-2.5">
                            <div className="text-white text-xs font-medium font-['Inter'] leading-4">
                                +{contentTypes.length - 2}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Контент */}
            <div className="w-full pt-3 pb-4 flex flex-col justify-start items-start gap-2">
                <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
                    <div className="self-stretch justify-start text-stone-900 text-lg font-semibold font-['Inter'] leading-6 line-clamp-2">
                        {excursion.title}
                    </div>
                </div>

                <div className="self-stretch flex flex-col justify-center items-start gap-2.5">
                    <div className="self-stretch justify-start text-stone-950 text-sm font-normal font-['Inter'] leading-4 line-clamp-1">
                        {excursion.workspaceName || 'Красноярский краевой краеведческий музей'}
                    </div>
                </div>
            </div>
        </Link>
    );
};