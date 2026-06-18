import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { ExcursionFormData } from '../CreateExcursionPage';
import type { Tag } from '@entities/tags';
import { tagApi } from '@entities/tags'; // ✅ Импортируем API

interface ExcursionDetailsStepProps {
    data: ExcursionFormData;
    onChange: (data: Partial<ExcursionFormData>) => void;
    onSaveAsDraft: () => void;
    onPublish: () => void;
    onBack: () => void;
    loading: boolean;
}

export const ExcursionDetailsStep = ({
    data,
    onChange,
    onSaveAsDraft,
    onPublish,
    onBack,
    loading,
}: ExcursionDetailsStepProps) => {
    const [tagInput, setTagInput] = useState('');
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [tagsLoading, setTagsLoading] = useState(true);

    // ✅ Загружаем теги при монтировании
    useEffect(() => {
        const loadTags = async () => {
            try {
                // TODO: заменить мок на реальный API
                // const tags = await tagApi.getAll();
                // setAvailableTags(tags);
                
                // Временный мок (пока нет API)
                const mockTags: Tag[] = [
                    { id: 1, name: 'Архитектура' },
                    { id: 2, name: 'Живопись' },
                    { id: 3, name: 'Скульптура' },
                    { id: 4, name: 'История' },
                    { id: 5, name: 'Этнография' },
                    { id: 6, name: 'Археология' },
                    { id: 7, name: '19 век' },
                    { id: 8, name: '18 век' },
                    { id: 9, name: 'Средневековье' },
                    { id: 10, name: 'Античность' },
                ];
                setAvailableTags(mockTags);
            } catch (error) {
                console.error('Failed to load tags:', error);
            } finally {
                setTagsLoading(false);
            }
        };

        loadTags();
    }, []);

    const selectedTagIds = data.tags || [];
    const selectedTags = selectedTagIds
        .map(id => availableTags.find(t => t.id === id))
        .filter((t): t is Tag => t !== undefined);

    const addTag = () => {
        const trimmed = tagInput.trim();
        if (!trimmed) return;

        // Ищем существующий тег
        const existingTag = availableTags.find(
            t => t.name.toLowerCase() === trimmed.toLowerCase()
        );

        if (existingTag) {
            if (!selectedTagIds.includes(existingTag.id)) {
                onChange({ tags: [...selectedTagIds, existingTag.id] });
            }
        } else {
            // ✅ Временный тег (будет создан на сервере)
            const newTag: Tag = { id: -Date.now(), name: trimmed };
            onChange({ tags: [...selectedTagIds, newTag.id] });
        }
        setTagInput('');
    };

    const removeTag = (tagId: number) => {
        onChange({ tags: selectedTagIds.filter(id => id !== tagId) });
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    const isTagAvailable = (tag: Tag) => !selectedTagIds.includes(tag.id);

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-stone-900 text-lg font-semibold">Детали экскурсии</h2>
                <p className="text-stone-500 text-sm mt-1">Дополнительная информация для описания экскурсии</p>
            </div>

            <div className="flex flex-col gap-4">
                {/* Направление (период) */}
                <div>
                    <label className="text-black text-sm font-medium">Направление</label>
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
                    <label className="text-black text-sm font-medium">Город</label>
                    <input
                        type="text"
                        value={data.region || ''}
                        onChange={(e) => onChange({ region: e.target.value })}
                        placeholder="Введите город"
                        className="w-full mt-1 px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-stone-400"
                    />
                </div>

                {/* Продолжительность */}
                <div>
                    <label className="text-black text-sm font-medium">Продолжительность</label>
                    <input
                        type="text"
                        value={data.duration || ''}
                        onChange={(e) => onChange({ duration: e.target.value })}
                        placeholder="например: 45 мин, 1.5 часа"
                        className="w-full mt-1 px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-stone-400"
                    />
                </div>

                {/* Теги */}
                <div>
                    <label className="text-black text-sm font-medium">Теги</label>
                    {tagsLoading ? (
                        <div className="mt-1 text-stone-400 text-sm">Загрузка тегов...</div>
                    ) : (
                        <>
                            <div className="mt-1 flex flex-wrap items-center gap-2 p-2 border border-stone-200 rounded-xl focus-within:border-stone-400">
                                {selectedTags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-stone-300 text-stone-600 text-xs"
                                    >
                                        {tag.name}
                                        <button 
                                            onClick={() => removeTag(tag.id)} 
                                            className="hover:text-red-500"
                                            type="button"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagKeyDown}
                                    placeholder="Введите тег"
                                    className="flex-1 min-w-[100px] outline-none text-sm py-1"
                                />
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                                {availableTags
                                    .filter(isTagAvailable)
                                    .slice(0, 6)
                                    .map((tag) => (
                                        <button
                                            key={tag.id}
                                            onClick={() => {
                                                onChange({ 
                                                    tags: [...selectedTagIds, tag.id] 
                                                });
                                            }}
                                            className="px-2 py-1 rounded-lg border border-stone-300 text-stone-500 text-xs hover:bg-stone-50"
                                            type="button"
                                        >
                                            + {tag.name}
                                        </button>
                                    ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="flex justify-between mt-6">
                <button
                    onClick={onBack}
                    className="px-6 py-2.5 border border-stone-300 rounded-xl hover:bg-stone-50 transition"
                    type="button"
                >
                    Назад
                </button>
                <div className="flex gap-3">
                    <button
                        onClick={onSaveAsDraft}
                        disabled={loading}
                        className="px-6 py-2.5 border border-stone-300 rounded-xl hover:bg-stone-50 transition disabled:opacity-50"
                        type="button"
                    >
                        Сохранить как черновик
                    </button>
                    <button
                        onClick={onPublish}
                        disabled={loading}
                        className="px-6 py-2.5 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 disabled:opacity-50 transition"
                        type="button"
                    >
                        {loading ? 'Публикация...' : 'Опубликовать'}
                    </button>
                </div>
            </div>
        </div>
    );
};