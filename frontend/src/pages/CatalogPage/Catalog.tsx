import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, X, Clock, MapPin, Star, ChevronDown, ChevronUp, Palette, Globe, Tag } from 'lucide-react';
import { excursionApi } from '@entities/excursion/api/excursion.api';
import { workspaceApi, type WorkspaceResponse } from '@entities/workspace';
import { ImageWithFallback } from '@shared/ui/imgWrapper/ImageWithFallback';
import type { ExcursionResponse } from '@entities/excursion/types/excursion';

// Типы для фильтров
type ContentType = 'vr' | 'panorama' | 'video' | '3d' | 'image';
type Period = 'Prehistoric' | 'Ancient' | 'Medieval' | 'Renaissance' | 'Baroque' | 'Gothic';

const contentTypeLabels: Record<ContentType, string> = {
    vr: 'VR',
    panorama: '360°',
    video: 'Video',
    '3d': '3D Модель',
    image: 'Изображение',
};

const contentTypeColors: Record<ContentType, string> = {
    vr: 'bg-purple-100 text-purple-700',
    panorama: 'bg-blue-100 text-blue-700',
    video: 'bg-red-100 text-red-700',
    '3d': 'bg-emerald-100 text-emerald-700',
    image: 'bg-amber-100 text-amber-700',
};

// Опции для фильтров
const directionOptions = [
    { id: 'painting', label: 'Живопись' },
    { id: 'graphics', label: 'Графика' },
    { id: 'sculpture', label: 'Скульптура' },
    { id: 'architecture', label: 'Архитектура' },
    { id: 'photography', label: 'Фотография' },
    { id: 'digital', label: 'Цифровое искусство' },
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

const formatOptions = [
    { id: 'vr', label: 'VR' },
    { id: 'panorama', label: '360°' },
    { id: 'video', label: 'Видео' },
    { id: '3d', label: '3D Модель' },
    { id: 'image', label: 'Изображение' },
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
    { id: 'krasnoyarsk', label: 'Красноярск' },
];

export const CatalogPage: React.FC = () => {
    const navigate = useNavigate();

    const [excursions, setExcursions] = useState<ExcursionResponse[]>([]);
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
    });

    // Состояния фильтров
    const [selectedDirections, setSelectedDirections] = useState<string[]>([]);
    const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<ContentType[]>([]);
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [selectedCities, setSelectedCities] = useState<string[]>([]);

    // Загрузка данных
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            // Загружаем экскурсии
            try {
                const response = await excursionApi.getAll();
                console.log('Loaded excursions:', response.data);
                setExcursions(response.data);
            } catch (error) {
                console.error('Failed to load excursions:', error);
            }

            // Загружаем workspace (опционально, для фильтра по авторам)
            try {
                const workspacesRes = await workspaceApi.getMy();
                setWorkspaces(workspacesRes.data || []);
            } catch (error) {
                console.warn('Failed to load workspaces:', error);
                setWorkspaces([]);
            }

            setIsLoading(false);
        };

        fetchData();
    }, []);

    // Фильтрация экскурсий
    const filteredExcursions = useMemo(() => {
        let result = [...excursions];

        // Поиск по названию и описанию
        if (search.trim()) {
            const query = search.toLowerCase();
            result = result.filter(ex =>
                ex.title.toLowerCase().includes(query) ||
                ex.description?.toLowerCase().includes(query) ||
                ex.tagsNames?.some(tag => tag.toLowerCase().includes(query))
            );
        }

        // Фильтр по направлениям (заглушка)
        if (selectedDirections.length > 0) {
            // TODO: добавить поле direction в Excursion
        }

        // Фильтр по периоду
        if (selectedPeriods.length > 0) {
            result = result.filter(ex =>
                ex.period && selectedPeriods.includes(ex.period.toLowerCase())
            );
        }

        // Фильтр по типу контента
        if (selectedTypes.length > 0) {
            result = result.filter(ex =>
                ex.contentType && selectedTypes.includes(ex.contentType as ContentType)
            );
        }

        // Фильтр по региону (заглушка)
        if (selectedRegions.length > 0) {
            // TODO: добавить поле region в Excursion
        }

        // Фильтр по городу (заглушка)
        if (selectedCities.length > 0) {
            // TODO: добавить поле city в Excursion
        }

        // Сортировка по дате (новые сверху)
        return result.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [excursions, search, selectedDirections, selectedPeriods, selectedTypes, selectedRegions, selectedCities]);

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

    const clearFilters = () => {
        setSearch('');
        setSelectedDirections([]);
        setSelectedPeriods([]);
        setSelectedTypes([]);
        setSelectedRegions([]);
        setSelectedCities([]);
    };

    const getActiveFiltersCount = () => {
        return selectedDirections.length + selectedPeriods.length + selectedTypes.length +
            selectedRegions.length + selectedCities.length;
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.ceil((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'вчера';
        if (diffDays < 7) return `${diffDays} дн. назад`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} нед. назад`;
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
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
                    Каталог экскурсий
                </h1>
                <p className="text-stone-500 mt-1" style={{ fontSize: 15 }}>
                    Исследуйте виртуальные путешествия по истории
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
                                    {formatOptions.map(option => (
                                        <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedTypes.includes(option.id as ContentType)}
                                                onChange={() => toggleType(option.id as ContentType)}
                                                className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-500"
                                            />
                                            <span className="text-stone-600 text-sm">{option.label}</span>
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
                                Найдено: {filteredExcursions.length} {filteredExcursions.length === 1 ? 'экскурсия' : 'экскурсий'}
                            </span>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filteredExcursions.map((excursion) => {
                            const contentType = excursion.contentType as ContentType;

                            return (
                                <div
                                    key={excursion.id}
                                    onClick={() => navigate(`/excursion/${excursion.id}`)}
                                    className="group bg-white rounded-xl overflow-hidden border border-stone-200/60 hover:shadow-lg hover:border-stone-300 transition-all cursor-pointer"
                                >
                                    <div className="relative h-44 overflow-hidden">
                                        <ImageWithFallback
                                            src={excursion.thumbnailUrl || '/placeholder.jpg'}
                                            alt={excursion.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />

                                        {/* Badges */}
                                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                                            {contentType && contentTypeLabels[contentType] && (
                                                <span className={`px-2 py-0.5 rounded-md ${contentTypeColors[contentType]}`}
                                                      style={{ fontSize: 10, fontWeight: 500 }}>
                                                    {contentTypeLabels[contentType]}
                                                </span>
                                            )}
                                            <span
                                                className={`px-2 py-0.5 rounded-md ${excursion.isPublished ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}
                                                style={{ fontSize: 10, fontWeight: 500 }}>
                                                {excursion.isPublished ? 'Опубликовано' : 'Черновик'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <h3 className="text-stone-900 mb-1" style={{ fontSize: 15, fontWeight: 600 }}>
                                            {excursion.title}
                                        </h3>
                                        <p className="text-stone-500 mb-3 line-clamp-2" style={{ fontSize: 13, lineHeight: 1.5 }}>
                                            {excursion.description || 'Без описания'}
                                        </p>

                                        {/* Теги */}
                                        {excursion.tagsNames && excursion.tagsNames.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {excursion.tagsNames.slice(0, 3).map((tag, idx) => (
                                                    <span key={idx} className="text-xs text-stone-400">#{tag}</span>
                                                ))}
                                                {excursion.tagsNames.length > 3 && (
                                                    <span className="text-xs text-stone-400">+{excursion.tagsNames.length - 3}</span>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 text-stone-400" style={{ fontSize: 12 }}>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3"/>
                                                {excursion.guideName || 'Неизвестный гид'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                                            <div className="flex items-center gap-1 text-stone-500" style={{ fontSize: 12 }}>
                                                <Clock className="w-3 h-3"/>
                                                {excursion.duration || '—'}
                                            </div>
                                            <div className="flex items-center gap-1" style={{ fontSize: 12 }}>
                                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400"/>
                                                <span className="text-stone-600">{excursion.viewCount?.toLocaleString() || 0} просмотров</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {filteredExcursions.length === 0 && (
                        <div className="text-center py-20 text-stone-400">
                            <p style={{ fontSize: 16 }}>Ничего не найдено по вашим фильтрам</p>
                            <button onClick={clearFilters} className="mt-3 text-stone-600 underline text-sm">
                                Сбросить фильтры
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CatalogPage;