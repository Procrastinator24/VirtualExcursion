interface InfoRowProps {
    label: string;
    value: React.ReactNode;
    isLast?: boolean;
}

export const InfoRow = ({ label, value, isLast = false }: InfoRowProps) => {
    return (
        <div className={`self-stretch pt-3 pb-4 ${!isLast ? 'border-b border-black' : ''} flex justify-between items-center`}>
            <div className="w-80 flex justify-start items-center gap-2.5">
                <span className="text-gray-500 text-base font-normal font-['Inter'] leading-6">
                    {label}
                </span>
            </div>
            <div className="flex-1 flex justify-start items-center gap-2.5">
                <span className="text-zinc-900 text-base font-normal font-['Inter'] leading-6">
                    {value}
                </span>
            </div>
        </div>
    );
};