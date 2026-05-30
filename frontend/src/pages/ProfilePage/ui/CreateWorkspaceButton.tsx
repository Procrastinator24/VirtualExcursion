import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CreateWorkspaceButtonProps {
    onClick?: () => void;
    className?: string;
}

export const CreateWorkspaceButton = ({ onClick, className = '' }: CreateWorkspaceButtonProps) => {
    const handleClick = () => {
        // TODO: Открыть модалку или перейти на страницу создания
        console.log('Создать новое пространство');
        onClick?.();
    };

    return (
        <button
            onClick={handleClick}
            className={`h-12 px-5 py-1 bg-stone-900 rounded-xl inline-flex justify-center items-center gap-1.5 hover:bg-stone-800 transition-colors ${className}`}
        >
            <Plus className="w-5 h-5 text-white" />
            <span className="text-white text-base font-medium font-['Manrope'] leading-6">
                Новое пространство
            </span>
        </button>
    );
};