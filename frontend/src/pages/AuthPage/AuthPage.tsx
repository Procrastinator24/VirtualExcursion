import { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { LoginForm } from './AuthEmailForm.tsx';
import { RegisterEmailForm } from './RegisterEmailForm.tsx';
import { AuthCodeForm } from './AuthCodeForm';
import { AuthRegisterForm } from './AuthRegisterForm';

export type AuthStep = 'login' | 'registerEmail' | 'code' | 'register';

export const AuthPage = () => {
    const [step, setStep] = useState<AuthStep>('login');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');

    // Переход к форме регистрации (запрос кода)
    const handleGoToRegister = () => {
        setStep('registerEmail');
    };

    // После отправки email для регистрации
    const handleRegisterEmailSubmit = (submittedEmail: string) => {
        setEmail(submittedEmail);
        // TODO: Отправить код на почту (API)
        setStep('code');
    };

    // После подтверждения кода
    const handleCodeSubmit = (submittedCode: string) => {
        setCode(submittedCode);
        setStep('register');
    };

    // После завершения регистрации
    const handleRegisterComplete = () => {
        // TODO: Автоматически войти или перенаправить на вход
        setStep('login');
    };

    // Повторная отправка кода
    const handleResendCode = () => {
        // TODO: Повторно отправить код на email
        console.log('Resend code to:', email);
    };

    // Определяем, нужен ли Layout с картинкой
    const hasImageLayout = step === 'login' || step === 'registerEmail';
    const isFullCenter = step === 'code' || step === 'register';

    if (isFullCenter) {
        // Формы без картинки (просто по центру)
        if (step === 'code') {
            return (
                <AuthCodeForm
                    email={email}
                    onSubmit={handleCodeSubmit}
                    onResend={handleResendCode}
                />
            );
        }
        if (step === 'register') {
            return (
                <AuthRegisterForm
                    email={email}
                    code={code}
                    onSubmit={handleRegisterComplete}
                />
            );
        }
    }

    // Формы с картинкой (Layout)
    return (
        <AuthLayout>
            {step === 'login' && (
                <LoginForm onGoToRegister={handleGoToRegister} />
            )}
            {step === 'registerEmail' && (
                <RegisterEmailForm onSubmit={handleRegisterEmailSubmit} />
            )}
        </AuthLayout>
    );
};