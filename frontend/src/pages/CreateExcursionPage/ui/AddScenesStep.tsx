import { useEffect, useState } from 'react';
import { GripVertical, X, Plus } from 'lucide-react';
import { sceneApi, Scene } from '../../../entities/scene';
import { ImageWithFallback } from '@shared/ui/imgWrapper/ImageWithFallback';
import type { ExcursionFormData } from '../CreateExcursionPage';

interface AddScenesStepProps {
    selectedSceneIds: number[];
    sceneOrder: number[];
    onChange: (data: Partial<ExcursionFormData>) => void;
    onNext: () => void;
    onBack: () => void;
}

export const AddScenesStep = ({
                                  selectedSceneIds,
                                  sceneOrder,
                                  onChange,
                                  onNext,
                                  onBack,
                              }: AddScenesStepProps) => {
    const [availableScenes, setAvailableScenes] = useState<Scene[]>([]);
    const [loading, setLoading] = useState(true);
    const [dragIdx, setDragIdx] = useState<number | null>(null);

    useEffect(() => {
        const loadScenes = async () => {
            setLoading(true);
            try {
                const response = await sceneApi.getScenes();
                setAvailableScenes(response);
            } catch (error) {
                console.error('Failed to load scenes:', error);
            } finally {
                setLoading(false);
            }
        };
        loadScenes();
    }, []);

    const orderedScenes = sceneOrder
        .map(id => availableScenes.find(s => s.id === id))
        .filter(Boolean) as Scene[];

    const addScene = (scene: Scene) => {
        if (selectedSceneIds.includes(scene.id)) return;
        const newSelected = [...selectedSceneIds, scene.id];
        const newOrder = [...sceneOrder, scene.id];
        onChange({ sceneIds: newSelected, sceneOrder: newOrder });
    };

    const removeScene = (sceneId: number) => {
        onChange({
            sceneIds: selectedSceneIds.filter(id => id !== sceneId),
            sceneOrder: sceneOrder.filter(id => id !== sceneId),
        });
    };

    const handleDragStart = (i: number) => setDragIdx(i);
    const handleDragOver = (e: React.DragEvent, i: number) => {
        e.preventDefault();
        if (dragIdx === null || dragIdx === i) return;
        const items = [...orderedScenes];
        const [moved] = items.splice(dragIdx, 1);
        items.splice(i, 0, moved);
        onChange({ sceneOrder: items.map(s => s.id) });
        setDragIdx(i);
    };
    const handleDragEnd = () => setDragIdx(null);

    if (loading) {
        return <div className="text-center py-20 text-stone-400">Загрузка экспонатов...</div>;
    }

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Левая колонка — выбранные сцены в порядке */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-stone-200/60 p-5">
                        <h2 className="text-stone-900 text-lg font-semibold mb-4">Маршрут экскурсии</h2>
                        {orderedScenes.length === 0 ? (
                            <div className="text-center py-8 text-stone-400">
                                <p>Выберите экспонаты справа</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {orderedScenes.map((scene, i) => (
                                    <div
                                        key={scene.id}
                                        draggable
                                        onDragStart={() => handleDragStart(i)}
                                        onDragOver={(e) => handleDragOver(e, i)}
                                        onDragEnd={handleDragEnd}
                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                            dragIdx === i ? 'border-stone-400 bg-stone-50 shadow-md' : 'border-stone-200'
                                        }`}
                                    >
                                        <GripVertical className="w-4 h-4 text-stone-300 cursor-grab" />
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                                            <ImageWithFallback
                                                src={scene.thumbnailUrl || '/placeholder.jpg'}
                                                alt={scene.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-stone-900 font-medium">{scene.title}</span>
                                        </div>
                                        <button
                                            onClick={() => removeScene(scene.id)}
                                            className="text-stone-400 hover:text-red-500"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Правая колонка — доступные экспонаты */}
                <div>
                    <div className="bg-white rounded-xl border border-stone-200/60 p-5">
                        <h3 className="text-stone-900 font-semibold mb-3">Доступные экспонаты</h3>
                        <div className="space-y-2 max-h-[500px] overflow-y-auto">
                            {availableScenes.map((scene) => {
                                const isAdded = selectedSceneIds.includes(scene.id);
                                return (
                                    <button
                                        key={scene.id}
                                        onClick={() => !isAdded && addScene(scene)}
                                        className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${
                                            isAdded ? 'opacity-50 cursor-not-allowed' : 'hover:bg-stone-50'
                                        }`}
                                    >
                                        <div className="w-10 h-10 rounded overflow-hidden bg-stone-100 shrink-0">
                                            <ImageWithFallback
                                                src={scene.thumbnailUrl || '/placeholder.jpg'}
                                                alt={scene.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 truncate">
                                            <span className="text-stone-700 text-sm">{scene.title}</span>
                                        </div>
                                        {!isAdded && <Plus className="w-4 h-4 text-stone-400" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between mt-8">
                <button
                    onClick={onBack}
                    className="px-6 py-2.5 border border-stone-300 rounded-xl hover:bg-stone-50 transition"
                >
                    Назад
                </button>
                <button
                    onClick={onNext}
                    disabled={orderedScenes.length === 0}
                    className="px-6 py-2.5 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 disabled:opacity-50 transition"
                >
                    Продолжить
                </button>
            </div>
        </div>
    );
};