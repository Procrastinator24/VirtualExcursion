import { Link } from 'react-router-dom';
import { MoreHorizontal, BookOpen, Layers, Users } from 'lucide-react';
import { ImageWithFallback } from '@shared/ui/imgWrapper/ImageWithFallback';
import type { WorkspaceResponse } from '../../types/workspace';

interface WorkspaceCardProps {
    workspace: WorkspaceResponse;
    onMenuClick?: (workspaceId: number) => void;
    className?: string;
}

export const WorkspaceCard = ({ workspace, onMenuClick, className = '' }: WorkspaceCardProps) => {
    const handleMenuClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onMenuClick?.(workspace.id);
    };

    const getAccessLevel = () => {
        if (workspace.type === 'personal') return 'Личное';
        if (workspace.type === 'team') return 'Командное';
        if (workspace.type === 'museum') return 'Музей';
        return 'Базовый';
    };

    return (
        <Link
            to={`/workspace/${workspace.id}`}
            className={`block bg-white rounded-lg border border-stone-200 hover:shadow-md transition-all ${className}`}
        >
            <div className="p-4">
                <div className="flex items-start gap-3">
                    {/* Логотип */}
                    <div className="shrink-0">
                        <ImageWithFallback
                            src={workspace.logoUrl || '/workspace-placeholder.jpg'}
                            alt={workspace.name}
                            className="w-14 h-14 rounded-lg object-cover"
                        />
                    </div>

                    {/* Информация */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-black text-base font-semibold font-['Inter'] truncate">
                                {workspace.name}
                            </h3>
                            <span className="px-1.5 py-0.5 bg-stone-100 rounded text-stone-600 text-xs font-medium">
                                {getAccessLevel()}
                            </span>
                        </div>

                        <p className="text-stone-500 text-sm line-clamp-1 mb-2">
                            {workspace.descriptionShort || 'Черновики экскурсий и экспонатов'}
                        </p>

                        {/* Статистика в одну строку */}
                        <div className="flex items-center gap-3 text-stone-500 text-xs">
                            <span className="flex items-center gap-1">
                                <Layers className="w-3.5 h-3.5" />
                                {workspace.scenesCount || 0} эксп.
                            </span>
                            <span className="flex items-center gap-1">
                                <BookOpen className="w-3.5 h-3.5" />
                                {workspace.excursionsCount || 0} экск.
                            </span>
                            <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5" />
                                {workspace.membersCount || 1} участ.
                            </span>
                        </div>
                    </div>

                    {/* Кнопка меню */}
                    {onMenuClick && (
                        <button
                            onClick={handleMenuClick}
                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-stone-100 transition-colors shrink-0"
                        >
                            <MoreHorizontal className="w-4 h-4 text-stone-400" />
                        </button>
                    )}
                </div>
            </div>
        </Link>
    );
};