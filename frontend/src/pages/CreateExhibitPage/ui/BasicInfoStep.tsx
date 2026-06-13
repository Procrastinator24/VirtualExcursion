import { useState } from 'react';
import { Image, Video, Globe, Box } from 'lucide-react';
import type { ExhibitFormData, ContentType } from '../CreateExhibitPage';

interface BasicInfoStepProps {
    data: ExhibitFormData;
    onChange: (data: Partial<ExhibitFormData>) => void;
    onNext: () => void;
}

const contentTypeOptions: { id: ContentType; label: string; icon: React.ReactNode; bgColor: string }[] = [
    { id: 'image', label: 'Фото', icon: <Image className="w-5 h-5" />, bgColor: 'bg-amber-100' },
    { id: 'video', label: 'Видео', icon: <Video className="w-5 h-5" />, bgColor: 'bg-rose-100' },
    { id: 'panorama', label: '360°', icon: <Globe className="w-5 h-5" />, bgColor: 'bg-sky-100' },
    { id: '3d', label: '3D-модель', icon: <Box className="w-5 h-5" />, bgColor: 'bg-emerald-100' },
];

export const BasicInfoStep = ({ data, onChange, onNext }: BasicInfoStepProps) => {
    const [uploading, setUploading] = useState(false);

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        // TODO: загрузить файл через API
        const mockUrl = URL.createObjectURL(file);
        onChange({ thumbnailUrl: mockUrl });
        setUploading(false);
    };

    const isSelected = (type: ContentType) => data.contentType === type;
    const isValid = data.title.trim() && data.description.trim();

    return (
        <div className="flex flex-col gap-6">
            {/* Название */}
            <div>
                <div className="flex items-center gap-0.5 mb-1">
                    <span className="text-black text-base font-medium">Название</span>
                    <span className="text-red-600 text-base font-medium">*</span>
                </div>
                <input
                    type="text"
                    value={data.title}
                    onChange={(e) => onChange({ title: e.target.value })}
                    placeholder="Введите название экспоната"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-stone-400 transition"
                />
            </div>

            {/* Описание */}
            <div>
                <div className="flex items-center gap-0.5 mb-1">
                    <span className="text-black text-base font-medium">Описание</span>
                    <span className="text-red-600 text-base font-medium">*</span>
                </div>
                <textarea
                    value={data.description}
                    onChange={(e) => onChange({ description: e.target.value })}
                    placeholder="Описание вашего проекта"
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-stone-400 transition resize-none"
                />
            </div>

            {/* Тип контента */}
            <div>
                <span className="text-black text-base font-medium">Тип контента</span>
                <div className="grid grid-cols-4 gap-3 mt-2">
                    {contentTypeOptions.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => onChange({ contentType: option.id })}
                            className={`flex-1 h-24 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${
                                isSelected(option.id)
                                    ? 'outline-2 outline-stone-900 bg-stone-50'
                                    : 'outline outline-1 outline-stone-200 hover:outline-stone-300'
                            }`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${option.bgColor}`}>
                                {option.icon}
                            </div>
                            <span className="text-stone-700 text-xs font-medium">{option.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Обложка */}
            <div>
                <span className="text-black text-base font-medium">Обложка</span>
                <div className="mt-1 relative w-full h-40 rounded-2xl border-2 border-dashed border-stone-300 flex flex-col justify-center items-center gap-2 overflow-hidden">
                    {data.thumbnailUrl ? (
                        <>
                            <img
                                src={data.thumbnailUrl}
                                alt="Обложка"
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={() => onChange({ thumbnailUrl: '' })}
                                className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded"
                            >
                                Удалить
                            </button>
                        </>
                    ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-2">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleThumbnailUpload}
                                className="hidden"
                            />
                            <div className="w-8 h-8 border-2 border-stone-300 rounded-lg" />
                            <span className="text-stone-500 text-xs">
                                {uploading ? 'Загрузка...' : 'Нажмите чтобы загрузить'}
                            </span>
                        </label>
                    )}
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={onNext}
                    disabled={!isValid}
                    className="px-6 py-2.5 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 disabled:opacity-50 transition"
                >
                    Продолжить
                </button>
            </div>
        </div>
    );
};