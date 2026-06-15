import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {authApi} from "./api/authApi.ts";

interface AuthRegisterFormProps {
    email: string;
    code: string;
    onSubmit: () => void;
}

export const AuthRegisterForm = ({ email, code, onSubmit }: AuthRegisterFormProps) => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firstName || !lastName || !password) {
            setError('Заполните все поля');
            return;
        }
        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }
        if (password.length < 6) {
            setError('Пароль должен быть не менее 6 символов');
            return;
        }

        setIsLoading(true);
        setError('');


        try {
            authApi.register({email, code, "name": `${firstName} ${lastName}`, password })
            console.log('Register:', { email, code, firstName, lastName, password });
            onSubmit();
            // После успешной регистрации — редирект на главную
            navigate('/');
        } catch (err) {
            setError('Ошибка регистрации. Попробуйте позже.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">Завершение регистрации</h2>
                    <p className="text-stone-500 text-sm">
                        Укажите ваши данные
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                Имя
                            </label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-stone-400 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                Фамилия
                            </label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-stone-400 outline-none transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-500"
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
                            placeholder="Минимум 6 символов"
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-stone-400 outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                            Подтверждение пароля
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-stone-400 outline-none transition"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 disabled:opacity-50 transition"
                    >
                        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>
            </div>
        </div>
    );
};