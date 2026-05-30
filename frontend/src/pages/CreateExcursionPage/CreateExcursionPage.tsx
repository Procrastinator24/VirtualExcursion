import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, GripVertical, X, Save, Eye, Play, Image, Video, Box, Globe, Layers, Settings } from "lucide-react";
import { sceneTypeLabels, sceneTypeColors } from "@entities/sceneType";
import { ImageWithFallback } from "@shared/ui/imgWrapper/ImageWithFallback";
import { useState, useCallback, useEffect } from "react";
import { sceneApi } from "@entities/scene";
import { excursionApi, CreateExcursionRequest } from "@entities/excursion";
import { useAuth } from "@app/Contexts";
import type {Scene} from "../../entities/scene";

const typeIcons: Record<string, React.ReactNode> = {
    vr: <Eye className="w-3.5 h-3.5" />,
    panorama: <Globe className="w-3.5 h-3.5" />,
    video: <Video className="w-3.5 h-3.5" />,
    image: <Image className="w-3.5 h-3.5" />,
    "3d": <Box className="w-3.5 h-3.5" />,
    ThreeD: <Box className="w-3.5 h-3.5" />,
};

export const CreateExcursionPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [tab, setTab] = useState<"scenes" | "metadata" | "preview">("scenes");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [period, setPeriod] = useState("");
    const [museum, setMuseum] = useState("");
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string>("");

    const [availableScenes, setAvailableScenes] = useState<Scene[]>([]);
    const [routeScenes, setRouteScenes] = useState<Scene[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [dragIdx, setDragIdx] = useState<number | null>(null);

    // Загрузка доступных сцен гида
    useEffect(() => {
        const loadScenes = async () => {
            if (!user?.guideProfileId) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const response = await sceneApi.getByGuideId(user.guideProfileId);
                setAvailableScenes(response.data || []);
            } catch (error) {
                console.error('Failed to load scenes:', error);
            } finally {
                setLoading(false);
            }
        };
        loadScenes();
    }, [user]);

    const removeScene = (id: number) => setRouteScenes(routeScenes.filter((s) => s.id !== id));

    const addScene = (scene: Scene) => {
        if (!routeScenes.find((s) => s.id === scene.id)) {
            setRouteScenes([...routeScenes, scene]);
        }
    };

    const handleDragStart = (i: number) => setDragIdx(i);
    const handleDragOver = (e: React.DragEvent, i: number) => {
        e.preventDefault();
        if (dragIdx === null || dragIdx === i) return;
        const items = [...routeScenes];
        const [moved] = items.splice(dragIdx, 1);
        items.splice(i, 0, moved);
        setRouteScenes(items);
        setDragIdx(i);
    };
    const handleDragEnd = () => setDragIdx(null);

    const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverImage(file);
            const preview = URL.createObjectURL(file);
            setCoverPreview(preview);
        }
    };

    const handleSave = async () => {
        if (!title.trim()) {
            alert("Введите название экскурсии");
            return;
        }
        if (routeScenes.length === 0) {
            alert("Добавьте хотя бы одну сцену в маршрут");
            return;
        }

        setSaving(true);
        try {
            // Сначала загружаем обложку (если есть)
            let thumbnailUrl = null;
            if (coverImage) {
                const formData = new FormData();
                formData.append('file', coverImage);
                const uploadResponse = await excursionApi.uploadThumbnail(formData);
                thumbnailUrl = uploadResponse.data.url;
            }

            // Создаём экскурсию
            const request: CreateExcursionRequest = {
                title,
                description: description || undefined,
                thumbnailUrl: thumbnailUrl || undefined,
                duration: `${routeScenes.length} сцен`,
                isPublished: false,
                sceneIds: routeScenes.map(s => s.id),
                tagIds: [],
            };

            await excursionApi.create(request);

            // Перенаправляем на дашборд
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to create excursion:', error);
            alert('Ошибка при создании экскурсии');
        } finally {
            setSaving(false);
        }
    };

    const getContentTypeForScene = (scene: Scene): string => {
        return scene.contentType || '3d';
    };

    if (loading) {
        return (
            <div className="max-w-[1100px] mx-auto px-6 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-stone-200 rounded w-64 mb-8" />
                    <div className="h-64 bg-stone-200 rounded-xl" />
                </div>
            </div>
        );
    }

    if (!user?.guideProfileId) {
        return (
            <div className="max-w-[1100px] mx-auto px-6 py-20 text-center">
                <h2 className="text-xl font-semibold mb-2">Доступ ограничен</h2>
                <p className="text-stone-500">Только верифицированные гиды могут создавать экскурсии</p>
                <Link to="/dashboard" className="mt-4 inline-block text-stone-600 underline">
                    Вернуться в дашборд
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-[1100px] mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Link to="/dashboard" className="text-stone-400 hover:text-stone-600 no-underline">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-stone-900" style={{ fontSize: 26, fontWeight: 600 }}>Создание экскурсии</h1>
                        <p className="text-stone-500" style={{ fontSize: 14 }}>Постройте маршрут через ваши сцены</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setTab("preview")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50"
                        style={{ fontSize: 13, fontWeight: 500 }}
                    >
                        <Eye className="w-4 h-4" /> Предпросмотр
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-50"
                        style={{ fontSize: 13, fontWeight: 500 }}
                    >
                        <Save className="w-4 h-4" /> {saving ? "Сохранение..." : "Сохранить"}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                {([
                    { key: "scenes", label: "Маршрут и сцены", icon: <Layers className="w-4 h-4" /> },
                    { key: "metadata", label: "Метаданные", icon: <Settings className="w-4 h-4" /> },
                    { key: "preview", label: "Предпросмотр", icon: <Play className="w-4 h-4" /> },
                ] as const).map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors ${
                            tab === t.key
                                ? "bg-stone-900 text-white"
                                : "bg-white border border-stone-200 text-stone-600 hover:border-stone-300"
                        }`}
                        style={{ fontSize: 13, fontWeight: 500 }}
                    >
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            {/* Scenes Tab */}
            {tab === "scenes" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Route Editor */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl border border-stone-200/60 p-5">
                            <h2 className="text-stone-900 mb-4" style={{ fontSize: 18, fontWeight: 600 }}>Маршрут экскурсии</h2>
                            <p className="text-stone-500 mb-4" style={{ fontSize: 13 }}>Перетаскивайте сцены для изменения порядка.</p>

                            <div className="space-y-2">
                                {routeScenes.map((scene, i) => {
                                    const contentType = getContentTypeForScene(scene);
                                    return (
                                        <div
                                            key={scene.id}
                                            draggable
                                            onDragStart={() => handleDragStart(i)}
                                            onDragOver={(e) => handleDragOver(e, i)}
                                            onDragEnd={handleDragEnd}
                                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-grab active:cursor-grabbing ${
                                                dragIdx === i ? "border-stone-400 bg-stone-50 shadow-md" : "border-stone-200 hover:border-stone-300 bg-white"
                                            }`}
                                        >
                                            <GripVertical className="w-4 h-4 text-stone-300 shrink-0" />
                                            <span className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 shrink-0" style={{ fontSize: 12, fontWeight: 600 }}>
                                                {i + 1}
                                            </span>
                                            <div className="w-14 h-10 rounded-lg overflow-hidden shrink-0 bg-stone-100">
                                                <ImageWithFallback src={scene.thumbnailUrl || '/placeholder-image.jpg'} alt={scene.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-stone-900 block truncate" style={{ fontSize: 13, fontWeight: 600 }}>{scene.title}</span>
                                            </div>
                                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded ${sceneTypeColors[contentType] || 'bg-stone-100 text-stone-700'}`} style={{ fontSize: 10, fontWeight: 500 }}>
                                                {typeIcons[contentType]} {sceneTypeLabels[contentType] || contentType}
                                            </span>
                                            <button onClick={() => removeScene(scene.id)} className="text-stone-300 hover:text-stone-500 shrink-0">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {routeScenes.length === 0 && (
                                <div className="text-center py-10 text-stone-400">
                                    <Layers className="w-8 h-8 mx-auto mb-2" />
                                    <p style={{ fontSize: 14 }}>Сцены не добавлены. Выберите из доступных экспонатов.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Available Scenes */}
                    <div>
                        <div className="bg-white rounded-xl border border-stone-200/60 p-5 sticky top-24">
                            <h3 className="text-stone-900 mb-3" style={{ fontSize: 14, fontWeight: 600 }}>Доступные сцены</h3>
                            <div className="space-y-2 max-h-[500px] overflow-y-auto">
                                {availableScenes.map((scene) => {
                                    const added = routeScenes.some((s) => s.id === scene.id);
                                    const contentType = getContentTypeForScene(scene);
                                    return (
                                        <button
                                            key={scene.id}
                                            onClick={() => !added && addScene(scene)}
                                            className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${
                                                added ? "opacity-50 cursor-not-allowed bg-stone-50" : "hover:bg-stone-50"
                                            }`}
                                        >
                                            <div className="w-10 h-7 rounded overflow-hidden shrink-0 bg-stone-100">
                                                <ImageWithFallback src={scene.thumbnailUrl || '/placeholder-image.jpg'} alt={scene.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-stone-700 block truncate" style={{ fontSize: 12, fontWeight: 500 }}>{scene.title}</span>
                                                <span className={`${sceneTypeColors[contentType] || 'bg-stone-100 text-stone-700'} px-1.5 py-0.5 rounded`} style={{ fontSize: 9, fontWeight: 500 }}>
                                                    {sceneTypeLabels[contentType] || contentType}
                                                </span>
                                            </div>
                                            {!added && <Plus className="w-4 h-4 text-stone-400" />}
                                        </button>
                                    );
                                })}
                            </div>
                            <Link to="/create-exhibit" className="flex items-center justify-center gap-2 w-full mt-3 py-2.5 rounded-lg border border-dashed border-stone-300 text-stone-500 hover:border-stone-400 hover:text-stone-700 transition-colors no-underline" style={{ fontSize: 12, fontWeight: 500 }}>
                                <Plus className="w-4 h-4" /> Создать новую сцену
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Metadata Tab */}
            {tab === "metadata" && (
                <div className="bg-white rounded-xl border border-stone-200/60 p-6 max-w-2xl">
                    <h2 className="text-stone-900 mb-5" style={{ fontSize: 18, fontWeight: 600 }}>Метаданные экскурсии</h2>
                    <div className="space-y-5">
                        <div>
                            <label className="text-stone-600 block mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>Название</label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Введите название экскурсии..."
                                className="w-full px-4 py-2.5 rounded-lg border border-stone-200 outline-none focus:border-stone-400"
                                style={{ fontSize: 14 }}
                            />
                        </div>
                        <div>
                            <label className="text-stone-600 block mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>Описание</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Опишите экскурсию..."
                                rows={4}
                                className="w-full px-4 py-2.5 rounded-lg border border-stone-200 outline-none focus:border-stone-400 resize-none"
                                style={{ fontSize: 14 }}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-stone-600 block mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>Исторический период</label>
                                <select
                                    value={period}
                                    onChange={(e) => setPeriod(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-lg border border-stone-200 outline-none focus:border-stone-400 bg-white"
                                    style={{ fontSize: 14 }}
                                >
                                    <option value="">Выберите период...</option>
                                    <option>Доисторический</option>
                                    <option>Античность</option>
                                    <option>Средневековье</option>
                                    <option>Ренессанс</option>
                                    <option>Барокко</option>
                                    <option>Современный</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-stone-600 block mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>Музей / Организация</label>
                                <input
                                    value={museum}
                                    onChange={(e) => setMuseum(e.target.value)}
                                    placeholder="Название музея..."
                                    className="w-full px-4 py-2.5 rounded-lg border border-stone-200 outline-none focus:border-stone-400"
                                    style={{ fontSize: 14 }}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-stone-600 block mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>Обложка</label>
                            <label className="border-2 border-dashed border-stone-200 rounded-xl p-8 text-center hover:border-stone-300 cursor-pointer block">
                                <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                                {coverPreview ? (
                                    <img src={coverPreview} alt="Preview" className="max-h-32 mx-auto rounded-lg" />
                                ) : (
                                    <>
                                        <Image className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                                        <p className="text-stone-500" style={{ fontSize: 13 }}>Нажмите для загрузки обложки</p>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Tab */}
            {tab === "preview" && (
                <div className="bg-white rounded-xl border border-stone-200/60 p-6">
                    <h2 className="text-stone-900 mb-5" style={{ fontSize: 18, fontWeight: 600 }}>Предпросмотр экскурсии</h2>
                    <div className="bg-stone-50 rounded-xl p-6">
                        {coverPreview && (
                            <img src={coverPreview} alt="Cover" className="w-full h-48 object-cover rounded-xl mb-6" />
                        )}
                        <h3 className="text-stone-900 mb-2" style={{ fontSize: 22, fontWeight: 600 }}>
                            {title || "Без названия"}
                        </h3>
                        <p className="text-stone-500 mb-4" style={{ fontSize: 14 }}>
                            {description || "Описание отсутствует"}
                        </p>
                        <div className="flex gap-3 text-stone-400 mb-6" style={{ fontSize: 13 }}>
                            {period && <span>{period}</span>}
                            {museum && <span>{museum}</span>}
                            <span>{routeScenes.length} сцен</span>
                        </div>
                        <div className="space-y-3">
                            {routeScenes.map((scene, i) => {
                                const contentType = getContentTypeForScene(scene);
                                return (
                                    <div key={scene.id} className="flex items-center gap-4 p-3 bg-white rounded-xl border border-stone-200">
                                        <span className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 shrink-0" style={{ fontSize: 12, fontWeight: 600 }}>
                                            {i + 1}
                                        </span>
                                        <div className="w-14 h-10 rounded-lg overflow-hidden shrink-0 bg-stone-100">
                                            <ImageWithFallback src={scene.thumbnailUrl || '/placeholder-image.jpg'} alt={scene.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-stone-900" style={{ fontSize: 13, fontWeight: 600 }}>{scene.title}</span>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded ${sceneTypeColors[contentType] || 'bg-stone-100 text-stone-700'}`} style={{ fontSize: 10, fontWeight: 500 }}>
                                            {sceneTypeLabels[contentType] || contentType}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateExcursionPage;