import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    MapPin,
    Globe,
    Plus,
    Eye,
    BookOpen,
    Layers,
    FileText,
    Settings,
} from 'lucide-react';
import { workspaceApi, type WorkspaceResponse } from '../../entities/workspace';
import { ImageWithFallback } from '@shared/ui/imgWrapper/ImageWithFallback';
import { useAuth } from '@app/Contexts';
import {ExcursionsTab} from "./ui/excursionTab/excursionTab.tsx";
import {ExhibitsTab} from "./ui/exhibitsTab/exhibitsTab.tsx";
import {WorkspaceSettingsModal} from "./ui/SettingsModal/SettingsModal.tsx";
import {VerificationBadge} from "@shared/ui/VerificationBadge/StatusBadge.tsx";

type TabType = 'overview' | 'excursions' | 'exhibits' | 'members';

export const WorkspacePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [workspace, setWorkspace] = useState<WorkspaceResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [isOwner, setIsOwner] = useState(false);


    const [isSettingsOpen, setIsSettingsOpen] = useState(false);



    useEffect(() => {
        const loadWorkspace = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const response = await workspaceApi.getById(parseInt(id));
                setWorkspace(response.data);
                console.log(workspace)

                // Проверяем, является ли текущий пользователь владельцем
                if (user) {
                    setIsOwner(response.data.ownerId === user.id);
                }
            } catch (error) {
                console.error('Failed to load workspace:', error);
                navigate('/profile');
            } finally {
                setLoading(false);
            }
        };
        loadWorkspace();
    }, [id, user, navigate]);

    const handleWorkspaceUpdate = (updatedWorkspace: WorkspaceResponse) => {
        setWorkspace(updatedWorkspace);
    };

    const tabs = [
        { key: 'overview' as TabType, label: 'Обзор' },
        { key: 'excursions' as TabType, label: 'Экскурсии' },
        { key: 'exhibits' as TabType, label: 'Экспонаты' },
        { key: 'members' as TabType, label: 'Участники' },
    ];

    const handleCreateExcursion = () => {
        console.log('Create excursion for workspace:', workspace?.id);
        navigate(`/create-excursion?workspaceId=${workspace?.id}`);
    };

    const handleCreateExhibit = () => {
        console.log('Create exhibit for workspace:', workspace?.id);
        navigate(`/create-exhibit?workspaceId=${workspace?.id}`);
    };

    const handleSettings = () => {
        setIsSettingsOpen(true)
        console.log('Settings for workspace:', workspace?.id);
    };

    if (loading) {
        return (
            <div className="max-w-[1280px] mx-auto px-20 py-8">
                <div className="animate-pulse">
                    <div className="h-96 bg-stone-200 rounded-xl mb-6" />
                    <div className="h-32 bg-stone-200 rounded-xl mb-6" />
                    <div className="h-64 bg-stone-200 rounded-xl" />
                </div>
            </div>
        );
    }

    if (!workspace) {
        return (
            <div className="max-w-[1280px] mx-auto px-20 py-20 text-center">
                <p className="text-stone-500">Пространство не найдено</p>
                <Link to="/workspaces" className="mt-4 inline-block text-stone-600 underline">
                    Вернуться к пространствам
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full bg-white">
            {/* Hero Image — на всю ширину */}
            <div className="w-full h-64 overflow-hidden">
                <ImageWithFallback
                    src={workspace.bannerUrl || 'https://placehold.co/1920x360'}
                    alt={workspace.name}
                    className="w-full h-52 object-cover"
                />
            </div>

            {/* Profile Header — на всю ширину, с внутренними отступами */}
            <div className="w-full">
                <div className="max-w-[1440px] mx-auto px-8 md:px-12 lg:px-20 -mt-12">
                    <div className="relative pt-6 pb-6">
                        {/* Avatar */}
                        <div className="absolute -top-10 left-0">
                            <ImageWithFallback
                                src={workspace.logoUrl || '/workspace-placeholder.jpg'}
                                alt={workspace.name}
                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                        </div>

                        {/* Контент с отступом под аватарку */}
                        <div className="pl-40">
                            <div className="flex items-start justify-between flex-wrap gap-4">
                                <div className="flex-1 min-w-[280px]">
                                    <div className="flex items-center flex-wrap gap-3 mb-3">
                                        <h1 className="text-black text-3xl font-semibold leading-10">
                                            {workspace.name}
                                        </h1>
                                        <VerificationBadge status={workspace.verificationStatus}/>
                                    </div>
                                    <p className="text-black text-base leading-6 mb-4 max-w-2xl">
                                        {workspace.descriptionLong || workspace.descriptionShort || 'Описание пространства'}
                                    </p>
                                    <div className="flex items-center flex-wrap gap-4">
                                        {workspace.address && (
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-5 h-5 text-black"/>
                                                <span className="text-black text-base font-semibold">
                                        {workspace.address}
                                    </span>
                                            </div>
                                        )}
                                        {workspace.website && (
                                            <div className="flex items-center gap-1">
                                                <Globe className="w-5 h-5 text-black"/>
                                                <a
                                                    href={workspace.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-black text-base font-semibold hover:underline"
                                                >
                                                    {workspace.website.replace(/^https?:\/\//, '')}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Settings Button */}
                                {isOwner && (
                                    <button
                                        onClick={handleSettings}
                                        className="px-5 py-2.5 bg-stone-900 rounded-xl text-white text-base font-medium flex items-center gap-2 hover:bg-stone-800 transition-colors shrink-0 mt-1"
                                    >
                                        <Settings className="w-5 h-5"/>
                                        Настройка
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs и контент — возвращаем в старый контейнер */}
            <div className="max-w-[1280px] mx-auto px-20 pb-10">
                {/* Tabs */}
                <div className="flex items-center gap-3 mb-6 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-2.5 rounded-2xl transition-colors ${
                                activeTab === tab.key
                                    ? 'bg-stone-900 text-white'
                                    : 'text-stone-600 hover:bg-stone-100'
                            }`}
                        >
                            <span className="text-base font-medium">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Statistics */}
                        <div>
                            <h2 className="text-gray-900 text-2xl font-semibold mb-4">Статистика</h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div
                                    className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start">
                                    <div>
                                        <div className="text-gray-900 text-3xl font-semibold">
                                            {workspace.excursionsCount || 0}
                                        </div>
                                        <div className="text-black text-xl font-normal">экскурсий</div>
                                    </div>
                                    <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center">
                                        <BookOpen className="w-5 h-5 text-stone-900"/>
                                    </div>
                                </div>
                                <div
                                    className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start">
                                    <div>
                                        <div className="text-gray-900 text-3xl font-semibold">
                                            {workspace.scenesCount || 0}
                                        </div>
                                        <div className="text-black text-xl font-normal">экспонатов</div>
                                    </div>
                                    <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center">
                                        <Layers className="w-5 h-5 text-stone-900"/>
                                    </div>
                                </div>
                                <div
                                    className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start">
                                    <div>
                                        <div className="text-gray-900 text-3xl font-semibold">
                                            {/* TODO: добавить поле draftsCount в Workspace */}
                                            0
                                        </div>
                                        <div className="text-black text-xl font-normal">черновиков</div>
                                    </div>
                                    <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-stone-900"/>
                                    </div>
                                </div>
                                <div
                                    className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start">
                                    <div>
                                        <div className="text-gray-900 text-3xl font-semibold">
                                            {/* TODO: добавить поле totalViews в Workspace */}
                                            0
                                        </div>
                                        <div className="text-black text-xl font-normal">просмотров</div>
                                    </div>
                                    <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center">
                                        <Eye className="w-5 h-5 text-stone-900"/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div>
                            <h2 className="text-gray-900 text-2xl font-semibold mb-4">Быстрые действия</h2>
                            <div className="flex flex-wrap gap-6">
                                <button
                                    onClick={handleCreateExcursion}
                                    className="w-72 p-5 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 hover:shadow-md transition-shadow"
                                >
                                    <div className="w-9 h-9 bg-stone-900 rounded-xl flex items-center justify-center">
                                        <Plus className="w-5 h-5 text-white"/>
                                    </div>
                                    <div className="text-left">
                                        <div className="text-gray-900 text-base font-semibold">Создать экскурсию</div>
                                        <div className="text-neutral-500 text-xs font-medium">Добавить новую экскурсию
                                        </div>
                                    </div>
                                </button>
                                <button
                                    onClick={handleCreateExhibit}
                                    className="w-72 p-5 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 hover:shadow-md transition-shadow"
                                >
                                    <div className="w-9 h-9 bg-stone-900 rounded-xl flex items-center justify-center">
                                        <Plus className="w-5 h-5 text-white"/>
                                    </div>
                                    <div className="text-left">
                                        <div className="text-gray-900 text-base font-semibold">Добавить экспонат</div>
                                        <div className="text-neutral-500 text-xs font-medium">Загрузить новый экспонат
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Recent Activity Placeholder */}
                        <div className="text-center py-12 text-stone-400">
                            <p>Недавняя активность появится здесь</p>
                        </div>
                    </div>
                )}

                {/* Excursions Tab */}
                {activeTab === 'excursions' && (
                    <ExcursionsTab workspaceId={workspace.id} isOwner={isOwner}/>
                )}

                {/* Exhibits Tab */}
                {activeTab === 'exhibits' && (
                    <ExhibitsTab workspaceId={workspace.id} isOwner={isOwner}/>
                )}

                {/* Members Tab */}
                {activeTab === 'members' && (
                    <div className="py-8">
                        <h2 className="text-gray-900 text-2xl font-semibold mb-6">Участники</h2>
                        {/* TODO: список участников пространства */}
                        <div className="text-center py-20 text-stone-400">
                            <p>Здесь будут отображаться участники этого пространства</p>
                        </div>
                    </div>
                )}
            </div>

            <WorkspaceSettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                workspace={workspace}
                onWorkspaceUpdate={handleWorkspaceUpdate}
            />
        </div>
    );
};

export default WorkspacePage;