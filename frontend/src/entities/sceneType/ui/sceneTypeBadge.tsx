// Маппинг типа контента → читаемое название
const contentTypeLabels: Record<string, string> = {
    'vr': 'VR',
    'panorama': '360°',
    'video': 'Видео',
    'image': 'Изображение',
    'threed': '3D Модель',
};

// Маппинг типа контента → цветовые классы Tailwind
const contentTypeColors: Record<string, string> = {
    'vr': 'bg-purple-100 text-purple-700',
    'panorama': 'bg-blue-100 text-blue-700',
    'video': 'bg-red-100 text-red-700',
    'image': 'bg-amber-100 text-amber-700',
    'threed': 'bg-emerald-100 text-emerald-700',
};

interface SceneTypeBadgeProps {
    type: string;
    size?: 'sm' | 'md';
    className?: string;
}

export const SceneTypeBadge = ({ type, size = 'sm', className = '' }: SceneTypeBadgeProps) => {
    const label = contentTypeLabels[type] || type || 'Неизвестно';
    const colorClass = contentTypeColors[type] || 'bg-stone-100 text-stone-700';

    const sizeClasses = {
        sm: 'px-1.5 py-0.5 text-[11px]',
        md: 'px-2 py-1 text-[13px]',
    };

    return (
        <span className={`${colorClass} ${sizeClasses[size]} rounded-md font-medium inline-block ${className}`}>
            {label}
        </span>
    );
};