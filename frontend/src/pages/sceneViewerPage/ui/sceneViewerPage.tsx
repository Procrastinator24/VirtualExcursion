import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    ChevronLeft, ChevronRight, Info, MapPin, Maximize2, Minimize2, X,
    Eye, Globe, Video, Image as ImageIcon, Box, Play
} from 'lucide-react';
import { Engine, Scene as BabylonScene, FlyCamera, Vector3, HemisphericLight, SceneLoader } from '@babylonjs/core';
import '@babylonjs/loaders';
import { sceneApi } from '../../../entities/scene/api/scene.api.ts';
import { excursionApi } from '@entities/excursion/api/excursion.api';
import { ImageWithFallback } from '@shared/ui/imgWrapper/ImageWithFallback';
import { SceneTypeBadge } from '@entities/sceneType';
import type { ExcursionResponse } from '@entities/excursion/types/excursion';
import type { Scene } from '@entities/scene';
import type { PointOfInterest as POIResponse } from '@entities/pointOfInterest/index.ts';

const MEDIA_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5209';

// Константы для типов контента
const typeIcon: Record<string, React.ReactNode> = {
    vr: <Eye className="w-4 h-4" />,
    panorama: <Globe className="w-4 h-4" />,
    video: <Video className="w-4 h-4" />,
    image: <ImageIcon className="w-4 h-4" />,
    '3d': <Box className="w-4 h-4" />,
};

const contentTypeLabels: Record<string, string> = {
    vr: 'VR',
    panorama: '360°',
    video: 'Видео',
    '3d': '3D Модель',
    image: 'Изображение',
};

const contentTypeColors: Record<string, string> = {
    vr: 'bg-purple-100 text-purple-700',
    panorama: 'bg-blue-100 text-blue-700',
    video: 'bg-red-100 text-red-700',
    '3d': 'bg-emerald-100 text-emerald-700',
    image: 'bg-amber-100 text-amber-700',
};

