import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp, Palette, Clock, Tag, Globe, MapPin, User } from 'lucide-react';
import { sceneApi } from '../../entities/scene';
import { SceneCard } from '../../entities/scene';
import type { Scene } from '../../entities/scene';
import { workspaceApi, type WorkspaceResponse } from '@entities/workspace';

// Типы для фильтров
type ContentType = 'vr' | 'panorama' | 'video' | '3d' | 'image';

const contentTypeLabels: Record<ContentType, string> = {
    vr: 'VR',
    panorama: '360°',
    video: 'Видео',
    '3d': '3D Модель',
    image: 'Изображение',
};

// Опции для фильтров
const directionOptions = [
    { id: 'painting', label: 'Живопись' },
    { id: 'graphics', label: 'Графика' },
    { id: 'sculpture', label: 'Скульптура' },
    { id: 'architecture', label: 'Архитектура' },
    { id: 'photography', label: 'Фотография' },
    { id: 'digital', label: 'Цифровое искусство' },
    { id: 'decorative', label: 'Декоративно-прикладное' },
    { id: 'historical', label: 'Историческое наследие' },
];

const periodOptions = [
    { id: 'prehistoric', label: 'Доисторический' },
    { id: 'ancient', label: 'Античность' },
    { id: 'medieval', label: 'Средневековье' },
    { id: 'renaissance', label: 'Ренессанс' },
    { id: 'baroque', label: 'Барокко' },
    { id: 'modern', label: 'Новое время' },
    { id: 'contemporary', label: 'Современность' },
];

const regionOptions = [
    { id: 'central', label: 'Центральный' },
    { id: 'northwest', label: 'Северо-Западный' },
    { id: 'south', label: 'Южный' },
    { id: 'volga', label: 'Приволжский' },
    { id: 'ural', label: 'Уральский' },
    { id: 'siberia', label: 'Сибирский' },
    { id: 'far-east', label: 'Дальневосточный' },
];

const cityOptions = [
    { id: 'moscow', label: 'Москва' },
    { id: 'spb', label: 'Санкт-Петербург' },
    { id: 'kazan', label: 'Казань' },
    { id: 'novosibirsk', label: 'Новосибирск' },
    { id: 'ekaterinburg', label: 'Екатеринбург' },
    { id: 'nizhny', label: 'Нижний Новгород' },
    { id: 'krasnoyarsk', label: 'Красноярск' },
    { id: 'rostov', label: 'Ростов-на-Дону' },
];

