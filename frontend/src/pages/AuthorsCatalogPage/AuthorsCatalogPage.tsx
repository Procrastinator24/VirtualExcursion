import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    Filter,
    X,
    ChevronDown,
    ChevronUp,
    BookOpen,
    MapPin,
    Star,
    Users,
    Building,
    Palette,
    Globe,
    Landmark,
    Theater,
    Music,
    Church,
    Castle,
    TreePine,
    Mountain,
    Shield,
    Clock
} from 'lucide-react';
import { workspaceApi } from '@entities/workspace';
import { ImageWithFallback } from '@shared/ui/imgWrapper/ImageWithFallback';
import type { WorkspaceResponse } from '@entities/workspace';
import {WorkspaceCard} from "../../entities/workspace";

// Типы для фильтров
interface FilterSection {
    id: string;
    title: string;
    icon: React.ReactNode;
    options: FilterOption[];
}

interface FilterOption {
    id: string;
    label: string;
    checked: boolean;
}

// Направления (категории)
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

// Регионы
const regionOptions = [
    { id: 'central', label: 'Центральный' },
    { id: 'northwest', label: 'Северо-Западный' },
    { id: 'south', label: 'Южный' },
    { id: 'volga', label: 'Приволжский' },
    { id: 'ural', label: 'Уральский' },
    { id: 'siberia', label: 'Сибирский' },
    { id: 'far-east', label: 'Дальневосточный' },
];

// Города (пример)
const cityOptions = [
    { id: 'moscow', label: 'Москва' },
    { id: 'spb', label: 'Санкт-Петербург' },
    { id: 'kazan', label: 'Казань' },
    { id: 'novosibirsk', label: 'Новосибирск' },
    { id: 'ekaterinburg', label: 'Екатеринбург' },
    { id: 'nizhny', label: 'Нижний Новгород' },
    { id: 'rostov', label: 'Ростов-на-Дону' },
    { id: 'krasnoyarsk', label: 'Красноярск' },
];

export const WorkspacesCatalogPage = () => {
    const [workspaces, setWorkspaces] = useState<WorkspaceResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(true);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        directions: true,
        region: true,
        city: true,
    });

    // Состояния фильтров
    const [selectedDirections, setSelectedDirections] = useState<string[]>([]);
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [selectedCities, setSelectedCities] = useState<string[]>([]);

    // Загрузка данных
    useEffect(() => {
        const fetchWorkspaces = async () => {
            setIsLoading(true);
            try {
                const response = await workspaceApi.getAll();
                setWorkspaces(response.data);
            } catch (error) {
                console.error('Failed to load workspaces:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWorkspaces();
    }, []);

    // Фильтрация
    const filteredWorkspaces = workspaces.filter(workspace => {
        // Поиск по названию и описанию
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesSearch = workspace.name.toLowerCase().includes(query) ||
                workspace.descriptionShort?.toLowerCase().includes(query) ||
                workspace.descriptionLong?.toLowerCase().includes(query);
            if (!matchesSearch) return false;
        }

        // Фильтр по направлениям (пока заглушка, нужно доработать)
        if (selectedDirections.length > 0) {
            // TODO: добавить поле category в Workspace или использовать теги
            // Пока пропускаем
        }

        // Фильтр по региону (заглушка)
        if (selectedRegions.length > 0) {
            // TODO: добавить поле region в Workspace
        }

        // Фильтр по городу
        if (selectedCities.length > 0) {
            if (!workspace.address) return false;
            const matchesCity = selectedCities.some(city =>
                workspace.address?.toLowerCase().includes(city.toLowerCase())
            );
            if (!matchesCity) return false;
        }

        return true;
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const toggleDirection = (directionId: string) => {
        setSelectedDirections(prev =>
            prev.includes(directionId)
                ? prev.filter(id => id !== directionId)
                : [...prev, directionId]
        );
    };

    const toggleRegion = (regionId: string) => {
        setSelectedRegions(prev =>
            prev.includes(regionId)
                ? prev.filter(id => id !== regionId)
                : [...prev, regionId]
        );
    };

    const toggleCity = (cityId: string) => {
        setSelectedCities(prev =>
            prev.includes(cityId)
                ? prev.filter(id => id !== cityId)
                : [...prev, cityId]
        );
    };

    const clearAllFilters = () => {
        setSearchQuery('');
        setSelectedDirections([]);
        setSelectedRegions([]);
        setSelectedCities([]);
    };

    const getActiveFiltersCount = () => {
        return selectedDirections.length + selectedRegions.length + selectedCities.length;
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
                    Музеи
                </h1>
                <p className="text-stone-500 mt-1" style={{ fontSize: 15 }}>
                    Экспонаты прошлого в музейных витринах
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Filters */}
                <aside className={`lg:w-80 shrink-0 transition-all ${showFilters ? 'block' : 'hidden lg:block'}`}>
                    <div className="bg-white rounded-xl border border-stone-200/60 p-5 sticky top-24">
                        {/*<div className="flex items-center justify-between mb-4">*/}
                        {/*    <h3 className="text-stone-900 font-semibold" style={{ fontSize: 16 }}>Фильтры</h3>*/}
                        {/*    <button*/}
                        {/*        onClick={() => setShowFilters(!showFilters)}*/}
                        {/*        className="lg:hidden text-stone-400 hover:text-stone-600"*/}
                        {/*    >*/}
                        {/*        <X className="w-5 h-5" />*/}
                        {/*    </button>*/}
                        {/*</div>*/}

                        {/* Search in filters */}
                        <div className="mb-5">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Поиск по названию..."
                                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 focus:border-stone-400 outline-none text-sm"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
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
                        {(getActiveFiltersCount() > 0 || searchQuery) && (
                            <button
                                onClick={clearAllFilters}
                                className="w-full mt-4 py-2 text-stone-500 text-sm hover:text-stone-900 transition-colors"
                            >
                                Сбросить все фильтры
                            </button>
                        )}
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Search Bar on desktop */}
                    <div className="mb-5">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"/>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Поиск по названию или описанию..."
                                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 focus:border-stone-400 outline-none transition text-sm"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    <X className="w-4 h-4 text-stone-400 hover:text-stone-600"/>
                                </button>
                            )}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                            {/*<span className="text-stone-500 text-sm">*/}
                            {/*    Найдено: {filteredWorkspaces.length} {filteredWorkspaces.length === 1 ? 'пространство' : 'пространств'}*/}
                            {/*</span>*/}
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filteredWorkspaces.map((workspace) => (
                            <WorkspaceCard
                                key={workspace.id}
                                linkTo={`/author/${workspace.id}`}
                                workspace={workspace}
                                showStats={true}
                            />
                        ))}
                    </div>

                    {filteredWorkspaces.length === 0 && (
                        <div className="text-center py-20 text-stone-400">
                            <p style={{fontSize: 16}}>Ничего не найдено по вашим фильтрам</p>
                            <button onClick={clearAllFilters} className="mt-3 text-stone-600 underline text-sm">
                                Сбросить фильтры
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkspacesCatalogPage;