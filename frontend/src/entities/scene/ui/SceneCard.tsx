import { useNavigate } from 'react-router-dom';
import { Clock, Eye } from 'lucide-react';
import { ImageWithFallback } from '@shared/ui/imgWrapper/ImageWithFallback';
import { SceneTypeBadge } from '@entities/sceneType/ui/SceneTypeBadge';

export interface SceneCardProps {
    id: number;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    contentType?: string;
    isPublished?: boolean;
    viewCount?: number;
    createdAt?: string;
    /** ID экскурсии (опционально, для навигации в контексте экскурсии) */
    excursionId?: number;
}

export const SceneCard = ({
                              id,
                              title,
                              description,
                              thumbnailUrl,
                              contentType,
                              isPublished = true,
                              viewCount = 0,
                              createdAt,
                              excursionId,
                          }: SceneCardProps) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (excursionId) {
            navigate(`/scene/${excursionId}/${id}`);
        } else {
            navigate(`/scene/${id}`);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.ceil((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'вчера';
        if (diffDays < 7) return `${diffDays} дн. назад`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} нед. назад`;
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    };

    return (
        <div
            onClick={handleClick}
            className="group bg-white rounded-xl overflow-hidden border border-stone-200/60 hover:shadow-lg hover:border-stone-300 transition-all cursor-pointer"
        >
            {/* Изображение */}
            <div className="relative h-44 overflow-hidden">
                <ImageWithFallback
                    src={thumbnailUrl || '/placeholder-image.jpg'}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Бейджи */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {contentType && (
                        <SceneTypeBadge type={contentType} size="sm" />
                    )}
                    <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                            isPublished
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-700'
                        }`}
                    >
                        {isPublished ? 'Опубликовано' : 'Черновик'}
                    </span>
                </div>
            </div>

            {/* Контент */}
            <div className="p-4">
                <h3 className="text-stone-900 mb-1 text-[15px] font-semibold line-clamp-1">
                    {title}
                </h3>
                <p className="text-stone-500 mb-3 text-[13px] leading-5 line-clamp-2">
                    {description || 'Без описания'}
                </p>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                    <div className="flex items-center gap-1 text-stone-500 text-xs">
                        <Clock className="w-3 h-3" />
                        {formatDate(createdAt) || '—'}
                    </div>
                    <div className="flex items-center gap-1 text-stone-500 text-xs">
                        <Eye className="w-3 h-3" />
                        <span>{viewCount?.toLocaleString() || 0} просмотров</span>
                    </div>
                </div>
            </div>
        </div>
    );
};