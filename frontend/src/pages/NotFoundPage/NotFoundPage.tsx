import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
    return (
        <div className="max-w-[1320px] mx-auto px-6 py-20 text-center">
            <h1 className="text-6xl font-bold text-stone-900 mb-4">404</h1>
            <p className="text-xl text-stone-500 mb-6">Страница не найдена</p>
            <Link to="/" className="text-stone-600 underline hover:text-stone-900">
                Вернуться на главную
            </Link>
        </div>
    );
};