import { useState } from 'react';
import { Captcha } from './Captcha';
import {authApi} from "./api/authApi.ts";

interface RegisterEmailFormProps {
    onSubmit: (email: string) => void;
}

export const RegisterEmailForm = ({ onSubmit }: RegisterEmailFormProps) => {
    const [email, setEmail] = useState('');
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError('Введите email');
            return;
        }
        if (!isCaptchaVerified) {
            setError('Подтвердите, что вы не робот');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            authApi.sendCode(email)
            console.log('Send code to:', email);
            onSubmit(email);
        } catch (err) {
            setError('Ошибка отправки кода. Попробуйте позже.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-stone-900 mb-2">Регистрация</h2>
                <p className="text-stone-500 text-sm">
                    Введите ваш email, мы отправим код подтверждения
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
                    {isLoading ? 'Отправка...' : 'Продолжить'}
                </button>

                <div className="text-center mt-4">
                    <span className="text-stone-500 text-sm">Уже есть аккаунт? </span>
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="text-stone-900 text-sm font-medium hover:underline"
                    >
                        Войти
                    </button>
                </div>
            </form>
        </div>
    );
};