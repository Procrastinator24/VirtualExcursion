import { Link } from 'react-router-dom';
import { ImageWithFallback } from '@shared/ui/imgWrapper/ImageWithFallback';
import { SceneTypeBadge } from '@entities/scenetype/ui/SceneTypeBadge';
import type { Scene } from '@entities/scene/types';

interface ExhibitsSectionProps {
    exhibits: Scene[];
    totalCount: number;
    onShowMore: () => void;
    showMoreVisible: boolean;
}

export const ExhibitsSection = ({ exhibits, totalCount, onShowMore, showMoreVisible }: ExhibitsSectionProps) => {
    if (exhibits.length === 0) return null;

    return (
        <div className="mt-14">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-stone-900 text-2xl font-semibold">Экспонаты</h2>
                <div className="flex items-center gap-2">
                    <span className="text-stone-500 text-sm">Сортировка:</span>
                    <select className="px-3 py-1.5 bg-stone-100 rounded-lg text-sm">
                        <option>По популярности</option>
                        <option>По дате</option>
                        <option>По названию</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                {exhibits.map((exhibit) => (
                    <Link
                        key={exhibit.id}
                        to={`/scene/${exhibit.id}`}
                        className="group bg-white rounded-xl overflow-hidden border border-stone-200/60 hover:shadow-lg transition-all no-underline"
                    >
                        <div className="relative h-48 overflow-hidden">
                            <ImageWithFallback
                                src={exhibit.thumbnailUrl || '/placeholder.jpg'}
                                alt={exhibit.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-2 left-2">
                                <SceneTypeBadge type={exhibit.contentType || 'image'} size="sm" />
                            </div>
                        </div>
                        <div className="p-3">
                            <h3 className="text-stone-800 text-sm font-semibold line-clamp-1">
                                {exhibit.title}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>

            {showMoreVisible && (
                <button
                    onClick={onShowMore}
                    className="w-full mt-6 py-3 bg-stone-100 rounded-xl text-stone-800 font-medium hover:bg-stone-200 transition-colors"
                >
                    Показать еще
                </button>
            )}
        </div>
    );
};