import { useState } from 'react';
import { ImageWithFallback } from '@shared/ui/imgWrapper/ImageWithFallback';
import type { ExcursionFormData } from '../CreateExcursionPage';
import {excursionApi} from "../../../entities/excursion";

interface BasicInfoStepProps {
    data: ExcursionFormData;
    onChange: (data: Partial<ExcursionFormData>) => void;
    onNext: () => void;
}

export const BasicInfoStep = ({ data, onChange, onNext }: BasicInfoStepProps) => {
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        const response = await excursionApi.uploadThumbnail(formData);
        onChange({ thumbnailUrl: response.data.url });


        setUploading(false);
    };

    const isValid = data.title.trim() && data.description.trim();

    return (
        <div className="flex flex-col gap-6">
            {/* Название */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-0.5">
                    <span className="text-black text-base font-medium">Название</span>
                    <span className="text-red-600 text-base font-medium">*</span>
                </div>
                <input
                    type="text"
                    value={data.title}
                    onChange={(e) => onChange({ title: e.target.value })}
                    placeholder="Введите название экскурсии"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-stone-400 transition"
                />
            </div>

            {/* Описание */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-0.5">
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

            {/* Обложка */}
            <div className="flex flex-col gap-1">
                <span className="text-black text-base font-medium">Обложка</span>
                <div className="relative w-full h-40 rounded-2xl border-2 border-dashed border-stone-300 flex flex-col justify-center items-center gap-2 overflow-hidden">
                    {data.thumbnailUrl ? (
                        <>
                            <ImageWithFallback
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
                                onChange={handleFileUpload}
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