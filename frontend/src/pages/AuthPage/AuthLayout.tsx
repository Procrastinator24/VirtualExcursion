import { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <div className="min-h-screen flex">
            {/* Левая часть — картинка */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-stone-900">
                <img
                    src="/regAuthPageImage.png"
                    alt="Virtual excursion"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                {/*<div className="relative z-10 flex flex-col justify-center items-center text-white p-12 text-center">*/}
                {/*    <h1 className="text-4xl font-bold mb-4">Виртуальные экскурсии</h1>*/}
                {/*    <p className="text-lg opacity-90">*/}
                {/*        Погрузитесь в историю с помощью 3D-моделей, панорам и VR*/}
                {/*    </p>*/}
                {/*</div>*/}
            </div>

            {/* Правая часть — форма */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
};