import type {VerificationStatus} from "@entities/workspace";

interface VerificationBadgeProps {
    status: VerificationStatus;
    className?: string;
}

export const VerificationBadge = ({status, className = ''}: VerificationBadgeProps) => {
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
            className: 'bg-green-100 text-green-700 border-green-300',
        },
        Rejected: {
            label: 'Отклонено',
            className: 'bg-red-100 text-red-600 border-red-500',
        },
    };

    const {label, className: colorClass} = config[status] || config.Not_submitted;

    return (
        <div className={`px-3 py-0.5 rounded-2xl border ${colorClass} ${className}`}>
            <span className="text-xs font-medium">{label}</span>
        </div>
    );
};
// <div
//     className="w-36 h-8 relative bg-emerald-50 rounded-full outline outline-[0.80px] outline-offset-[-0.80px] outline-emerald-200">
//     <div className="size-3.5 left-[12.80px] top-[9.80px] absolute overflow-hidden">
//         <div
//             className="size-3 left-[1.17px] top-[1.17px] absolute outline outline-1 outline-offset-[-0.58px] outline-emerald-700"/>
//         <div
//             className="w-2 h-1.5 left-[5.25px] top-[2.33px] absolute outline outline-1 outline-offset-[-0.58px] outline-emerald-700"/>
//     </div>
//     <div
//         className="left-[32.80px] top-[7.40px] absolute justify-start text-emerald-700 text-sm font-medium font-['Inter'] leading-5">Подтверждено
//     </div>
// </div>