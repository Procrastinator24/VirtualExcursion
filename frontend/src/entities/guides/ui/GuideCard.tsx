import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { ImageWithFallback } from '@shared/ui/imgWrapper/ImageWithFallback';
import type { GuideProfileResponse } from '../types/types.ts';

interface GuideCardProps {
    guide: GuideProfileResponse;
    linkTo?: string;
    showAddress?: boolean;
}

export const GuideCard = ({ guide, linkTo, showAddress = true }: GuideCardProps) => {
    const link = linkTo || `/author/${guide.id}`;
    const displayName = guide.isOrganization ? guide.organizationName : guide.userName;
    const address = guide.address;

    return (
        <Link
            to={link}
            className="group bg-white rounded-xl overflow-hidden border border-stone-200/60 hover:shadow-lg transition-all no-underline"
        >
            {/* Изображение / логотип */}
            <div className="h-36 overflow-hidden">
                <ImageWithFallback
                    src={guide.logoUrl || '/placeholder-avatar.jpg'}
                    alt={displayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Контент */}
            <div className="p-4">
                <h3 className="text-stone-900" style={{ fontSize: 15, fontWeight: 600 }}>
                    {displayName}
                </h3>

                {/* Адрес (только для организаций и если включено) */}
                {showAddress && address && (
                    <p className="text-stone-500 mt-0.5" style={{ fontSize: 13 }}>
                        {address}
                    </p>
                )}

                {/* Статистика */}
                <div className="flex items-center gap-4 mt-3 text-stone-400" style={{ fontSize: 12 }}>
                    <span>{guide.excursionsCount} экскурсий</span>
                    <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{guide.rating || 0}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};