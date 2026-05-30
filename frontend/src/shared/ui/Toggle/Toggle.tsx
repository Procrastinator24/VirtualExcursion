interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

export const Toggle = ({ checked, onChange, disabled = false }: ToggleProps) => {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onChange(!checked)}
            className={`
                relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out
                ${checked ? 'bg-black' : 'bg-gray-300'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            <span
                className={`
                    absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ease-in-out
                    ${checked ? 'translate-x-6' : 'translate-x-0'}
                `}
            />
        </button>
    );
};