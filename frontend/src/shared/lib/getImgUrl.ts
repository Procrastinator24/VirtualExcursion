/**
 * Получить полный URL изображения
 * @param path - относительный путь (например, /thumbnails/ancient_world.jpg)
 * @returns полный URL (например, http://localhost:5209/thumbnails/ancient_world.jpg)
 */
export const getImageUrl = (path?: string | null): string => {
    if (!path) {
        return '/placeholder-image.jpg';
    }

    // Если это уже абсолютный URL (http:// или https://), возвращаем как есть
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    // В продакшене можно использовать переменную окружения
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5209';

    // Убираем лишние слеши
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    return `${apiUrl}${normalizedPath}`;
};