export const SceneViewerPage = () => {
    const params = useParams();
    const { excursionId, sceneId } = params;

    // Определяем режим: есть ли экскурсия
    const isInExcursion = !!excursionId && !!sceneId;
    const actualSceneId = isInExcursion ? parseInt(sceneId) : parseInt(params.sceneId!);

    // Состояния
    const [excursion, setExcursion] = useState<ExcursionResponse | null>(null);
    const [sceneData, setSceneData] = useState<Scene | null>(null);
    const [currentSceneIndex, setCurrentSceneIndex] = useState(-1);
    const [loading, setLoading] = useState(true);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [showInfo, setShowInfo] = useState(true);
    const [fullscreen, setFullscreen] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<Engine | null>(null);
    const sceneRef = useRef<BabylonScene | null>(null);

    // Загрузка данных
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setIsModelLoaded(false);

            try {
                // Используем универсальный метод
                const sceneDataRes = await sceneApi.getSceneById(actualSceneId);
                console.log('Scene data loaded:', sceneDataRes);
                setSceneData(sceneDataRes);

                // Если в контексте экскурсии — загружаем экскурсию
                if (isInExcursion && excursionId) {
                    const excursionRes = await excursionApi.getById(parseInt(excursionId));
                    console.log('Excursion data loaded:', excursionRes.data);
                    setExcursion(excursionRes.data);

                    // Находим индекс текущей сцены в экскурсии
                    const index = excursionRes.data.scenes.findIndex(s => s.sceneId === actualSceneId);
                    setCurrentSceneIndex(index);
                }
            } catch (err) {
                console.error('Failed to load:', err);
            } finally {
                setLoading(false);
            }
        };

        if (actualSceneId && !isNaN(actualSceneId)) {
            fetchData();
        }
    }, [actualSceneId, excursionId, isInExcursion]);

    // Навигация по сценам
    const prevScene = isInExcursion && currentSceneIndex > 0
        ? excursion?.scenes[currentSceneIndex - 1]
        : null;
    const nextScene = isInExcursion && currentSceneIndex < (excursion?.scenes.length || 0) - 1
        ? excursion?.scenes[currentSceneIndex + 1]
        : null;


    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    // Babylon.js загрузка (только для 3D)
    useLayoutEffect(() => {
        // Ждём данные и проверяем, что это 3D
        if (!sceneData || sceneData.contentType !== '3d' || !sceneData.modelUrl) {
            console.log('⏭️ Not a 3D model or missing data');
            return;
        }

        if (!isMounted) {
            console.log('⏳ Waiting for component to mount...');
            return;
        }

        // Проверяем canvas
        const canvas = canvasRef.current;
        if (!canvas) {
            console.error('❌ Canvas ref is null!');
            return;
        }

        console.log('✅ Canvas found, initializing Babylon...');

        // Очищаем предыдущие экземпляры
        if (engineRef.current) {
            engineRef.current.dispose();
            engineRef.current = null;
        }
        if (sceneRef.current) {
            sceneRef.current.dispose();
            sceneRef.current = null;
        }

        const engine = new Engine(canvas, true);
        engineRef.current = engine;
        const scene = new BabylonScene(engine);
        sceneRef.current = scene;

        const camera = new FlyCamera("FlyCamera", new Vector3(0, 5, -10), scene);
        camera.attachControl(true);

        const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
        light.intensity = 0.7;

        const loadModel = async () => {
            try {
                console.log('📦 Loading model from:', sceneData.modelUrl);
                const result = await SceneLoader.ImportMeshAsync("", "", sceneData.modelUrl, scene);
                console.log('✅ Model loaded, meshes:', result.meshes.length);
                setIsModelLoaded(true);

                if (result.meshes.length > 0) {
                    const boundingInfo = result.meshes[0].getBoundingInfo();
                    if (boundingInfo) {
                        camera.setTarget(boundingInfo.boundingBox.center);
                    }
                }
            } catch (err) {
                console.error("❌ Error loading model:", err);
                setIsModelLoaded(false);
            }
        };

        loadModel();

        engine.runRenderLoop(() => scene.render());
        window.addEventListener("resize", () => engine.resize());

        return () => {
            console.log('🧹 Cleaning up Babylon...');
            if (engineRef.current) {
                engineRef.current.dispose();
                engineRef.current = null;
            }
            if (sceneRef.current) {
                sceneRef.current.dispose();
                sceneRef.current = null;
            }
        };
    }, [sceneData, isMounted]);// Зависит от sceneData

    // Очистка при размонтировании компонента
    useEffect(() => {
        return () => {
            console.log('Component unmounting, cleaning up...');
            if (engineRef.current) {
                engineRef.current.dispose();
                engineRef.current = null;
            }
            if (sceneRef.current) {
                sceneRef.current.dispose();
                sceneRef.current = null;
            }
        };
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                <div className="animate-pulse text-stone-500">Загрузка данных...</div>
            </div>
        );
    }

    if (!sceneData) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                <div className="text-stone-500">Сцена не найдена</div>
                <Link to="/catalog" className="ml-4 text-stone-600 underline">Вернуться в каталог</Link>
            </div>
        );
    }

    const is3DModel = sceneData.contentType === '3d' && !!sceneData.modelUrl;
    const contentType = sceneData.contentType || 'image';

    // Рендеринг контента в зависимости от типа
    const renderContent = () => {
        switch (contentType) {
            case '3d':
                return (
                    <>
                        <canvas ref={canvasRef} key={`canvas-${sceneData?.id}-${isInExcursion}`} className="w-full h-full" />
                        {!isModelLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                                <div className="text-white text-lg">Загрузка 3D модели...</div>
                            </div>
                        )}
                    </>
                );

            case 'image':
                return (
                    <ImageWithFallback
                        src={sceneData.imageUrl || sceneData.thumbnailUrl || '/placeholder.jpg'}
                        alt={sceneData.title}
                        className="w-full h-full object-contain"
                    />
                );

            case 'video':
                // Строим полный URL к видео
                const videoUrl = sceneData.videoUrl?.startsWith('http')
                    ? sceneData.videoUrl
                    : `${MEDIA_BASE_URL}${sceneData.videoUrl}`;

                const posterUrl = sceneData.thumbnailUrl?.startsWith('http')
                    ? sceneData.thumbnailUrl
                    : `${MEDIA_BASE_URL}${sceneData.thumbnailUrl}`;

                console.log('🎬 Video full URL:', videoUrl);
                console.log('🎬 Poster URL:', posterUrl);

                return (
                    <div className="relative w-full h-full bg-black flex items-center justify-center">
                        <video
                            key={videoUrl}
                            controls
                            autoPlay
                            className="w-full h-full object-contain"
                            poster={posterUrl}
                            onError={(e) => {
                                const video = e.currentTarget;
                                console.error(' Video error:', {
                                    error: video.error,
                                    code: video.error?.code,
                                    message: video.error?.message,
                                    src: videoUrl
                                });
                            }}
                            onLoadedData={() => console.log(' Video loaded successfully')}
                        >
                            <source src={videoUrl} type="video/mp4" />
                            <source src={videoUrl} type="video/webm" />
                            <p className="text-white">Ваш браузер не поддерживает видео</p>
                        </video>
                    </div>
                );

            case 'panorama':
                // Для панорамы можно использовать специализированные библиотеки (например, Pannellum)
                // Или просто показать изображение как placeholder
                return (
                    <div className="relative w-full h-full">
                        <ImageWithFallback
                            src={sceneData.panoramaUrl || sceneData.thumbnailUrl || '/placeholder.jpg'}
                            alt={sceneData.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="text-white text-center">
                                <Globe className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p className="text-lg">360° панорама</p>
                                <p className="text-sm opacity-75">Для просмотра используйте мышь</p>
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="flex items-center justify-center h-full bg-stone-100">
                        <div className="text-stone-500">Неподдерживаемый тип контента</div>
                    </div>
                );
        }
    };

    return (
        <div className={`flex flex-col ${fullscreen ? "fixed inset-0 z-[100] bg-black" : "h-[calc(100vh-64px)]"}`}>
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-stone-900/95 backdrop-blur text-white shrink-0">
                <div className="flex items-center gap-3">
                    {isInExcursion && excursion ? (
                        <Link to={`/excursion/${excursion.id}`} className="flex items-center gap-1 text-stone-400 hover:text-white no-underline transition-colors" style={{ fontSize: 13 }}>
                            <ChevronLeft className="w-4 h-4" /> Назад к экскурсии
                        </Link>
                    ) : (
                        <Link to="/exhibits" className="flex items-center gap-1 text-stone-400 hover:text-white no-underline transition-colors" style={{ fontSize: 13 }}>
                            <ChevronLeft className="w-4 h-4" /> В каталог
                        </Link>
                    )}
                    <span className="w-px h-5 bg-stone-700" />
                    <span className="text-white" style={{ fontSize: 14, fontWeight: 500 }}>
                        {isInExcursion && excursion ? excursion.title : sceneData.title}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {isInExcursion && excursion && (
                        <span className="text-stone-400 mr-2" style={{ fontSize: 12 }}>
                            Сцена {currentSceneIndex + 1} из {excursion.scenes.length}
                        </span>
                    )}
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md ${contentTypeColors[contentType]}`} style={{ fontSize: 11, fontWeight: 500 }}>
                        {typeIcon[contentType]} {contentTypeLabels[contentType]}
                    </div>
                    <button onClick={() => setShowInfo(!showInfo)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${showInfo ? "bg-white/20 text-white" : "text-stone-400 hover:text-white"}`}>
                        <Info className="w-4 h-4" />
                    </button>
                    <button onClick={() => setFullscreen(!fullscreen)} className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-white transition-colors">
                        {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Main Viewer */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Scene Content */}
                <div className="flex-1 relative bg-black">
                    {renderContent()}

                    {/* Navigation Arrows */}
                    {isInExcursion && (
                        <>
                            <div className="absolute top-1/2 -translate-y-1/2 left-4">
                                {prevScene && (
                                    <Link to={`/scene/${excursion!.id}/${prevScene.sceneId}`} className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors no-underline">
                                        <ChevronLeft className="w-5 h-5" />
                                    </Link>
                                )}
                            </div>
                            <div className="absolute top-1/2 -translate-y-1/2 right-4">
                                {nextScene && (
                                    <Link to={`/scene/${excursion!.id}/${nextScene.sceneId}`} className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors no-underline">
                                        <ChevronRight className="w-5 h-5" />
                                    </Link>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Info Sidebar */}
                {showInfo && (
                    <div className="w-80 bg-white border-l border-stone-200 overflow-y-auto shrink-0 hidden md:block">
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-stone-900" style={{ fontSize: 18, fontWeight: 600 }}>
                                    {sceneData.title}
                                </h3>
                                <button onClick={() => setShowInfo(false)} className="text-stone-400 hover:text-stone-600">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-stone-600 mb-4" style={{ fontSize: 14, lineHeight: 1.7 }}>
                                {sceneData.description || 'Описание отсутствует'}
                            </p>

                            {/* Metadata */}
                            <div className="space-y-2.5 mb-6 py-4 border-y border-stone-100">
                                <div className="flex justify-between" style={{ fontSize: 13 }}>
                                    <span className="text-stone-400">Тип</span>
                                    <span className="text-stone-700" style={{ fontWeight: 500 }}>
                                        {contentTypeLabels[contentType] || '3D'}
                                    </span>
                                </div>
                                {isInExcursion && excursion && (
                                    <div className="flex justify-between" style={{ fontSize: 13 }}>
                                        <span className="text-stone-400">Экскурсия</span>
                                        <span className="text-stone-700" style={{ fontWeight: 500 }}>
                                            {excursion.title}
                                        </span>
                                    </div>
                                )}
                                {sceneData.durationSeconds && (
                                    <div className="flex justify-between" style={{ fontSize: 13 }}>
                                        <span className="text-stone-400">Длительность</span>
                                        <span className="text-stone-700" style={{ fontWeight: 500 }}>
                                            {Math.floor(sceneData.durationSeconds / 60)} мин {sceneData.durationSeconds % 60} сек
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Points of Interest */}
                            <div className="mb-6">
                                <h4 className="text-stone-900 mb-2" style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                                    Точки интереса
                                </h4>
                                {sceneData.pointsOfInterest && sceneData.pointsOfInterest.length > 0 ? (
                                    <div className="space-y-2">
                                        {sceneData.pointsOfInterest.map((poi: POIResponse) => (
                                            <div key={poi.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-50">
                                                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                                                <span className="text-stone-700 text-sm">{poi.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-50">
                                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                                        <span className="text-stone-500 text-sm">Нет точек интереса</span>
                                    </div>
                                )}
                            </div>

                            {/* Scene List */}
                            {isInExcursion && excursion && (
                                <>
                                    <h4 className="text-stone-900 mb-2" style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                                        Все сцены
                                    </h4>
                                    <div className="space-y-1.5">
                                        {excursion.scenes.map((s, i) => {
                                            const isCurrent = s.sceneId === actualSceneId;
                                            return (
                                                <Link
                                                    key={s.sceneId}
                                                    to={`/scene/${excursion.id}/${s.sceneId}`}
                                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg no-underline transition-colors ${isCurrent ? "bg-stone-100" : "hover:bg-stone-50"}`}
                                                >
                                                    <div className="w-10 h-7 rounded overflow-hidden shrink-0 bg-stone-100">
                                                        <ImageWithFallback
                                                            src={s.sceneThumbnailUrl || '/placeholder.jpg'}
                                                            alt={s.sceneTitle}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <span className={`block truncate ${isCurrent ? "text-stone-900" : "text-stone-600"}`} style={{ fontSize: 12, fontWeight: isCurrent ? 600 : 400 }}>
                                                            {s.sceneTitle}
                                                        </span>
                                                    </div>
                                                    <SceneTypeBadge type={s.sceneContentType || 'image'} size="sm" />
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SceneViewerPage;