import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Eye, Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import { ImageWithFallback } from '@shared/ui/imgWrapper/ImageWithFallback';
import { SceneTypeBadge } from '@entities/sceneType';
import type { ExcursionResponse } from '@entities/excursion/types/excursion';

interface ExcursionsTableProps {
    excursions: ExcursionResponse[];
    workspaceId: number;
    isOwner: boolean;
    onRefresh: () => void;
}

const statusConfig: Record<string, { label: string; color: string }> = {
    published: { label: 'Опубликовано', color: 'bg-emerald-50 text-emerald-700' },
    draft: { label: 'Черновик', color: 'bg-zinc-100 text-zinc-700' },
    pending: { label: 'На проверке', color: 'bg-amber-50 text-amber-700' },
};

export const ExcursionsTable = ({ excursions, workspaceId, isOwner, onRefresh }: ExcursionsTableProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [formatFilter, setFormatFilter] = useState('all');
    const [sortBy, setSortBy] = useState('updated');

    // Определяем ширину столбцов в px для точного выравнивания
    const columnWidths = {
        preview: 60,
        title: 260,
        scenes: 60,
        formats: 160, // ✅ Немного увеличил для бейджей
        status: 110,
        updated: 110,
        actions: 120,
    };

    const filteredExcursions = excursions
        .filter(ex => {
            if (searchQuery && !ex.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            if (statusFilter !== 'all') {
                if (statusFilter === 'published' && !ex.isPublished) return false;
                if (statusFilter === 'draft' && ex.isPublished) return false;
            }
            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'title') return a.title.localeCompare(b.title);
            if (sortBy === 'updated') return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
            return 0;
        });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <div className="w-full">
            {/* Заголовок и поиск */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-1">
                    <h2 className="text-zinc-900 text-2xl font-bold">Экскурсии</h2>
                    <span className="text-zinc-500 text-xs font-medium pt-1">
                        {filteredExcursions.length} экскурсий найдено
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-64 p-3 bg-white rounded-lg shadow-sm border border-zinc-200 flex items-center justify-between">
                        <input
                            type="text"
                            placeholder="Поиск по экскурсиям"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 outline-none text-sm text-zinc-400 placeholder:text-zinc-400"
                        />
                        <Search className="w-4 h-4 text-zinc-400" />
                    </div>
                    {isOwner && (
                        <Link
                            to={`/create-excursion?workspaceId=${workspaceId}`}
                            className="px-4 py-3 bg-zinc-900 rounded-lg shadow-sm flex items-center gap-1 hover:bg-zinc-800 transition-colors"
                        >
                            <Plus className="w-4 h-4 text-white" />
                            <span className="text-white text-sm font-medium">Создать экскурсию</span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Фильтры */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-white rounded-lg border border-stone-300 text-sm text-zinc-700 outline-none"
                >
                    <option value="all">Все статусы</option>
                    <option value="published">Опубликовано</option>
                    <option value="draft">Черновик</option>
                </select>
                <select
                    value={formatFilter}
                    onChange={(e) => setFormatFilter(e.target.value)}
                    className="px-3 py-2 bg-white rounded-lg border border-stone-300 text-sm text-zinc-700 outline-none"
                >
                    <option value="all">Все форматы</option>
                    <option value="3d">3D-модель</option>
                    <option value="video">Видео</option>
                    <option value="panorama">360° панорама</option>
                    <option value="image">Изображение</option>
                </select>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 bg-white rounded-lg border border-stone-300 text-sm text-zinc-700 outline-none"
                >
                    <option value="updated">Сортировка: по обновлению</option>
                    <option value="title">Сортировка: по названию</option>
                </select>
            </div>

            {/* Таблица (flex-таблица для точного выравнивания) */}
            <div className="w-full overflow-x-auto">
                {/* Заголовки */}
                <div
                    className="px-3.5 py-2.5 bg-neutral-50/80 border-b border-zinc-200 flex items-center"
                    style={{ gap: '16px' }}
                >
                    <div style={{ width: columnWidths.preview }} className="text-zinc-500 text-xs font-semibold uppercase tracking-wide shrink-0">Превью</div>
                    <div style={{ width: columnWidths.title }} className="text-zinc-500 text-xs font-semibold uppercase tracking-wide shrink-0">Название экскурсии</div>
                    <div style={{ width: columnWidths.scenes }} className="text-zinc-500 text-xs font-semibold uppercase tracking-wide shrink-0">Сцен</div>
                    <div style={{ width: columnWidths.formats }} className="text-zinc-500 text-xs font-semibold uppercase tracking-wide shrink-0">Форматы</div>
                    <div style={{ width: columnWidths.status }} className="text-zinc-500 text-xs font-semibold uppercase tracking-wide shrink-0">Статус</div>
                    <div style={{ width: columnWidths.updated }} className="text-zinc-500 text-xs font-semibold uppercase tracking-wide shrink-0">Обновлено</div>
                    <div style={{ width: columnWidths.actions }} className="text-right text-zinc-500 text-xs font-semibold uppercase tracking-wide shrink-0">Действия</div>
                </div>

                {/* Строки */}
                <div className="divide-y divide-zinc-100">
                    {filteredExcursions.map((excursion) => {
                        const status = excursion.isPublished ? 'published' : 'draft';
                        const statusInfo = statusConfig[status];
                        // ✅ Получаем массив типов контента
                        const contentTypes = excursion.contentTypes || [];

                        return (
                            <div
                                key={excursion.id}
                                className="px-3.5 py-3 flex items-center hover:bg-stone-50 transition-colors"
                                style={{ gap: '16px' }}
                            >
                                {/* Превью */}
                                <div style={{ width: columnWidths.preview }} className="shrink-0">
                                    <div className="w-14 h-10 bg-zinc-100 rounded-sm border border-zinc-200/60 overflow-hidden">
                                        <ImageWithFallback
                                            src={excursion.thumbnailUrl || '/placeholder.jpg'}
                                            alt={excursion.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Название */}
                                <div style={{ width: columnWidths.title }} className="shrink-0">
                                    <Link
                                        to={`/excursion/${excursion.id}`}
                                        className="text-zinc-900 text-sm font-medium line-clamp-1 hover:text-zinc-600 hover:underline transition-colors"
                                    >
                                        {excursion.title}
                                    </Link>
                                </div>

                                {/* Количество сцен */}
                                <div style={{ width: columnWidths.scenes }} className="shrink-0">
                                    <span className="text-zinc-600 text-sm">
                                        {excursion.scenes?.length || 0}
                                    </span>
                                </div>

                                {/* ✅ Форматы (используем SceneTypeBadge) */}
                                <div style={{ width: columnWidths.formats }} className="shrink-0">
                                    {contentTypes.length > 0 ? (
                                        <SceneTypeBadge 
                                            type={contentTypes} 
                                            size="sm" 
                                            maxDisplay={2}
                                        />
                                    ) : (
                                        <span className="text-zinc-400 text-xs">—</span>
                                    )}
                                </div>

                                {/* Статус */}
                                <div style={{ width: columnWidths.status }} className="shrink-0">
                                    <span className={`inline-block px-2 py-1 rounded-sm text-xs font-medium ${statusInfo?.color || 'bg-zinc-100 text-zinc-700'}`}>
                                        {statusInfo?.label || status}
                                    </span>
                                </div>

                                {/* Дата обновления */}
                                <div style={{ width: columnWidths.updated }} className="shrink-0">
                                    <span className="text-zinc-500 text-sm">
                                        {formatDate(excursion.updatedAt || excursion.createdAt)}
                                    </span>
                                </div>

                                {/* Действия */}
                                <div style={{ width: columnWidths.actions }} className="shrink-0 flex items-center justify-end gap-1">
                                    {isOwner && (
                                        <>
                                            <Link
                                                to={`/edit-excursion/${excursion.id}?workspaceId=${workspaceId}`}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 transition-colors"
                                                title="Редактировать"
                                            >
                                                <Edit className="w-4 h-4 text-stone-500" />
                                            </Link>
                                            <button
                                                onClick={() => console.log('Delete', excursion.id)}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 transition-colors"
                                                title="Удалить"
                                            >
                                                <Trash2 className="w-4 h-4 text-stone-500" />
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => console.log('More', excursion.id)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 transition-colors"
                                        title="Ещё"
                                    >
                                        <MoreHorizontal className="w-4 h-4 text-stone-500" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Пустое состояние */}
            {filteredExcursions.length === 0 && (
                <div className="py-12 text-center text-stone-400">
                    <p>Нет экскурсий</p>
                    {isOwner && (
                        <Link
                            to={`/create-excursion?workspaceId=${workspaceId}`}
                            className="mt-2 inline-block text-stone-600 text-sm underline"
                        >
                            Создать первую экскурсию
                        </Link>
                    )}
                </div>
            )}

            {/* Пагинация */}
            {filteredExcursions.length > 0 && (
                <div className="mt-4 px-4 py-3 bg-neutral-50 border-t border-zinc-200 flex justify-between items-center">
                    <div className="text-zinc-500 text-xs font-medium">
                        Показано {filteredExcursions.length} из {filteredExcursions.length}
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="px-3 py-1.5 bg-white rounded-sm border border-zinc-200 text-zinc-400 text-xs font-medium hover:bg-stone-50 transition-colors disabled:opacity-50">
                            Назад
                        </button>
                        <button className="w-7 h-7 bg-zinc-900 rounded-sm border border-zinc-900 text-white text-xs font-medium">
                            1
                        </button>
                        <button className="px-3 py-1.5 bg-white rounded-sm border border-zinc-200 text-zinc-400 text-xs font-medium hover:bg-stone-50 transition-colors disabled:opacity-50">
                            Вперед
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};