export const ExhibitsCatalogPage: React.FC = () => {
    const [scenes, setScenes] = useState<Scene[]>([]);
    const [workspaces, setWorkspaces] = useState<WorkspaceResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showFilters, setShowFilters] = useState(true);

    // Состояния раскрытых секций
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        directions: true,
        period: true,
        formats: true,
        region: true,
        city: true,
        authors: true,
    });

    // Состояния фильтров
    const [selectedDirections, setSelectedDirections] = useState<string[]>([]);
    const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<ContentType[]>([]);
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [selectedCities, setSelectedCities] = useState<string[]>([]);
    const [selectedAuthors, setSelectedAuthors] = useState<number[]>([]);

    // Загрузка данных
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // const [scenesRes, workspacesRes] = await Promise.all([
                //     sceneApi.getScenes(),
                //     workspaceApi.getMy(),
                // ]);
                const scenesRes = await sceneApi.getScenes()

                setScenes(scenesRes);
                console.log(scenes)
                //setWorkspaces(workspacesRes.data);
            } catch (error) {
                console.error('Failed to load data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Фильтрация сцен
    const filteredScenes = useMemo(() => {
        console.log(scenes)
        let result = [...scenes];

        // Поиск по названию и описанию
        if (search.trim()) {
            const query = search.toLowerCase();
            result = result.filter(scene =>
                scene.title.toLowerCase().includes(query) ||
                scene.description?.toLowerCase().includes(query)
            );
        }

        // Фильтр по направлениям (заглушка, нужно добавить поле в Scene)
        if (selectedDirections.length > 0) {
            // TODO: добавить поле direction в Scene
        }

        // Фильтр по периоду
        // if (selectedPeriods.length > 0) {
        //     result = result.filter(scene =>
        //         scene.period && selectedPeriods.includes(scene.period.toLowerCase())
        //     );
        // }

        // Фильтр по типу контента
        if (selectedTypes.length > 0) {
            result = result.filter(scene =>
                scene.contentType && selectedTypes.includes(scene.contentType as ContentType)
            );
        }

        // Фильтр по региону (заглушка)
        if (selectedRegions.length > 0) {
            // TODO: добавить поле region в Scene
        }

        // Фильтр по городу (заглушка)
        if (selectedCities.length > 0) {
            // TODO: добавить поле city в Scene
        }

        // Фильтр по авторам/пространствам
        // if (selectedAuthors.length > 0) {
        //     result = result.filter(scene =>
        //         scene.workspaceId && selectedAuthors.includes(scene.workspaceId)
        //     );
        // }

        // Сортировка по дате (новые сверху)
        return result.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [scenes, search, selectedDirections, selectedPeriods, selectedTypes, selectedRegions, selectedCities, selectedAuthors]);

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const toggleDirection = (id: string) => {
        setSelectedDirections(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const togglePeriod = (id: string) => {
        setSelectedPeriods(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleType = (type: ContentType) => {
        setSelectedTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const toggleRegion = (id: string) => {
        setSelectedRegions(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleCity = (id: string) => {
        setSelectedCities(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    // const toggleAuthor = (id: number) => {
    //     setSelectedAuthors(prev =>
    //         prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    //     );
    // };

    const clearFilters = () => {
        setSearch('');
        setSelectedDirections([]);
        setSelectedPeriods([]);
        setSelectedTypes([]);
        setSelectedRegions([]);
        setSelectedCities([]);
        setSelectedAuthors([]);
    };

    const getActiveFiltersCount = () => {
        return selectedDirections.length + selectedPeriods.length + selectedTypes.length +
            selectedRegions.length + selectedCities.length + selectedAuthors.length;
    };

    if (isLoading) {
        return (
            <div className="max-w-[1320px] mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border border-stone-200/60 overflow-hidden animate-pulse">
                            <div className="h-44 bg-stone-200" />
                            <div className="p-4 space-y-3">
                                <div className="h-5 bg-stone-200 rounded w-3/4" />
                                <div className="h-4 bg-stone-200 rounded w-full" />
                                <div className="h-4 bg-stone-200 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1320px] mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-stone-900" style={{ fontSize: 30, fontWeight: 600 }}>
                    Каталог экспонатов
                </h1>
                <p className="text-stone-500 mt-1" style={{ fontSize: 15 }}>
                    Исследуйте 3D-модели, панорамы, видео и VR-экспонаты
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Filters */}
                <aside className={`lg:w-80 shrink-0 transition-all ${showFilters ? 'block' : 'hidden lg:block'}`}>
                    <div className="bg-white rounded-xl border border-stone-200/60 p-5 sticky top-24">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-stone-900 font-semibold" style={{ fontSize: 16 }}>Фильтры</h3>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="lg:hidden text-stone-400 hover:text-stone-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Search in filters */}
                        <div className="mb-5">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Поиск по названию..."
                                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 focus:border-stone-400 outline-none text-sm"
                                />
                                {search && (
                                    <button
                                        onClick={() => setSearch('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                    >
                                        <X className="w-4 h-4 text-stone-400" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Directions Filter */}
                        <div className="mb-4 border-b border-stone-100 pb-4">
                            <button
                                onClick={() => toggleSection('directions')}
                                className="w-full flex items-center justify-between py-2 text-stone-900 font-medium"
                                style={{ fontSize: 14 }}
                            >
                                <div className="flex items-center gap-2">
                                    <Palette className="w-4 h-4 text-stone-500" />
                                    <span>Направления</span>
                                </div>
                                {expandedSections.directions ? (
                                    <ChevronUp className="w-4 h-4 text-stone-400" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-stone-400" />
                                )}
                            </button>
                            {expandedSections.directions && (
                                <div className="mt-2 space-y-2">
                                    {directionOptions.map(option => (
                                        <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedDirections.includes(option.id)}
                                                onChange={() => toggleDirection(option.id)}
                                                className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-500"
                                            />
                                            <span className="text-stone-600 text-sm">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Period Filter */}
                        <div className="mb-4 border-b border-stone-100 pb-4">
                            <button
                                onClick={() => toggleSection('period')}
                                className="w-full flex items-center justify-between py-2 text-stone-900 font-medium"
                                style={{ fontSize: 14 }}
                            >
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-stone-500" />
                                    <span>Период</span>
                                </div>
                                {expandedSections.period ? (
                                    <ChevronUp className="w-4 h-4 text-stone-400" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-stone-400" />
                                )}
                            </button>
                            {expandedSections.period && (
                                <div className="mt-2 space-y-2">
                                    {periodOptions.map(option => (
                                        <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedPeriods.includes(option.id)}
                                                onChange={() => togglePeriod(option.id)}
                                                className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-500"
                                            />
                                            <span className="text-stone-600 text-sm">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Formats Filter */}
                        <div className="mb-4 border-b border-stone-100 pb-4">
                            <button
                                onClick={() => toggleSection('formats')}
                                className="w-full flex items-center justify-between py-2 text-stone-900 font-medium"
                                style={{ fontSize: 14 }}
                            >
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-stone-500" />
                                    <span>Форматы</span>
                                </div>
                                {expandedSections.formats ? (
                                    <ChevronUp className="w-4 h-4 text-stone-400" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-stone-400" />
                                )}
                            </button>
                            {expandedSections.formats && (
                                <div className="mt-2 space-y-2">
                                    {Object.entries(contentTypeLabels).map(([type, label]) => (
                                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedTypes.includes(type as ContentType)}
                                                onChange={() => toggleType(type as ContentType)}
                                                className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-500"
                                            />
                                            <span className="text-stone-600 text-sm">{label}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Region Filter */}
                        <div className="mb-4 border-b border-stone-100 pb-4">
                            <button
                                onClick={() => toggleSection('region')}
                                className="w-full flex items-center justify-between py-2 text-stone-900 font-medium"
                                style={{ fontSize: 14 }}
                            >
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-stone-500" />
                                    <span>Регион</span>
                                </div>
                                {expandedSections.region ? (
                                    <ChevronUp className="w-4 h-4 text-stone-400" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-stone-400" />
                                )}
                            </button>
                            {expandedSections.region && (
                                <div className="mt-2 space-y-2">
                                    {regionOptions.map(option => (
                                        <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedRegions.includes(option.id)}
                                                onChange={() => toggleRegion(option.id)}
                                                className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-500"
                                            />
                                            <span className="text-stone-600 text-sm">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* City Filter */}
                        <div className="mb-4 border-b border-stone-100 pb-4">
                            <button
                                onClick={() => toggleSection('city')}
                                className="w-full flex items-center justify-between py-2 text-stone-900 font-medium"
                                style={{ fontSize: 14 }}
                            >
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-stone-500" />
                                    <span>Город</span>
                                </div>
                                {expandedSections.city ? (
                                    <ChevronUp className="w-4 h-4 text-stone-400" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-stone-400" />
                                )}
                            </button>
                            {expandedSections.city && (
                                <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                                    {cityOptions.map(option => (
                                        <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedCities.includes(option.id)}
                                                onChange={() => toggleCity(option.id)}
                                                className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-500"
                                            />
                                            <span className="text-stone-600 text-sm">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Authors Filter */}
                        {workspaces.length > 0 && (
                            <div className="mb-4 border-b border-stone-100 pb-4">
                                <button
                                    onClick={() => toggleSection('authors')}
                                    className="w-full flex items-center justify-between py-2 text-stone-900 font-medium"
                                    style={{ fontSize: 14 }}
                                >
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-stone-500" />
                                        <span>Авторы и музеи</span>
                                    </div>
                                    {expandedSections.authors ? (
                                        <ChevronUp className="w-4 h-4 text-stone-400" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-stone-400" />
                                    )}
                                </button>
                                {/*{expandedSections.authors && (*/}
                                {/*    <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">*/}
                                {/*        {workspaces.map(workspace => (*/}
                                {/*            <label key={workspace.id} className="flex items-center gap-2 cursor-pointer">*/}
                                {/*                <input*/}
                                {/*                    type="checkbox"*/}
                                {/*                    checked={selectedAuthors.includes(workspace.id)}*/}
                                {/*                    onChange={() => toggleAuthor(workspace.id)}*/}
                                {/*                    className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-500"*/}
                                {/*                />*/}
                                {/*                <span className="text-stone-600 text-sm truncate">{workspace.name}</span>*/}
                                {/*            </label>*/}
                                {/*        ))}*/}
                                {/*    </div>*/}
                                {/*)}*/}
                            </div>
                        )}

                        {/* Clear Filters */}
                        {(getActiveFiltersCount() > 0 || search) && (
                            <button
                                onClick={clearFilters}
                                className="w-full mt-4 py-2 text-stone-500 text-sm hover:text-stone-900 transition-colors"
                            >
                                Сбросить все фильтры
                            </button>
                        )}
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Search Bar */}
                    <div className="mb-5">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Поиск по названию или описанию..."
                                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 focus:border-stone-400 outline-none transition text-sm"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    <X className="w-4 h-4 text-stone-400 hover:text-stone-600" />
                                </button>
                            )}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                            <span className="text-stone-500 text-sm">
                                Найдено: {filteredScenes.length} {filteredScenes.length === 1 ? 'экспонат' : 'экспонатов'}
                            </span>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filteredScenes.map((scene) => (
                            <SceneCard
                                // key={scene.id}
                                id={scene.id}
                                title={scene.title}
                                description={scene.description}
                                thumbnailUrl={scene.thumbnailUrl}
                                contentType={scene.contentType}
                                isPublished={scene.isPublished}
                                viewCount={scene.viewCount}
                                createdAt={scene.createdAt}
                            />
                        ))}
                    </div>

                    {/*{scenes.length === 0 && (*/}
                    {/*    <div className="text-center py-20 text-stone-400">*/}
                    {/*        <p style={{ fontSize: 16 }}>Ничего не найдено по вашим фильтрам</p>*/}
                    {/*        <button onClick={clearFilters} className="mt-3 text-stone-600 underline text-sm">*/}
                    {/*            Сбросить фильтры*/}
                    {/*        </button>*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </div>
            </div>
        </div>
    );
};

export default ExhibitsCatalogPage;