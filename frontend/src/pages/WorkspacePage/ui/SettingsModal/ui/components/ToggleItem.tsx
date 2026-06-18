import {Toggle} from "@shared/ui/Toggle/Toggle.tsx";

interface ToggleItemProps {
    title: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

export const ToggleItem = ({ title, description, checked, onChange, disabled = false }: ToggleItemProps) => {
    return (
        <div className="w-full h-14 py-2.5 border-b border-gray-200 flex justify-between items-center">
            <div className="flex flex-col justify-start items-start gap-0.5">
                <span className="text-zinc-900 text-sm font-medium font-['Inter'] leading-5">
                    {title}
                </span>
                <span className="text-gray-500 text-sm font-normal font-['Inter'] leading-5">
                    {description}
                </span>
            </div>
            <Toggle checked={checked} onChange={onChange} disabled={disabled} />
        </div>
    );
};