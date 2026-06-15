interface PublicationStatusProps {
    isVerified: boolean;
    isPublished: boolean;
    message?: string;
}

export const PublicationStatus = ({ isVerified, isPublished, message }: PublicationStatusProps) => {
    // Статусы:
    // - verified: проверенный музей
    // - published: публикация доступна
    // - message: дополнительный текст

    return (
        <div className="w-full px-5 pt-5 pb-1 bg-neutral-100/50 rounded-md outline outline-1 outline-gray-200 flex flex-col justify-start items-start gap-2.5">
            <div className="text-zinc-900 text-xs font-semibold font-['Inter'] leading-4">
                Статус публикации
            </div>
            <div className="flex flex-col justify-start items-start gap-1.5">
                <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${isVerified ? 'bg-blue-600' : 'bg-gray-400'}`} />
                    <span className="text-zinc-900 text-xs font-normal font-['Inter'] leading-4">
                        {isVerified ? 'Проверенный музей' : 'Не проверен'}
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-green-600' : 'bg-gray-400'}`} />
                    <span className="text-zinc-900 text-xs font-normal font-['Inter'] leading-4">
                        {isPublished ? 'Публикация доступна' : 'Публикация недоступна'}
                    </span>
                </div>
            </div>
            {message && (
                <div className="text-gray-500 text-xs font-normal font-['Inter'] leading-4">
                    {message}
                </div>
            )}
        </div>
    );
};