import { useState } from 'react';
import { Captcha } from './Captcha';
import {authApi} from "./api/authApi.ts";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../app/Contexts";

interface LoginFormProps {
    onGoToRegister: () => void;
}

export const LoginForm = ({ onGoToRegister }: LoginFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError('Введите email');
            return;
        }
        if (!password) {
            setError('Введите пароль');
            return;
        }
        if (!isCaptchaVerified) {
            setError('Подтвердите, что вы не робот');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const userData = await authApi.login({ email, password });

            console.log('Login response:', userData);

            // Убедись, что userData.token — строка
            const token = userData.token || userData.accessToken;

            if (!token) {
                throw new Error('Токен не получен от сервера');
            }

            // Вызываем login из контекста
            login(userData, token);

            navigate('/');
        } catch (err) {
            setError('Неверный email или пароль');
            console.error('Login error:', err);
        }
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-stone-900 mb-2">Вход в аккаунт</h2>
                <p className="text-stone-500 text-sm">
                    Введите ваш email и пароль
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@mail.ru"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-stone-400 outline-none transition"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                        Пароль
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-stone-400 outline-none transition"
                    />
                </div>

                {/* Капча */}
                <Captcha onVerify={setIsCaptchaVerified} />

                {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 disabled:opacity-50 transition"
                >
                    {isLoading ? 'Вход...' : 'Войти'}
                </button>

                <div className="text-center mt-4">
                    <span className="text-stone-500 text-sm">Нет аккаунта? </span>
                    <button
                        type="button"
                        onClick={onGoToRegister}
                        className="text-stone-900 text-sm font-medium hover:underline"
                    >
                        Зарегистрироваться
                    </button>
                </div>
            </form>
        </div>
    );
};