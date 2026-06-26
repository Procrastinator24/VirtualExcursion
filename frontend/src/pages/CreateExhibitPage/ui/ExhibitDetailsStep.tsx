import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X, Check } from 'lucide-react';
import { excursionApi, ExcursionResponse } from '@entities/excursion';
import { ImageWithFallback } from '@shared/ui/imgWrapper/ImageWithFallback';
import type {CreateSceneRequest} from "../../../entities/scene/types/scene.ts";

interface ExhibitDetailsStepProps {
    data: CreateSceneRequest;
    onChange: (data: Partial<CreateSceneRequest>) => void;
    onSaveAsDraft: () => void;
    onPublish: () => void;
    onBack: () => void;
    loading: boolean;
}

// Типы для тегов (опционально)
interface Tag {
    id: number;
    name: string;
}

export const ExhibitDetailsStep = ({
                                       data,
                                       onChange,
                                       onSaveAsDraft,
                                       onPublish,
                                       onBack,
                                       loading,
                                   }: ExhibitDetailsStepProps) => {
    const [searchParams] = useSearchParams();
    const workspaceId = searchParams.get('workspaceId');

    // Состояния для данных
    const [excursions, setExcursions] = useState<ExcursionResponse[]>([]);
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [tagInput, setTagInput] = useState('');

    // Выбранные экскурсии (ID)
    const [selectedExcursionIds, setSelectedExcursionIds] = useState<number[]>(data.excursionIds || []);
    // Выбранные теги
    const [selectedTags, setSelectedTags] = useState<number[]>(data.tagIds || []);

    // Загрузка экскурсий пространства
    useEffect(() => {
        const loadExcursions = async () => {
            if (!workspaceId) return;
            setLoadingData(true);
            try {
                const response = await excursionApi.getByWorkspaceId(parseInt(workspaceId));
                setExcursions(response.data);
            } catch (error) {
                console.error('Failed to load excursions:', error);
            } finally {
                setLoadingData(false);
            }
        };
        loadExcursions();
    }, [workspaceId]);

    // Загрузка доступных тегов (TODO: подключить API)
    useEffect(() => {
        // TODO: загрузить теги из API
        setAvailableTags([
            { id: 1, name: 'Архитектура' },
            { id: 2, name: 'Живопись' },
            { id: 3, name: 'Скульптура' },
            { id: 4, name: 'История' },
            { id: 5, name: 'Этнография' },
            { id: 6, name: 'Археология' },
        ]);
    }, []);

    // Обновление родительского state при изменении
    useEffect(() => {
        onChange({
            excursionIds: selectedExcursionIds,
            //tags: selectedTags,
        });
    }, [selectedExcursionIds, selectedTags]);

    const toggleExcursion = (excursionId: number) => {
        setSelectedExcursionIds(prev =>
            prev.includes(excursionId)
                ? prev.filter(id => id !== excursionId)
                : [...prev, excursionId]
        );
    };

    const addTag = () => {
        const trimmed = tagInput.trim();
        if (!trimmed) return;

        // Поиск существующего тега
        const existingTag = availableTags.find(t => t.name.toLowerCase() === trimmed.toLowerCase());
        if (existingTag && !selectedTags.some(t => t === existingTag.id)) {
            //setSelectedTags([...selectedTags, existingTag]);
        } //else if (!selectedTags.some(t => t.name.toLowerCase() === trimmed.toLowerCase())) {
            // Временный тег (будет создан на сервере)
            //setSelectedTags([...selectedTags, { id: -Date.now(), name: trimmed }]);
        //}
        setTagInput('');
    };

    const removeTag = (tagId: number) => {
        setSelectedTags(prev => prev.filter(t => t !== tagId));
    };

    const removeExcursion = (excursionId: number) => {
        setSelectedExcursionIds(prev => prev.filter(id => id !== excursionId));
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Обложка экспоната */}
            <div>
                <h2 className="text-stone-800 font-semibold mb-2">Обложка экспоната</h2>
                <div className="border-2 border-dashed border-stone-300 rounded-2xl p-6 text-center hover:border-stone-400 transition cursor-pointer">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                // TODO: загрузить обложку
                                const url = URL.createObjectURL(file);
                                onChange({ thumbnailUrl: url });
                            }
                        }}
                        className="hidden"
                        id="cover-upload"
                    />
                    <label htmlFor="cover-upload" className="cursor-pointer block">
                        {data.thumbnailUrl ? (
                            <div className="relative">
                                <ImageWithFallback
                                    src={data.thumbnailUrl}
                                    alt="Обложка"
                                    className="max-h-32 mx-auto rounded-lg object-contain"
                                />
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onChange({ thumbnailUrl: undefined });
                                    }}
                                    className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 text-stone-400">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M12 4v16m8-8H4" stroke="currentColor" />
                                    </svg>
                                </div>
                                <div className="text-stone-600 text-base font-medium">
                                    Перетащите или загрузите файл с устройства
                                </div>
                                <div className="text-stone-400 text-xs">
                                    Выбранное фото будет отображаться в карточке экспоната
                                </div>
                            </div>
                        )}
                    </label>
                </div>
            </div>

            {/* Направление (период) */}
            <div>
                <label className="text-black text-base font-medium">Направление</label>
                <input
                    type="text"
                    value={data.period || ''}
                    onChange={(e) => onChange({ period: e.target.value })}
                    placeholder="Введите направление экскурсии"
                    className="w-full mt-1 px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-stone-400"
                />
            </div>

            {/* Город (регион) */}
            <div>
                <label className="text-black text-base font-medium">Город</label>
                <input
                    type="text"
                    value={data.region || ''}
                    onChange={(e) => onChange({ region: e.target.value })}
                    placeholder="Введите город"
                    className="w-full mt-1 px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-stone-400"
                />
            </div>

            {/* Теги */}
            <div>
                <label className="text-black text-base font-medium">Теги</label>
                <div className="mt-1 flex flex-wrap items-center gap-2 p-2 border border-stone-200 rounded-xl focus-within:border-stone-400">
                    {selectedTags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-stone-300 text-stone-600 text-xs"
                        >
                            {tag}
                            <button onClick={() => removeTag(tag)} className="hover:text-red-500">
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTag()}
                        placeholder="Введите тег"
                        className="flex-1 min-w-[100px] outline-none text-sm py-1"
                    />
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                    {/* {availableTags
                        .filter(t => !selectedTags.some(s => s.id === t.id))
                        .slice(0, 6)
                        .map((tag) => (
                            <button
                                key={tag.id}
                                onClick={() => setSelectedTags([...selectedTags, tag])}
                                className="px-2 py-1 rounded-lg border border-stone-300 text-stone-500 text-xs hover:bg-stone-50"
                            >
                                + {tag.name}
                            </button>
                        ))} */}
                </div>
            </div>

            {/* Экскурсии */}
            <div>
                <label className="text-black text-base font-medium">Экскурсии</label>
                <div className="mt-2 space-y-2">
                    {excursions.map((excursion) => (
                        <div
                            key={excursion.id}
                            onClick={() => toggleExcursion(excursion.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                                selectedExcursionIds.includes(excursion.id)
                                    ? 'border-stone-900 bg-stone-50'
                                    : 'border-stone-200 hover:border-stone-300'
                            }`}
                        >
                            <div className="w-5 h-5 rounded-md border border-stone-300 flex items-center justify-center">
                                {selectedExcursionIds.includes(excursion.id) && (
                                    <Check className="w-3.5 h-3.5 text-stone-900" />
                                )}
                            </div>
                            <div className="w-14 h-10 bg-stone-100 rounded-md overflow-hidden shrink-0">
                                <ImageWithFallback
                                    src={excursion.thumbnailUrl || '/placeholder.jpg'}
                                    alt={excursion.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="text-stone-800 text-sm font-medium">{excursion.title}</div>
                                <div className="text-stone-400 text-xs">
                                    {excursion.scenes?.length || 0} экспонатов
                                </div>
                            </div>
                            <div className="shrink-0">
                                <span className={`px-2 py-1 rounded text-xs ${
                                    excursion.isPublished
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-stone-100 text-stone-500'
                                }`}>
                                    {excursion.isPublished ? 'Опубликовано' : 'Черновик'}
                                </span>
                            </div>
                        </div>
                    ))}

                    {excursions.length === 0 && !loadingData && (
                        <div className="text-center py-8 text-stone-400 bg-stone-50 rounded-xl">
                            Нет доступных экскурсий
                            <button
                                onClick={() => window.location.href = `/create-excursion?workspaceId=${workspaceId}`}
                                className="block mt-2 text-stone-600 underline text-sm"
                            >
                                Создать экскурсию
                            </button>
                        </div>
                    )}

                    {loadingData && (
                        <div className="text-center py-8 text-stone-400">Загрузка экскурсий...</div>
                    )}
                </div>

                {/* Выбранные экскурсии (если нужно показать отдельно) */}
                {selectedExcursionIds.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-stone-100">
                        <div className="text-stone-500 text-xs mb-2">Выбрано: {selectedExcursionIds.length}</div>
                        <div className="flex flex-wrap gap-2">
                            {selectedExcursionIds.map(id => {
                                const ex = excursions.find(e => e.id === id);
                                return ex ? (
                                    <span
                                        key={id}
                                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs"
                                    >
                                        {ex.title}
                                        <button onClick={() => removeExcursion(id)} className="hover:text-red-500">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ) : null;
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Кнопки */}
            <div className="flex justify-between mt-6">
                <button
                    onClick={onBack}
                    className="px-6 py-2.5 border border-stone-300 rounded-xl hover:bg-stone-50 transition"
                >
                    Назад
                </button>
                <div className="flex gap-3">
                    <button
                        onClick={onSaveAsDraft}
                        disabled={loading}
                        className="px-6 py-2.5 border border-stone-300 rounded-xl hover:bg-stone-50 transition disabled:opacity-50"
                    >
                        Сохранить как черновик
                    </button>
                    <button
                        onClick={onPublish}
                        disabled={loading}
                        className="px-6 py-2.5 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 disabled:opacity-50 transition"
                    >
                        {loading ? 'Публикация...' : 'Опубликовать'}
                    </button>
                </div>
            </div>
        </div>
    );
};