// ✅ Единый тип для всех сцен
export type SceneType = "panorama" | "video" | "image" | "3d";

// ✅ Маппинг для отображения
export const sceneTypeLabels: Record<SceneType, string> = {
    panorama: "360° Панорама",
    video: "Видео",
    image: "Изображение",
    "3d": "3D Модель",
};

// ✅ Маппинг для цветов
export const sceneTypeColors: Record<SceneType, string> = {
    panorama: "bg-sky-100 text-sky-700",
    video: "bg-rose-100 text-rose-700",
    image: "bg-amber-100 text-amber-700",
    "3d": "bg-emerald-100 text-emerald-700",
};

// ✅ Маппинг для иконок (опционально)
export const sceneTypeIcons: Record<SceneType, string> = {
    panorama: "Globe",
    video: "Video",
    image: "Image",
    "3d": "Box",
};

// ✅ Функция для безопасного получения типа
export const normalizeSceneType = (type: string): SceneType => {
    // Приводим к нижнему регистру и убираем пробелы
    const normalized = type.toLowerCase().trim();
    
    // Маппинг старых/альтернативных названий
    const typeMap: Record<string, SceneType> = {
        'threed': '3d',
        'vr': 'panorama', // Или '3d' — зависит от твоего понимания VR
        '3d': '3d',
        'panorama': 'panorama',
        'video': 'video',
        'image': 'image',
    };
    
    return typeMap[normalized] || 'image'; // fallback
};