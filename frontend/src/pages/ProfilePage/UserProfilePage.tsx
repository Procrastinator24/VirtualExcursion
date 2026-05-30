import { Link } from "react-router-dom";
import { Star, BookOpen, Heart, Bookmark, Settings, Camera, Clock, Layers } from "lucide-react";
import { ImageWithFallback } from "@shared/ui/imgWrapper/ImageWithFallback";
import { useEffect, useState } from "react";
import { useAuth } from "@app/Contexts";
import { useFavourites } from "@app/Contexts";
import { ExcursionCard } from "@entities/excursion";
import type {WorkspaceResponse} from "../../entities/workspace";
import {workspaceApi} from "../../entities/workspace";
import {CreateWorkspaceButton} from "./ui/CreateWorkspaceButton.tsx";
import {WorkspaceCard} from "./ui/WorkspaceCard.tsx";

type TabType = "saved" | "favorites" | "created" | "exhibits" | "settings";

export const UserProfilePage = () => {
    const { user } = useAuth();
    const { favourites, toggleFavourite } = useFavourites();

    const [tab, setTab] = useState<TabType>("saved");
    const [workspaces, setWorkspaces] = useState<WorkspaceResponse[]>([]);
    const [loading, setLoading] = useState(true);

    // Загрузка созданных экскурсий (если пользователь — гид)
    useEffect(() => {
        const loadWorkspaces = async () => {

            try {
                const response = await workspaceApi.getMy();
                setWorkspaces(response.data);
                console.log(workspaces)
            } catch (error) {
                console.error('Failed to load created excursions:', error);
            } finally {
                setLoading(false);
            }
        };
        loadWorkspaces();
    }, [user]);


    const favoriteExcursions = favourites; // то же самое

    // Сцены из созданных экскурсий для вкладки "Exhibits"


    // Статистика
    const stats = {
        favoritesCount: favoriteExcursions.length,

    };

    if (!user) {
        return (
            <div className="max-w-[1320px] mx-auto px-6 py-20 text-center">
                <p className="text-stone-500">Необходимо войти в систему</p>
                <Link to="/login" className="mt-4 inline-block text-stone-600 underline">
                    Войти
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-[1320px] mx-auto px-6 py-8">
            {/* Header */}
            <div className="bg-white rounded-xl border border-stone-200/60 p-6 md:p-8 mb-8">
                <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="relative">
                        <ImageWithFallback
                            src={user.avatarUrl || '/placeholder-avatar.jpg'}
                            alt={user.name}
                            className="w-24 h-24 rounded-full object-cover"
                        />
                        <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center border-2 border-white">
                            <Camera className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <div className="flex-1">
                        <h1 className="text-stone-900" style={{ fontSize: 26, fontWeight: 600 }}>
                            {user.userName}
                        </h1>
                        <span className="text-stone-500" style={{ fontSize: 14 }}>
                            {user.email}
                        </span>
                        <div className="flex items-center gap-6 mt-4 text-stone-400" style={{ fontSize: 13 }}>
                            <span className="flex items-center gap-1.5">
                                <Heart className="w-4 h-4" /> {stats.favoritesCount} избранное
                            </span>
                            {/*<span className="flex items-center gap-1.5">*/}
                            {/*    <BookOpen className="w-4 h-4" /> {stats.createdCount} создано*/}
                            {/*</span>*/}
                            {/*<span className="flex items-center gap-1.5">*/}
                            {/*    <Layers className="w-4 h-4" /> {stats.exhibitsCount} сцен*/}
                            {/*</span>*/}
                        </div>
                    </div>
                    {user.role === 'Guide' && (
                        <Link
                            to="/dashboard"
                            className="px-5 py-2.5 bg-stone-900 text-white rounded-lg no-underline hover:bg-stone-800 transition-colors"
                            style={{ fontSize: 13, fontWeight: 500 }}
                        >
                            Панель гида
                        </Link>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                {([
                    { key: "favorites", label: "Избранное", icon: <Heart className="w-4 h-4" /> },
                    { key: "workspaces", label: "Пространтсва", icon: <Layers className="w-4 h-4" /> },
                    { key: "settings", label: "Настройки", icon: <Settings className="w-4 h-4" /> },
                ] as const).map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-colors ${
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

            {/* Content */}
            {tab === "favorites" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {favoriteExcursions.map((ex) => (
                        <ExcursionCard
                            key={ex.id}
                            excursion={ex}
                            showFavouriteButton
                            onFavouriteToggle={() => toggleFavourite(ex.id)}
                            isFavourite={true}
                        />
                    ))}
                    {((tab === "favorites" && favoriteExcursions.length === 0)) && (
                        <div className="col-span-full text-center py-12 text-stone-400">
                            Нет избранных экскурсий
                        </div>
                    )}
                </div>
            )}


            {tab === "workspaces" && (
                <div>
                    {/* Заголовок и кнопка */}
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-stone-900 text-xl font-semibold">
                            Рабочие пространства
                        </h2>

                    </div>

                    {/* Сетка карточек */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {workspaces.map((workspace) => (
                            <WorkspaceCard
                                key={workspace.id}
                                workspace={workspace}
                                onMenuClick={(workspaceId) => {
                                    console.log('Menu clicked for:', workspaceId);
                                }}
                            />
                        ))}
                    </div>

                    {/* Пустое состояние и кнопка */}
                    {workspaces.length === 0 && (
                        <div className="text-center py-12 text-stone-400">
                            <p>У вас пока нет пространств</p>
                            <div className="mt-4 flex justify-center">
                                <CreateWorkspaceButton
                                    onClick={() => {
                                        console.log('Create workspace from empty state');
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="mt-4 flex justify-start">
                        <CreateWorkspaceButton
                            onClick={() => {
                                console.log('Create another workspace');
                            }}
                        />
                    </div>

                </div>
            )}

            {tab === "settings" && (
                <div className="bg-white rounded-xl border border-stone-200/60 p-6 max-w-2xl">
                    <h2 className="text-stone-900 mb-5" style={{ fontSize: 20, fontWeight: 600 }}>
                        Настройки профиля
                    </h2>
                    <div className="space-y-5">
                        {[
                            { label: "Имя", name: "name", value: user.name },
                            { label: "Email", name: "email", value: user.email },
                            { label: "О себе", name: "bio", value: user.bio || "" },
                            { label: "Организация", name: "institution", value: user.institution || "" },
                        ].map((field) => (
                            <div key={field.name}>
                                <label className="text-stone-500 block mb-1.5" style={{ fontSize: 13 }}>
                                    {field.label}
                                </label>
                                <input
                                    defaultValue={field.value}
                                    className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50 outline-none focus:border-stone-400 transition-colors"
                                    style={{ fontSize: 14 }}
                                />
                            </div>
                        ))}
                        <div className="flex gap-3 pt-3">
                            <button className="px-5 py-2.5 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors" style={{ fontSize: 14, fontWeight: 500 }}>
                                Сохранить изменения
                            </button>
                            <button className="px-5 py-2.5 border border-stone-200 text-stone-600 rounded-lg hover:bg-stone-50 transition-colors" style={{ fontSize: 14 }}>
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};