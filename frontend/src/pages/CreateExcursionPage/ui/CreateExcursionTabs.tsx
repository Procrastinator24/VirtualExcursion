import type { CreateStep } from '../CreateExcursionPage';

interface CreateExcursionTabsProps {
    currentStep: CreateStep;
    onStepChange: (step: CreateStep) => void;
}

export const CreateExcursionTabs = ({ currentStep, onStepChange }: CreateExcursionTabsProps) => {
    const steps: { id: CreateStep; label: string }[] = [
        { id: 'basic', label: 'Основное описание' },
        { id: 'scenes', label: 'Добавить экспонаты' },
        { id: 'details', label: 'Детали экскурсии' },
    ];

    const getStepIndex = (step: CreateStep) => steps.findIndex(s => s.id === step);

    return (
        <div className="w-56 shrink-0">
            <div className="flex flex-col gap-2 sticky top-24">
                {steps.map((step) => {
                    const isActive = step.id === currentStep;
                    const isCompleted = getStepIndex(step.id) < getStepIndex(currentStep);

                    return (
                        <button
                            key={step.id}
                            onClick={() => onStepChange(step.id)}
                            className={`self-stretch px-3 py-2 rounded-md flex items-center gap-2.5 transition-colors ${
                                isActive
                                    ? 'bg-black text-white'
                                    : 'text-zinc-900 hover:bg-gray-100'
                            }`}
                        >
                            <div
                                className={`w-1.5 h-1.5 rounded-full ${
                                    isActive ? 'bg-white' : isCompleted ? 'bg-green-500' : 'bg-black'
                                }`}
                            />
                            <span className="text-base font-medium">{step.label}</span>
                            {isCompleted && !isActive && (
                                <span className="ml-auto text-green-500 text-xs">✓</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};