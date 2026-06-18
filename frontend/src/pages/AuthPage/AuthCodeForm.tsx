import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface AuthCodeFormProps {
    email: string;
    onSubmit: (code: string) => void;
    onResend: () => void;
}

export const AuthCodeForm = ({ email, onSubmit, onResend }: AuthCodeFormProps) => {
    const [code, setCode] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [error, setError] = useState('');
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (timer > 0) {
            const interval = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);
        setError('');

        if (value && index < 3) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleSubmit = () => {
        const fullCode = code.join('');
        if (fullCode.length === 4) {
            onSubmit(fullCode);
        } else {
            setError('Введите 4-значный код');
        }
    };

    const handleResend = () => {
        if (canResend) {
            setTimer(60);
            setCanResend(false);
            onResend();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">Подтверждение</h2>
                    <p className="text-stone-500 text-sm">
                        Мы отправили код на <span className="font-medium text-stone-900">{email}</span>
                    </p>
                </div>

                <div className="flex justify-center gap-3 mb-6">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => { inputsRef.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-14 h-14 text-center text-xl font-semibold rounded-xl border border-stone-200 focus:border-stone-400 outline-none"
                        />
                    ))}
                </div>

                {error && (
                    <p className="text-red-500 text-sm text-center mb-4">{error}</p>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={code.join('').length !== 4}
                    className="w-full py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    Подтвердить
                </button>

                <div className="text-center mt-4">
                    {canResend ? (
                        <button
                            onClick={handleResend}
                            className="text-stone-500 text-sm hover:text-stone-700 underline"
                        >
                            Отправить код повторно
                        </button>
                    ) : (
                        <span className="text-stone-400 text-sm">
                            Повторная отправка через {timer} сек
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};