import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' ;
}

export const Modal = ({ isOpen, onClose, title, children, size = '2xl' }: ModalProps) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-5xl',

    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className={`${sizeClasses[size]} w-full bg-gray-50 rounded-lg shadow-xl flex flex-col max-h-[calc(100vh-2rem)]`}>
                {/* Заголовок — фиксированный, не скроллится */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 pt-6 pb-6 bg-gray-50  rounded-t-lg">
                    <h2 className="text-gray-900 text-2xl font-semibold font-['Inter'] leading-8">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Содержимое — скроллится */}
                <div className="flex-1 overflow-y-auto px-6 pb-20">
                    {children}
                </div>
            </div>
        </div>
    );
};