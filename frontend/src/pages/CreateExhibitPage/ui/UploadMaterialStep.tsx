import { useState } from 'react';
import { sceneApi } from '@entities/scene';
import type {ContentType, CreatePointOfInterestRequest} from '../../../entities/scene/types/scene.ts';
import type {CreateSceneRequest} from "../../../entities/scene/types/scene.ts";

interface UploadMaterialStepProps {
    data: CreateSceneRequest;
    onChange: (data: Partial<CreateSceneRequest>) => void;
    onNext: () => void;
    onBack: () => void;
}

// Конфигурация для разных типов контента
const uploadConfig: Record<ContentType, {
    title: string;
    accept: string;
    maxSize: number;
    supportedFormats: string;
    isFileRequired: boolean;
}> = {
    '3d': {
        title: 'Загрузка 3D-модели',
        accept: '.glb,.gltf,.obj,.fbx,.stl',
        maxSize: 500 * 1024 * 1024, // 500 MB
        supportedFormats: 'GLB, GLTF, OBJ, FBX, STL',
        isFileRequired: true,
    },
    image: {
        title: 'Загрузка фото',
        accept: 'image/jpeg,image/png,image/webp',
        maxSize: 50 * 1024 * 1024, // 50 MB
        supportedFormats: 'JPG, PNG, WEBP',
        isFileRequired: true,
    },
    video: {
        title: 'Загрузка видео',
        accept: 'video/mp4,video/webm,video/ogg',
        maxSize: 500 * 1024 * 1024, // 500 MB
        supportedFormats: 'MP4, WEBM, OGG',
        isFileRequired: true,
    },
    panorama: {
        title: 'Загрузка панорамы',
        accept: 'image/jpeg,image/png,image/webp',
        maxSize: 50 * 1024 * 1024, // 50 MB
        supportedFormats: 'JPG, PNG, WEBP',
        isFileRequired: true,
    },
};

export const UploadMaterialStep = ({ data, onChange, onNext, onBack }: UploadMaterialStepProps) => {
    const [uploading, setUploading] = useState(false);
    const contentType = data.contentType || '3d';
    const config = uploadConfig[contentType];

    // Определяем, есть ли уже загруженный файл
    const hasFile = contentType === '3d' ? !!data.modelUrl : !!data.mediaUrl;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Проверка размера
        if (file.size > config.maxSize) {
            alert(`Файл слишком большой. Максимальный размер: ${config.maxSize / (1024 * 1024)} MB`);
            return;
        }

        setUploading(true);

        try {
            let uploadedUrl: string;

            if (contentType === '3d') {
                uploadedUrl = await sceneApi.uploadModel(file);
                onChange({ modelUrl: uploadedUrl, modelFormat: 'glb default' });
            } if (contentType === 'video') {
                uploadedUrl = await sceneApi.uploadVideo(file);
                onChange({ mediaUrl: uploadedUrl });
            }
            else {
                uploadedUrl = await sceneApi.uploadImage(file);
                onChange({ mediaUrl: uploadedUrl });
            }
        } catch (error) {
            console.error('Upload failed:', error);

        } finally {
            setUploading(false);
        }
    };

    const handleRemoveFile = () => {
        if (contentType === '3d') {
            onChange({ modelUrl: undefined });
        } else {
            onChange({ mediaUrl: undefined });
        }
    };

    const fileUrl = contentType === '3d' ? data.modelUrl : data.mediaUrl;

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-stone-900 text-lg font-semibold mb-2">{config.title}</h2>
                <p className="text-stone-500 text-sm mb-4">
                    Вы выбрали тип: <span className="font-medium text-stone-700">
                        {contentType === '3d' && '3D-модель'}
                    {contentType === 'image' && 'Изображение'}
                    {contentType === 'video' && 'Видео'}
                    {contentType === 'panorama' && '360° панорама'}
                    </span>
                </p>

                <div className="mt-4">
                    <div className="border-2 border-dashed border-stone-300 rounded-2xl p-8 text-center hover:border-stone-400 transition cursor-pointer">
                        <input
                            type="file"
                            accept={config.accept}
                            onChange={handleFileUpload}
                            className="hidden"
                            id="material-upload"
                        />
                        <label htmlFor="material-upload" className="cursor-pointer block">
                            {fileUrl ? (
                                <div className="text-green-600">
                                    Файл загружен: {fileUrl.split('/').pop()}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleRemoveFile();
                                        }}
                                        className="ml-3 text-red-500 text-sm hover:underline"
                                    >
                                        Удалить
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
                                        {uploading ? 'Загрузка...' : 'Перетащите или загрузите файл с устройства'}
                                    </div>
                                    <div className="text-stone-400 text-xs">
                                        Поддерживаются: {config.supportedFormats} до {config.maxSize / (1024 * 1024)} МБ
                                    </div>
                                </div>
                            )}
                        </label>
                    </div>
                </div>
            </div>

            {/* Точки интереса (только для 3D-моделей) */}
            {contentType === '3d' && (
                <div className="mt-6">
                    <h3 className="text-stone-800 font-semibold mb-3">Список добавленных точек интереса</h3>
                    <PointsOfInterestList
                        points={data.pointsOfInterest || []}
                        onChange={(points) => onChange({ pointsOfInterest: points })}
                    />
                </div>
            )}

            <div className="flex justify-between mt-4">
                <button
                    onClick={onBack}
                    className="px-6 py-2.5 border border-stone-300 rounded-xl hover:bg-stone-50 transition"
                >
                    Назад
                </button>
                <button
                    onClick={onNext}
                    disabled={config.isFileRequired && !fileUrl}
                    className="px-6 py-2.5 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 disabled:opacity-50 transition"
                >
                    Продолжить
                </button>
            </div>
        </div>
    );
};

