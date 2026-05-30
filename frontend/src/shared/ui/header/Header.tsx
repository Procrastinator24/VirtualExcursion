import { Link, useLocation } from "react-router";
import { Menu, X, Compass, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../../app/Contexts";
import { UserDropdown } from "./ui/userDropdown.tsx";

export function Header() {
    const location = useLocation();
    const [mobileMenu, setMobileMenu] = useState(false);
    const { user } = useAuth();

    const navLinks = [
        { to: "/", label: "Главная" },
        { to: "/catalog", label: "Экскурсии" },
        { to: "/exhibits", label: "Экспонаты" },
        { to: "/authors", label: "Авторы" },
        { to: "/about", label: "О проекте" },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200">
            <div className="max-w-[1320px] mx-auto px-6 h-16 flex items-center justify-between gap-5">
                {/* Левая часть: Логотип + Навигация */}
                <div className="flex items-center gap-5">
                    {/* Логотип */}
                    <Link to="/" className="flex items-center gap-2.5 no-underline shrink-0">
                        <div className="w-9 h-9 rounded-lg bg-stone-900 flex items-center justify-center">
                            <Compass className="w-5 h-5 text-white" />
                        </div>
                    </Link>

                    {/* Навигация (десктоп) */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((l) => (
                            <Link
                                key={l.to}
                                to={l.to}
                                className={`px-3.5 py-2 rounded-lg no-underline transition-colors ${
                                    isActive(l.to)
                                        ? "bg-stone-100 text-stone-900"
                                        : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
                                }`}
                                style={{ fontSize: 14, fontWeight: 500 }}
                            >
                                {l.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Правая часть (десктоп): кнопки авторизации / профиль */}
                <div className="flex items-center gap-2">
                    {user ? (
                        // --- АВТОРИЗОВАННЫЙ ПОЛЬЗОВАТЕЛЬ ---
                        <>
                            <UserDropdown />

                            {/* Мобильное меню (только на мобильных) */}
                            <button
                                className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-stone-500 hover:bg-stone-100"
                                onClick={() => setMobileMenu(!mobileMenu)}
                            >
                                {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </>
                    ) : (
                        // --- НЕАВТОРИЗОВАННЫЙ ПОЛЬЗОВАТЕЛЬ ---
                        <>
                            {/* Кнопка "Войти" (вторичная) */}
                            <Link
                                to="/auth"
                                className="hidden md:flex h-9 px-4 rounded-lg border border-stone-300 text-stone-700 items-center gap-2 no-underline hover:bg-stone-50 transition-colors"
                                style={{ fontSize: 13, fontWeight: 500 }}
                            >
                                <LogIn className="w-4 h-4" />
                                Войти
                            </Link>

                            {/* Кнопка "Зарегистрироваться" (основная) */}
                            <Link
                                to="/auth"
                                className="hidden md:flex h-9 px-4 rounded-lg bg-stone-900 text-white items-center gap-2 no-underline hover:bg-stone-800 transition-colors"
                                style={{ fontSize: 13, fontWeight: 500 }}
                            >
                                <UserPlus className="w-4 h-4" />
                                Зарегистрироваться
                            </Link>

                            {/* Мобильное меню */}
                            <button
                                className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-stone-500 hover:bg-stone-100"
                                onClick={() => setMobileMenu(!mobileMenu)}
                            >
                                {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Мобильное меню */}
            {mobileMenu && (
                <div className="md:hidden border-t border-stone-200 bg-white px-6 py-4 flex flex-col gap-1">
                    {navLinks.map((l) => (
                        <Link
                            key={l.to}
                            to={l.to}
                            onClick={() => setMobileMenu(false)}
                            className={`px-3 py-2.5 rounded-lg no-underline ${
                                isActive(l.to) ? "bg-stone-100 text-stone-900" : "text-stone-600"
                            }`}
                            style={{ fontSize: 15 }}
                        >
                            {l.label}
                        </Link>
                    ))}

                    {user ? (
                        <Link
                            to="/profile"
                            onClick={() => setMobileMenu(false)}
                            className="mt-2 px-3 py-2.5 rounded-lg bg-stone-900 text-white no-underline text-center"
                            style={{ fontSize: 15 }}
                        >
                            Профиль
                        </Link>
                    ) : (
                        <>
                            <Link
                                to="/auth"
                                onClick={() => setMobileMenu(false)}
                                className="mt-2 px-3 py-2.5 rounded-lg border border-stone-300 text-stone-700 no-underline text-center"
                                style={{ fontSize: 15 }}
                            >
                                Войти
                            </Link>
                            <Link
                                to="/auth"
                                onClick={() => setMobileMenu(false)}
                                className="px-3 py-2.5 rounded-lg bg-stone-900 text-white no-underline text-center"
                                style={{ fontSize: 15 }}
                            >
                                Зарегистрироваться
                            </Link>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}