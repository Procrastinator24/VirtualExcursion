import { Link } from 'react-router-dom';
import { ExcursionCard } from '@entities/excursion/ui/ExcursionCard';
import type { ExcursionResponse } from '@entities/excursion/types';

interface ExcursionsSectionProps {
    excursions: ExcursionResponse[];
    totalCount: number;
    onShowMore: () => void;
    showMoreVisible: boolean;
}

export const ExcursionsSection = ({ excursions, totalCount, onShowMore, showMoreVisible }: ExcursionsSectionProps) => {
    if (excursions.length === 0) return null;

    return (
        <div className="mt-14">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-stone-900 text-2xl font-semibold">Экскурсии</h2>
                {totalCount > 4 && !showMoreVisible && (
                    <Link to={`/catalog?workspaceId=${excursions[0]?.workspaceId}`} className="text-stone-600 text-base font-medium hover:underline">
                        Смотреть все
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {excursions.map((excursion) => (
                    <ExcursionCard key={excursion.id} excursion={excursion} showGuideName={false} />
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