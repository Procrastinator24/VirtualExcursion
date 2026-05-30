import type {VerificationStatus} from "@entities/workspace";

interface VerificationBadgeProps {
    status: VerificationStatus;
    className?: string;
}

export const VerificationBadge = ({ status, className = '' }: VerificationBadgeProps) => {
    const config = {
        Not_submitted: {
            label: 'Не подтверждено',
            className: 'bg-gray-100 text-gray-600 border-gray-300',
        },
        Pending: {
            label: 'Проверка',
            className: 'bg-orange-100 text-orange-600 border-orange-500',
        },
        Approved: {
            label: 'Подтверждено',
            className: 'bg-green-100 text-green-700 border-green-600',
        },
        Rejected: {
            label: 'Отклонено',
            className: 'bg-red-100 text-red-600 border-red-500',
        },
    };

    const { label, className: colorClass } = config[status] || config.Not_submitted;

    return (
        <div className={`px-2 py-1 rounded-lg border ${colorClass} ${className}`}>
            <span className="text-xs font-medium">{label}</span>
        </div>
    );
};