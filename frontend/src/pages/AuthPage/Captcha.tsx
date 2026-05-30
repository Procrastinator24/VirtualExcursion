import { useState, useCallback, useRef, useEffect } from 'react';
import { Check, RefreshCw, Shield } from 'lucide-react';

interface CaptchaProps {
    onVerify: (isVerified: boolean) => void;
    className?: string;
}

export const Captcha = ({ onVerify, className = '' }: CaptchaProps) => {
    const [isVerified, setIsVerified] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [mousePath, setMousePath] = useState<{ x: number; y: number; time: number }[]>([]);
    const startTimeRef = useRef<number>(0);
    const checkboxRef = useRef<HTMLDivElement>(null);

    // Сброс капчи
    const resetCaptcha = useCallback(() => {
        setIsVerified(false);
        setMousePath([]);
        onVerify(false);
    }, [onVerify]);

    // Имитация проверки "человечности"
    const verifyHuman = useCallback(async () => {
        setIsChecking(true);

        // Имитация асинхронной проверки (можно заменить на реальный API запрос)
        await new Promise(resolve => setTimeout(resolve, 800));

        // Простая "анти-робот" проверка:
        // 1. Время от начала взаимодействия до клика (слишком быстро = робот)
        const timeToClick = Date.now() - startTimeRef.current;

        // 2. Есть ли движение мыши перед кликом
        const hasMouseMovement = mousePath.length > 3;

        // 3. Проверка, что клик был внутри области
        const isHuman = timeToClick > 300 && timeToClick < 10000 && hasMouseMovement;

        setIsVerified(isHuman);
        onVerify(isHuman);
        setIsChecking(false);

        if (!isHuman) {
            // Если проверка не пройдена, можно показать сообщение
            console.log('Капча не пройдена: возможно, вы робот');
        }
    }, [mousePath, onVerify]);

    // Отслеживание движения мыши
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (isVerified || isChecking) return;

        setMousePath(prev => [
            ...prev.slice(-20), // храним последние 20 точек
            { x: e.clientX, y: e.clientY, time: Date.now() }
        ]);
    }, [isVerified, isChecking]);

    // Обработка клика по чекбоксу
    const handleClick = useCallback(() => {
        if (isVerified || isChecking) return;

        startTimeRef.current = Date.now();
        verifyHuman();
    }, [isVerified, isChecking, verifyHuman]);

    return (
        <div
            className={`bg-white border rounded-xl transition-all ${className} ${
                isVerified
                    ? 'border-green-400 bg-green-50'
                    : isHovered
                        ? 'border-stone-400 shadow-md'
                        : 'border-stone-200'
            }`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="p-4">
                <div className="flex items-center gap-3">
                    {/* Чекбокс */}
                    <div
                        ref={checkboxRef}
                        onClick={handleClick}
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${
                            isVerified
                                ? 'bg-green-500 border-green-500'
                                : isHovered
                                    ? 'border-stone-400'
                                    : 'border-stone-300'
                        } ${isChecking ? 'opacity-50 cursor-wait' : ''}`}
                    >
                        {isVerified && <Check className="w-4 h-4 text-white" />}
                        {isChecking && (
                            <div className="w-4 h-4 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
                        )}
                    </div>

                    {/* Текст */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            {/*<Shield className="w-4 h-4 text-stone-400" />*/}
                            <span className="text-stone-700 font-medium" style={{ fontSize: 14 }}>
                                {isVerified ? 'Подтверждено' : 'Я не робот'}
                            </span>
                        </div>
                        <p className="text-stone-400 text-xs mt-0.5">
                            {isVerified
                                ? 'Проверка пройдена успешно'
                                : 'Нажмите, чтобы продолжить'
                            }
                        </p>
                    </div>

                    {/* Кнопка обновления (если нужно сбросить) */}
                    {isVerified && (
                        <button
                            type="button"
                            onClick={resetCaptcha}
                            className="text-stone-400 hover:text-stone-600 transition-colors"
                            title="Сбросить"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Адаптивная ширина для мобильных */}
            <style>{`
                @media (max-width: 640px) {
                    .captcha-text {
                        font-size: 12px;
                    }
                }
            `}</style>
        </div>
    );
};