// Компонент для точек интереса (вынесен отдельно)
interface PointsOfInterestListProps {
    points: CreatePointOfInterestRequest[];
    onChange: (points: CreatePointOfInterestRequest[]) => void;
}


const PointsOfInterestList = ({ points, onChange }: PointsOfInterestListProps) => {
    const [editingPoint, setEditingPoint] = useState<CreatePointOfInterestRequest | null>(null);
    const [showPointForm, setShowPointForm] = useState(false);

    const addPoint = (point: CreatePointOfInterestRequest) => {
        onChange([...points, point]);
    };

    const updatePoint = (id: string, updatedPoint: CreatePointOfInterestRequest) => {
        onChange(points.map(p => p.id === id ? updatedPoint : p));
    };

    const deletePoint = (id: string) => {
        onChange(points.filter(p => p.id !== id));
    };

    const handleSavePoint = (point: CreatePointOfInterestRequest) => {
        if (points.some(p => p.id === point.id)) {
            updatePoint(point.id, point);
        } else {
            addPoint(point);
        }
        setShowPointForm(false);
        setEditingPoint(null);
    };

    return (
        <div className="space-y-3">
            {points.map((point) => (
                <div
                    key={point.id}
                    className="p-3 bg-white rounded-xl border border-stone-200 flex justify-between items-center hover:border-stone-300 transition"
                >
                    <div>
                        <div className="text-stone-800 font-medium">{point.title}</div>
                        <div className="text-stone-400 text-xs">
                            X: {point.x}, Y: {point.y}, Z: {point.z}
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={() => {
                                setEditingPoint(point);
                                setShowPointForm(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-stone-100 transition"
                        >
                            <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => deletePoint(point.id)}
                            className="p-1.5 rounded-lg hover:bg-stone-100 transition"
                        >
                            <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            ))}

            {points.length === 0 && (
                <div className="text-center py-8 text-stone-400 bg-stone-50 rounded-xl">
                    Нет добавленных точек интереса
                </div>
            )}

            <button
                onClick={() => {
                    setEditingPoint(null);
                    setShowPointForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg text-stone-800 hover:bg-gray-300 transition"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Добавить точку
            </button>

            {showPointForm && (
                <PointForm
                    initialPoint={editingPoint}
                    onSave={handleSavePoint}
                    onCancel={() => {
                        setShowPointForm(false);
                        setEditingPoint(null);
                    }}
                />
            )}
        </div>
    );
};

// Форма для точки интереса
const PointForm = ({ initialPoint, onSave, onCancel }: any) => {
    const [point, setPoint] = useState(
        initialPoint || {
            id: crypto.randomUUID(),
            name: '',
            description: '',
            x: 0,
            y: 0,
            z: 0,
            imageUrl: '',
        }
    );

    const isValid = point.name.trim() && point.description.trim();

    return (
        <div className="mt-4 p-5 bg-stone-50 rounded-xl border border-stone-200">
            <h4 className="text-stone-800 font-semibold mb-4">
                {initialPoint ? 'Редактировать точку интереса' : 'Новая точка интереса'}
            </h4>

            <div className="space-y-4">
                <div>
                    <label className="text-stone-700 text-sm font-medium">Координаты точки интереса</label>
                    <div className="grid grid-cols-3 gap-3 mt-1">
                        <input
                            type="number"
                            value={point.x}
                            onChange={(e) => setPoint(prev => ({ ...prev, x: parseFloat(e.target.value) || 0 }))}
                            placeholder="X"
                            className="px-4 py-2 rounded-xl border border-stone-300 outline-none focus:border-stone-400"
                        />
                        <input
                            type="number"
                            value={point.y}
                            onChange={(e) => setPoint(prev => ({ ...prev, y: parseFloat(e.target.value) || 0 }))}
                            placeholder="Y"
                            className="px-4 py-2 rounded-xl border border-stone-300 outline-none focus:border-stone-400"
                        />
                        <input
                            type="number"
                            value={point.z}
                            onChange={(e) => setPoint(prev => ({ ...prev, z: parseFloat(e.target.value) || 0 }))}
                            placeholder="Z"
                            className="px-4 py-2 rounded-xl border border-stone-300 outline-none focus:border-stone-400"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-stone-700 text-sm font-medium">Название точки интереса</label>
                    <input
                        type="text"
                        value={point.name}
                        onChange={(e) => setPoint(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Введите название"
                        className="w-full mt-1 px-4 py-2 rounded-xl border border-stone-300 outline-none focus:border-stone-400"
                    />
                </div>

                <div>
                    <label className="text-stone-700 text-sm font-medium">Описание точки интереса</label>
                    <textarea
                        value={point.description}
                        onChange={(e) => setPoint(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Введите описание"
                        rows={3}
                        className="w-full mt-1 px-4 py-2 rounded-xl border border-stone-300 outline-none focus:border-stone-400 resize-none"
                    />
                </div>

                <div>
                    <label className="text-stone-700 text-sm font-medium">Фото точки интереса (опционально)</label>
                    <div className="mt-1 border-2 border-dashed border-stone-300 rounded-xl p-4 text-center hover:border-stone-400 transition cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    try {
                                        const url = await sceneApi.uploadImage(file);
                                        setPoint(prev => ({ ...prev, imageUrl: url }));
                                    } catch (error) {
                                        console.error('Failed to upload image:', error);
                                    }
                                }
                            }}
                            className="hidden"
                            id="point-image-upload"
                        />
                        <label htmlFor="point-image-upload" className="cursor-pointer">
                            {point.imageUrl ? (
                                <div className="text-green-600">
                                    Изображение загружено
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setPoint(prev => ({ ...prev, imageUrl: undefined }));
                                        }}
                                        className="ml-3 text-red-500 text-sm hover:underline"
                                    >
                                        Удалить
                                    </button>
                                </div>
                            ) : (
                                <div className="text-stone-500">Загрузить изображение</div>
                            )}
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-100 transition"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={() => onSave(point)}
                        disabled={!isValid}
                        className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 disabled:opacity-50 transition"
                    >
                        {initialPoint ? 'Сохранить' : 'Добавить'}
                    </button>
                </div>
            </div>
        </div>
    );
};