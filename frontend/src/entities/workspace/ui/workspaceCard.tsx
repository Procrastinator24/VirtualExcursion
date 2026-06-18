import { Link } from 'react-router-dom';
import { MapPin, Users, BookOpen } from 'lucide-react';
import { ImageWithFallback } from '@shared/ui/imgWrapper/ImageWithFallback';
import type { WorkspaceResponse } from '../types/workspace';

interface WorkspaceCardProps {
    workspace: WorkspaceResponse;
    linkTo?: string;
    showStats?: boolean;
}

export const WorkspaceCard = ({
                                  workspace,
                                  linkTo,
                                  showStats = true,
                              }: WorkspaceCardProps) => {
    const link = linkTo || `/workspace/${workspace.id}`;

    return (
        <Link
            to={link}
            className="group bg-white rounded-xl overflow-hidden border border-stone-200/60 hover:shadow-lg hover:border-stone-300 transition-all cursor-pointer no-underline block"
        >
            {/* Логотип / изображение */}
            <div className="relative h-44 overflow-hidden">
                <ImageWithFallback
                    src={workspace.logoUrl || '/workspace-placeholder.jpg'}
                    alt={workspace.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Контент */}
            <div className="p-4">
                <h3 className="text-stone-900 mb-1 text-[15px] font-semibold line-clamp-1">
                    {workspace.name}
                </h3>

                <p className="text-stone-500 mb-3 text-[13px] leading-5 line-clamp-2">
                    {workspace.descriptionShort || workspace.descriptionLong || 'Нет описания'}
                </p>

                {/* Адрес */}
                {workspace.address && (
                    <div className="flex items-center gap-1 text-stone-400 mb-3 text-xs">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{workspace.address}</span>
                    </div>
                )}

                {/* Статистика */}
                {showStats && (
                    <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-stone-400 text-xs">
                        <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {workspace.membersCount || 1} участников
                        </span>
                        <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {workspace.excursionsCount || 0} экскурсий
                        </span>
                    </div>
                )}
            </div>
        </Link>
    );
};