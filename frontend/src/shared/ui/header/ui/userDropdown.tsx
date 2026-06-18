import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    User,
    Bell,
    Settings,
    Users,
    PlusCircle,
    LogOut,
    ChevronDown
} from 'lucide-react';
import { useAuth } from '@app/Contexts';
import { ImageWithFallback } from '../../imgWrapper/ImageWithFallback';
import {workspaceApi} from "../../../../entities/workspace";
import {WorkspaceCreateModal} from "@entities/workspace/ui/CreateWorkspaceModal.tsx";
import {useModal} from "../../../../app/Contexts/CreateWorkspaceModalContext/ModalContext.tsx";

interface Workspace {
    id: number;
    name: string;
    logoUrl?: string;
}

export const UserDropdown = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const { openCreateWorkspace } = useModal();
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        workspaceApi.getMy().then((response) => {
            setWorkspaces(response.data)
            console.log(response)
        })
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Кнопка-триггер */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-stone-100 transition-colors"
            >
                <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center overflow-hidden">
                    {user.avatarUrl ? (
                        <ImageWithFallback
                            src={user.avatarUrl}
                            alt={user.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <User className="w-4 h-4 text-stone-500" />
                    )}
                </div>
                <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Выпадающее меню */}
            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden z-50">
                    {/* Профиль пользователя */}
                    <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-4 hover:bg-stone-50 transition-colors no-underline"
                    >
                        <div
                            className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center overflow-hidden shrink-0">
                            {user.avatarUrl ? (
                                <ImageWithFallback
                                    src={user.avatarUrl}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-5 h-5 text-stone-500"/>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-stone-900 font-medium truncate" style={{fontSize: 14}}>
                                {user.name}
                            </div>
                            <div className="text-stone-400 truncate" style={{fontSize: 12}}>
                                {user.email}
                            </div>
                        </div>
                    </Link>

                    {/* Уведомления */}
                    <div className="border-t border-stone-100">
                        <div
                            className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors cursor-pointer">
                            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                                <Bell className="w-4 h-4 text-stone-500"/>
                            </div>
                            <span className="text-stone-700 text-sm">Уведомления</span>
                        </div>
                    </div>

                    {/* Настройки аккаунта */}
                    <div className="border-t border-stone-100">
                        <Link
                            to="/profile?tab=settings"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors no-underline"
                        >
                            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                                <Settings className="w-4 h-4 text-stone-500"/>
                            </div>
                            <span className="text-stone-700 text-sm">Настройки аккаунта</span>
                        </Link>
                    </div>

                    {/* Мои пространства */}
                    {workspaces.length > 0 && (
                        <div className="border-t border-stone-100">
                            <div className="px-4 py-2">
                                <div className="text-stone-400 text-xs uppercase tracking-wider font-semibold">
                                    Мои пространства
                                </div>
                            </div>
                            {workspaces.map((workspace) => (
                                <Link
                                    key={workspace.id}
                                    to={`/workspace/${workspace.id}`}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2 hover:bg-stone-50 transition-colors no-underline"
                                >
                                    <div
                                        className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center overflow-hidden shrink-0">
                                        {workspace.logoUrl ? (
                                            <ImageWithFallback
                                                src={workspace.logoUrl}
                                                alt={workspace.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Users className="w-4 h-4 text-stone-500"/>
                                        )}
                                    </div>
                                    <span className="text-stone-700 text-sm truncate">{workspace.name}</span>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Новое пространство */}
                    <div className="border-t border-stone-100">
                        <button
                            onClick={openCreateWorkspace}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors text-left"
                        >
                            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                                <PlusCircle className="w-4 h-4 text-stone-500"/>
                            </div>
                            <span className="text-stone-700 text-sm">Новое пространство</span>
                        </button>
                    </div>

                    {/* Выход */}
                    <div className="border-t border-stone-100">
                        <button
                            onClick={() => {
                                // TODO: logout logic
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors text-left"
                        >
                            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                                <LogOut className="w-4 h-4 text-stone-500"/>
                            </div>
                            <span className="text-stone-700 text-sm">Выйти</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};