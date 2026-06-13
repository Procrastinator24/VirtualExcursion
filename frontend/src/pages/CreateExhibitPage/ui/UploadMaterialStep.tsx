import { useState } from 'react';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import type { ExhibitFormData } from '../CreateExhibitPage';
import {sceneApi} from "../../../entities/scene";

export interface PointOfInterest {
    id: string;
    name: string;
    description: string;
    x: number;
    y: number;
    z: number;
    imageUrl?: string;
}

interface UploadMaterialStepProps {
    data: ExhibitFormData;
    onChange: (data: Partial<ExhibitFormData>) => void;
    onNext: () => void;
    onBack: () => void;
}

export const UploadMaterialStep = ({ data, onChange, onNext, onBack }: UploadMaterialStepProps) => {
    const [uploading, setUploading] = useState(false);
    const [editingPoint, setEditingPoint] = useState<PointOfInterest | null>(null);
    const [showPointForm, setShowPointForm] = useState(false);

    // Точки интереса из formData или пустой массив
    const pointsOfInterest: PointOfInterest[] = data.pointsOfInterest || [];

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Проверка типа файла
        const allowedExtensions = ['.glb', '.gltf', '.obj', '.fbx', '.stl'];
        const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
        if (!allowedExtensions.includes(extension)) {
            console.error('Неподдерживаемый формат файла');
            return;
        }

        // Проверка размера (до 500 МБ)
        if (file.size > 500 * 1024 * 1024) {
            console.error('Файл превышает максимальный размер (500 МБ)');
            return;
        }

        setUploading(true);

        try {
            // Загружаем файл на сервер
            const modelUrl = await sceneApi.uploadModel(file);

            // Обновляем formData
            onChange({
                modelUrl,
                modelFormat: extension.replace('.', '').toUpperCase(),
            });

            console.log('Модель загружена:', modelUrl);
        } catch (error) {
            console.error('Ошибка загрузки модели:', error);
        } finally {
            setUploading(false);
        }
    };

    const addPoint = (point: PointOfInterest) => {
        const newPoints = [...pointsOfInterest, point];
        onChange({ pointsOfInterest: newPoints });
    };

    const updatePoint = (id: string, updatedPoint: PointOfInterest) => {
        const newPoints = pointsOfInterest.map(p => p.id === id ? updatedPoint : p);
        onChange({ pointsOfInterest: newPoints });
    };

    const deletePoint = (id: string) => {
        const newPoints = pointsOfInterest.filter(p => p.id !== id);
        onChange({ pointsOfInterest: newPoints });
    };

    const handleSavePoint = (point: PointOfInterest) => {
        if (pointsOfInterest.some(p => p.id === point.id)) {
            updatePoint(point.id, point);
        } else {
            addPoint(point);
        }
        setShowPointForm(false);
        setEditingPoint(null);
    };

    const handleEditPoint = (point: PointOfInterest) => {
        setEditingPoint(point);
        setShowPointForm(true);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Загрузка 3D-модели */}
            <div>
                <h2 className="text-stone-900 text-lg font-semibold mb-2">Загрузка 3D-модели</h2>
                <div className="border-2 border-dashed border-stone-300 rounded-2xl p-8 text-center hover:border-stone-400 transition cursor-pointer">
                    <input
                        type="file"
                        accept=".glb,.gltf,.obj,.fbx,.stl"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="model-upload"
                    />
                    <label htmlFor="model-upload" className="cursor-pointer block">
                        {data.modelUrl ? (
                            <div className="text-green-600">
                                Файл загружен: {data.modelUrl.split('/').pop()}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onChange({ modelUrl: undefined });
                                    }}
                                    className="ml-3 text-red-500 text-sm hover:underline"
                                >
                                    Удалить
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-16 h-16 text-stone-400">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M12 4v16m8-8H4" stroke="currentColor" />
                                    </svg>
                                </div>
                                <div className="text-stone-600 text-base font-medium">
                                    {uploading ? 'Загрузка...' : 'Перетащите или загрузите файл с устройства'}
                                </div>
                                <div className="text-stone-400 text-xs">
                                    Поддерживаются: GLB, GLTF, OBJ, FBX, STL до 500 МБ
                                </div>
                            </div>
                        )}
                    </label>
                </div>
            </div>

            {/* Точки интереса */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-stone-800 font-semibold">Список добавленных точек интереса</h3>
                    <button
                        onClick={() => {
                            setEditingPoint(null);
                            setShowPointForm(true);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 rounded-lg text-stone-700 text-sm hover:bg-stone-200 transition"
                    >
                        <Plus className="w-4 h-4" />
                        Добавить точку
                    </button>
                </div>

                <div className="space-y-3">
                    {pointsOfInterest.map((point) => (
                        <div
                            key={point.id}
                            className="p-3 bg-white rounded-xl border border-stone-200 flex justify-between items-center hover:border-stone-300 transition"
                        >
                            <div>
                                <div className="text-stone-800 font-medium">{point.name}</div>
                                <div className="text-stone-400 text-xs">
                                    X: {point.x}, Y: {point.y}, Z: {point.z}
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handleEditPoint(point)}
                                    className="p-1.5 rounded-lg hover:bg-stone-100 transition"
                                >
                                    <Edit3 className="w-4 h-4 text-stone-500" />
                                </button>
                                <button
                                    onClick={() => deletePoint(point.id)}
                                    className="p-1.5 rounded-lg hover:bg-stone-100 transition"
                                >
                                    <Trash2 className="w-4 h-4 text-stone-500" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {pointsOfInterest.length === 0 && (
                        <div className="text-center py-8 text-stone-400 bg-stone-50 rounded-xl">
                            Нет добавленных точек интереса
                        </div>
                    )}
                </div>
            </div>

            {/* Форма добавления/редактирования точки интереса */}
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

            <div className="flex justify-between mt-4">
                <button
                    onClick={onBack}
                    className="px-6 py-2.5 border border-stone-300 rounded-xl hover:bg-stone-50 transition"
                >
                    Назад
                </button>
                <button
                    onClick={onNext}
                    disabled={!data.modelUrl}
                    className="px-6 py-2.5 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 disabled:opacity-50 transition"
                >
                    Продолжить
                </button>
            </div>
        </div>
    );
};

// Компонент формы для точки интереса
interface PointFormProps {
    initialPoint: PointOfInterest | null;
    onSave: (point: PointOfInterest) => void;
    onCancel: () => void;
}

const PointForm = ({ initialPoint, onSave, onCancel }: PointFormProps) => {
    const [point, setPoint] = useState<PointOfInterest>(
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

    const [uploadingImage, setUploadingImage] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        // TODO: загрузить изображение через API
        const mockUrl = URL.createObjectURL(file);
        setPoint(prev => ({ ...prev, imageUrl: mockUrl }));
        setUploadingImage(false);
    };

    const isValid = point.name.trim() && point.description.trim();

    return (
        <div className="mt-4 p-5 bg-stone-50 rounded-xl border border-stone-200">
            <h4 className="text-stone-800 font-semibold mb-4">
                {initialPoint ? 'Редактировать точку интереса' : 'Новая точка интереса'}
            </h4>

            <div className="space-y-4">
                {/* Координаты */}
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

                {/* Название */}
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

                {/* Описание */}
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

                {/* Фото точки интереса */}
                <div>
                    <label className="text-stone-700 text-sm font-medium">Фото точки интереса (опционально)</label>
                    <div className="mt-1 border-2 border-dashed border-stone-300 rounded-xl p-4 text-center hover:border-stone-400 transition cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
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
                                <div className="text-stone-500">
                                    {uploadingImage ? 'Загрузка...' : 'Загрузить изображение'}
                                </div>
                            )}
                        </label>
                    </div>
                </div>

                {/* Кнопки */}
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