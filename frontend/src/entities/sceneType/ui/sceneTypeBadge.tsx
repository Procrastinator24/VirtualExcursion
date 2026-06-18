import { sceneTypeLabels, sceneTypeColors, normalizeSceneType } from '../types/sceneTypes';

interface SceneTypeBadgeProps {
    type: string | string[]; // ✅ Принимает и строку, и массив
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    maxDisplay?: number; // ✅ Сколько показывать (для массива)
    showIcon?: boolean;
}

const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[11px]',
    md: 'px-2 py-1 text-[13px]',
    lg: 'px-2.5 py-1.5 text-sm',
};

export const SceneTypeBadge = ({ 
    type, 
    size = 'sm', 
    className = '',
    maxDisplay = 3,
    showIcon = false,
}: SceneTypeBadgeProps) => {
    // ✅ Приводим к массиву для единообразия
    const types = Array.isArray(type) ? type : [type];
    
    // ✅ Убираем дубли и пустые значения
    const uniqueTypes = [...new Set(types.filter(Boolean))];
    
    if (uniqueTypes.length === 0) {
        return null;
    }

    // ✅ Если один тип — показываем один бейдж
    if (uniqueTypes.length === 1) {
        const normalizedType = normalizeSceneType(uniqueTypes[0]);
        const label = sceneTypeLabels[normalizedType] || uniqueTypes[0] || 'Неизвестно';
        const colorClass = sceneTypeColors[normalizedType] || 'bg-stone-100 text-stone-700';

        return (
            <span className={`${colorClass} ${sizeClasses[size]} rounded-md font-medium inline-block ${className}`}>
                {label}
            </span>
        );
    }

    // ✅ Если несколько типов — показываем несколько бейджей
    const displayTypes = uniqueTypes.slice(0, maxDisplay);
    const remainingCount = uniqueTypes.length - maxDisplay;

    return (
        <div className={`flex flex-wrap gap-1 ${className}`}>
            {displayTypes.map((t) => {
                const normalizedType = normalizeSceneType(t);
                const label = sceneTypeLabels[normalizedType] || t || 'Неизвестно';
                const colorClass = sceneTypeColors[normalizedType] || 'bg-stone-100 text-stone-700';
                
                return (
                    <span 
                        key={t} 
                        className={`${colorClass} ${sizeClasses[size]} rounded-md font-medium inline-block`}
                    >
                        {label}
                    </span>
                );
            })}
            {remainingCount > 0 && (
                <span className="text-stone-400 text-xs px-1.5 py-0.5">
                    +{remainingCount}
                </span>
            )}
        </div>
    );
};