import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '@shared/ui/imgWrapper/ImageWithFallback';

export interface SceneCardProps {
    id: number;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    contentType?: string;
    tags?: string[];
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
                              tags = [],
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
            className="w-72 rounded-xl relative bg-white outline outline-1 outline-offset-[-1px] outline-stone-300 rounded-none inline-flex flex-col justify-start items-start overflow-hidden hover:shadow-lg hover:outline-stone-400 transition-all cursor-pointer group"
        >
            {/* Изображение */}
            <ImageWithFallback
                src={thumbnailUrl || 'https://placehold.co/302x187'}
                alt={title}
                className="self-stretch h-48 rounded-lg object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Контент */}
            <div className="w-full py-4 px-4 flex flex-col justify-start items-start gap-2">
                <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
                    <div className="self-stretch justify-start text-stone-900 text-lg font-semibold font-['Inter'] leading-6 line-clamp-1">
                        {title}
                    </div>
                </div>

                <div className="self-stretch flex flex-col justify-center items-start gap-2.5">
                    <div className="self-stretch justify-start text-stone-950 text-sm font-normal font-['Inter'] leading-4 line-clamp-2">
                        {description || 'Без описания'}
                    </div>
                </div>

                {/* Теги */}
                <div className="flex justify-start items-start gap-1.5 flex-wrap">
                    {tags.length > 0 ? (
                        tags.map((tag) => (
                            <div
                                key={tag}
                                className="px-2 py-1 bg-zinc-100 rounded-sm inline-flex flex-col justify-start items-center gap-2.5"
                            >
                                <div className="justify-start text-black text-xs font-medium font-['Inter'] leading-4">
                                    {tag}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-2 py-1 bg-zinc-100 rounded-sm">
                            <div className="justify-start text-stone-400 text-xs font-medium font-['Inter'] leading-4">
                                ВОВ
                            </div>
                        </div>
                    )}
                </div>

                {/* Просмотры и дата */}
                {/*<div className="flex items-center justify-between w-full mt-1 text-stone-500 text-xs font-['Inter']">*/}
                {/*    <span>{formatDate(createdAt) || '—'}</span>*/}
                {/*    <span>{viewCount?.toLocaleString() || 0} просмотров</span>*/}
                {/*</div>*/}
            </div>

            {/* Бейдж типа контента (абсолютный) */}
            {contentType && (
                <div className="absolute top-3 right-3 inline-flex justify-end items-start gap-1.5 flex-wrap content-start">
                    <div
                        className={`px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] inline-flex flex-col justify-start items-center gap-2.5 ${getContentTypeStyles(
                            contentType
                        )}`}
                    >
                        <div className="text-xs font-medium font-['Inter'] leading-4">
                            {contentType === '3d' && '3D-модель'}
                            {contentType === 'panorama' && 'Панорама'}
                            {contentType === 'video' && 'Видео'}
                            {contentType === 'image' && 'Изображение'}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};