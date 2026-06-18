import { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { ImageWithFallback } from '@shared/ui/imgWrapper/ImageWithFallback';
import { UserApi } from '@entities/user';

interface AvatarUploadProps {
    currentAvatarUrl?: string;
    userName: string;
    onAvatarUpdate: (newAvatarUrl: string) => void;
}

export const AvatarUpload = ({ currentAvatarUrl, userName, onAvatarUpdate }: AvatarUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Проверка типа файла
        if (!file.type.startsWith('image/')) {
            alert('Пожалуйста, выберите изображение');
            return;
        }

        // Проверка размера (макс 5 МБ)
        if (file.size > 5 * 1024 * 1024) {
            alert('Размер файла не должен превышать 5 МБ');
            return;
        }

        // Показываем превью
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        setUploading(true);

        try {
            // Загружаем файл на сервер
            const { url } = await UserApi.uploadAvatar(file);

            // Обновляем аватарку
            onAvatarUpdate(url);

            // Сбрасываем временное превью
            URL.revokeObjectURL(objectUrl);
            setPreviewUrl(null);
        } catch (error) {
            console.error('Failed to upload avatar:', error);
            alert('Не удалось загрузить аватар. Попробуйте позже.');
            setPreviewUrl(null);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="relative">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
            />
            <button
                onClick={handleAvatarClick}
                disabled={uploading}
                className="relative block focus:outline-none"
            >
                <ImageWithFallback
                    src={previewUrl || currentAvatarUrl || '/placeholder-avatar.jpg'}
                    alt={userName}
                    className="w-24 h-24 rounded-full object-cover"
                />
                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center border-2 border-white hover:bg-stone-700 transition-colors">
                    {uploading ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Camera className="w-3.5 h-3.5" />
                    )}
                </div>
            </button>
        </div>
    );
};