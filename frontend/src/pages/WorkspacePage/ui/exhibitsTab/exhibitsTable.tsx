import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Eye, Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import { ImageWithFallback } from '@shared/ui/imgWrapper/ImageWithFallback';
import type { Scene } from '@entities/scene/types';

interface ExhibitsTableProps {
    exhibits: Scene[];
    workspaceId: number;
    isOwner: boolean;
    onRefresh: () => void;
}

const statusConfig: Record<string, { label: string; color: string }> = {
    published: { label: 'Опубликовано', color: 'bg-emerald-50 text-emerald-700' },
    draft: { label: 'Черновик', color: 'bg-zinc-100 text-zinc-700' },
    pending: { label: 'На проверке', color: 'bg-amber-50 text-amber-700' },
};

const formatConfig: Record<string, { label: string; color: string }> = {
    image: { label: 'Изображения', color: 'bg-amber-50 text-amber-700' },
    '3d': { label: '3D-модель', color: 'bg-indigo-50 text-indigo-700' },
    video: { label: 'Видео', color: 'bg-rose-50 text-rose-700' },
    panorama: { label: '360° панорама', color: 'bg-blue-50 text-blue-700' },
    vr: { label: 'VR-сцена', color: 'bg-purple-50 text-purple-700' },
};

export const ExhibitsTable = ({ exhibits, workspaceId, isOwner, onRefresh }: ExhibitsTableProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [periodFilter, setPeriodFilter] = useState('all');
    const [formatFilter, setFormatFilter] = useState('all');
    const [sortBy, setSortBy] = useState('updated');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Фильтрация
    const filteredExhibits = exhibits
        .filter(ex => {
            if (searchQuery && !ex.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            if (statusFilter !== 'all') {
                if (statusFilter === 'published' && !ex.isPublished) return false;
                if (statusFilter === 'draft' && ex.isPublished) return false;
            }
            // TODO: фильтры по категории, периоду, формату
            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'title') return a.title.localeCompare(b.title);
            if (sortBy === 'updated') return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
            return 0;
        });

    // Пагинация
    const totalPages = Math.ceil(filteredExhibits.length / itemsPerPage);
    const paginatedExhibits = filteredExhibits.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };



    const getFormatsForExhibit = (exhibit: Scene): string[] => {
        if (exhibit.contentType) {
            return [exhibit.contentType];
        }
        return [];
    };

    return (
        <div className="w-full">
            {/* Заголовок и поиск */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-1">
                    <h2 className="text-zinc-900 text-2xl font-bold">Экспонаты</h2>
                    <span className="text-zinc-500 text-xs font-medium pt-1">
                        {filteredExhibits.length} экспонатов найдено
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-64 p-3 bg-white rounded-lg shadow-sm border border-zinc-200 flex items-center justify-between">
                        <input
                            type="text"
                            placeholder="Поиск по экспонатам"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 outline-none text-sm text-zinc-400 placeholder:text-zinc-400"
                        />
                        <Search className="w-4 h-4 text-zinc-400" />
                    </div>
                    {isOwner && (
                        <Link
                            to={`/create-exhibit?workspaceId=${workspaceId}`}
                            className="px-4 py-3 bg-zinc-900 rounded-lg shadow-sm flex items-center gap-1 hover:bg-zinc-800 transition-colors"
                        >
                            <Plus className="w-4 h-4 text-white" />
                            <span className="text-white text-sm font-medium">Добавить экспонат</span>
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
                    <option value="all">Статус</option>
                    <option value="published">Опубликовано</option>
                    <option value="draft">Черновик</option>
                    <option value="pending">На проверке</option>
                </select>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 bg-white rounded-lg border border-stone-300 text-sm text-zinc-700 outline-none"
                >
                    <option value="all">Категория</option>
                    <option value="architecture">Архитектура</option>
                    <option value="painting">Живопись</option>
                    <option value="history">История</option>
                    <option value="ethnography">Этнография</option>
                </select>
                <select
                    value={periodFilter}
                    onChange={(e) => setPeriodFilter(e.target.value)}
                    className="px-3 py-2 bg-white rounded-lg border border-stone-300 text-sm text-zinc-700 outline-none"
                >
                    <option value="all">Период</option>
                    <option value="ancient">Древний мир</option>
                    <option value="medieval">Средневековье</option>
                    <option value="modern">Новое время</option>
                    <option value="contemporary">Современность</option>
                </select>
                <select
                    value={formatFilter}
                    onChange={(e) => setFormatFilter(e.target.value)}
                    className="px-3 py-2 bg-white rounded-lg border border-stone-300 text-sm text-zinc-700 outline-none"
                >
                    <option value="all">Формат</option>
                    <option value="3d">3D-модель</option>
                    <option value="video">Видео</option>
                    <option value="panorama">360° панорама</option>
                    <option value="vr">VR-сцена</option>
                    <option value="image">Изображения</option>
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

            {/* Таблица */}
            <div className="w-full overflow-x-auto">
                <div className="min-w-[1200px]">
                    {/* Заголовки таблицы */}
                    <div className="px-4 py-2.5 bg-neutral-50/80 border-b border-zinc-200 flex items-center gap-4">
                        <div className="w-14 text-zinc-500 text-xs font-semibold uppercase tracking-wide shrink-0">Превью</div>
                        <div className="w-64 text-zinc-500 text-xs font-semibold uppercase tracking-wide shrink-0">Название</div>
                        <div className="w-32 text-zinc-500 text-xs font-semibold uppercase tracking-wide shrink-0">Категория</div>
                        <div className="w-28 text-zinc-500 text-xs font-semibold uppercase tracking-wide shrink-0">Период</div>
                        <div className="w-32 text-zinc-500 text-xs font-semibold uppercase tracking-wide shrink-0">Регион</div>
                        <div className="w-32 text-zinc-500 text-xs font-semibold uppercase tracking-wide shrink-0">Форматы</div>
                        <div className="w-24 text-zinc-500 text-xs font-semibold uppercase tracking-wide shrink-0">Статус</div>
                        <div className="w-28 text-zinc-500 text-xs font-semibold uppercase tracking-wide shrink-0">Обновлено</div>
                        <div className="w-28 text-right text-zinc-500 text-xs font-semibold uppercase tracking-wide shrink-0">Действия</div>
                    </div>

                    {/* Строки таблицы */}
                    <div className="divide-y divide-zinc-100">
                        {paginatedExhibits.map((exhibit, idx) => {
                            const status = exhibit.isPublished ? 'published' : 'draft';
                            const statusInfo = statusConfig[status];
                            const formats = getFormatsForExhibit(exhibit);
                            const globalIndex = (currentPage - 1) * itemsPerPage + idx;

                            return (
                                <div key={exhibit.id} className="px-4 py-3 flex items-center gap-4 hover:bg-stone-50 transition-colors">


                                    {/* Превью */}
                                    <div className="w-14 shrink-0">
                                        <div className="w-14 h-10 bg-zinc-100 rounded-sm border border-zinc-200/60 overflow-hidden">
                                            <ImageWithFallback
                                                src={exhibit.thumbnailUrl || '/placeholder.jpg'}
                                                alt={exhibit.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Название */}
                                    <div className="w-64 shrink-0">
                                        <Link
                                            to={`/scene/${exhibit.id}`}
                                            className="text-zinc-900 text-sm font-medium line-clamp-1 hover:text-zinc-600 hover:underline transition-colors"
                                        >
                                            {exhibit.title}
                                        </Link>
                                    </div>

                                    {/* Категория */}
                                    <div className="w-32 shrink-0">
                                        <span className="text-zinc-600 text-sm">
                                            {exhibit.category || '—'}
                                        </span>
                                    </div>

                                    {/* Период */}
                                    <div className="w-28 shrink-0">
                                        <span className="text-zinc-600 text-sm">
                                            {exhibit.period || '—'}
                                        </span>
                                    </div>

                                    {/* Регион */}
                                    <div className="w-32 shrink-0">
                                        <span className="text-zinc-600 text-sm">
                                            {exhibit.region || '—'}
                                        </span>
                                    </div>

                                    {/* Форматы */}
                                    <div className="w-32 shrink-0">
                                        <div className="flex flex-wrap gap-1">
                                            {formats.length > 0 ? (
                                                formats.map((fmt, idx) => {
                                                    const fmtInfo = formatConfig[fmt];
                                                    return fmtInfo ? (
                                                        <span key={idx} className={`px-1.5 py-0.5 rounded-sm text-[10px] font-medium ${fmtInfo.color}`}>
                                                            {fmtInfo.label}
                                                        </span>
                                                    ) : null;
                                                })
                                            ) : (
                                                <span className="text-zinc-400 text-xs">—</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Статус */}
                                    <div className="w-24 shrink-0">
                                        <span className={`inline-block px-2 py-1 rounded-sm text-xs font-medium text-center ${statusInfo?.color || 'bg-zinc-100 text-zinc-700'}`}>
                                            {statusInfo?.label || status}
                                        </span>
                                    </div>

                                    {/* Дата обновления */}
                                    <div className="w-28 shrink-0">
                                        <span className="text-zinc-500 text-sm">
                                            {formatDate(exhibit.updatedAt || exhibit.createdAt)}
                                        </span>
                                    </div>

                                    {/* Действия */}
                                    <div className="w-28 shrink-0 flex items-center justify-end gap-1">
                                        <Link
                                            to={`/scene/${exhibit.id}`}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 transition-colors"
                                            title="Просмотр"
                                        >
                                            <Eye className="w-4 h-4 text-stone-500" />
                                        </Link>
                                        {isOwner && (
                                            <>
                                                <Link
                                                    to={`/edit-exhibit/${exhibit.id}`}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 transition-colors"
                                                    title="Редактировать"
                                                >
                                                    <Edit className="w-4 h-4 text-stone-500" />
                                                </Link>
                                                <button
                                                    onClick={() => console.log('Delete', exhibit.id)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 transition-colors"
                                                    title="Удалить"
                                                >
                                                    <Trash2 className="w-4 h-4 text-stone-500" />
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => console.log('More', exhibit.id)}
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
            </div>

            {/* Пагинация */}
            {totalPages > 1 && (
                <div className="mt-4 px-4 py-3 bg-neutral-50 border-t border-zinc-200 flex justify-between items-center">
                    <div className="text-zinc-500 text-xs font-medium">
                        Показано {((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, filteredExhibits.length)} из {filteredExhibits.length} экспонатов
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 bg-white rounded-sm border border-zinc-200 text-zinc-400 text-xs font-medium hover:bg-stone-50 transition-colors disabled:opacity-50"
                        >
                            Назад
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            let pageNum = i + 1;
                            if (totalPages > 5 && currentPage > 3) {
                                pageNum = currentPage - 3 + i;
                                if (pageNum > totalPages) return null;
                            }
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`w-7 h-7 rounded-sm border text-xs font-medium transition-colors ${
                                        currentPage === pageNum
                                            ? 'bg-zinc-900 border-zinc-900 text-white'
                                            : 'bg-white border-zinc-200 text-zinc-700 hover:bg-stone-50'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                            <span className="text-zinc-400 text-sm">...</span>
                        )}
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                className="w-7 h-7 rounded-sm border border-zinc-200 bg-white text-zinc-700 text-xs font-medium hover:bg-stone-50"
                            >
                                {totalPages}
                            </button>
                        )}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 bg-white rounded-sm border border-zinc-200 text-zinc-400 text-xs font-medium hover:bg-stone-50 transition-colors disabled:opacity-50"
                        >
                            Вперед
                        </button>
                    </div>
                </div>
            )}

            {/* Пустое состояние */}
            {filteredExhibits.length === 0 && (
                <div className="py-12 text-center text-stone-400">
                    <p>Нет экспонатов</p>
                    {isOwner && (
                        <Link
                            to={`/create-exhibit?workspaceId=${workspaceId}`}
                            className="mt-2 inline-block text-stone-600 text-sm underline"
                        >
                            Добавить первый экспонат
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};