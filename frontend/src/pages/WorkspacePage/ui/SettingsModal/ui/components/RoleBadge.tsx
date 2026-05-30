interface RoleBadgeProps {
    role: 'owner' | 'admin' | 'editor' | 'viewer';
}

export const RoleBadge = ({ role }: RoleBadgeProps) => {
    const config = {
        owner: {
            label: 'Владелец',
            className: 'bg-purple-50 text-purple-700 border-purple-200',
        },
        admin: {
            label: 'Администратор',
            className: 'bg-blue-50 text-blue-700 border-blue-200',
        },
        editor: {
            label: 'Редактор',
            className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        },
        viewer: {
            label: 'Зритель',
            className: 'bg-gray-50 text-gray-600 border-gray-200',
        },
    };

    const { label, className } = config[role];

    return (
        <div className={`px-3 py-1 rounded-lg outline outline-1 outline-offset-[-1px] flex justify-center items-center gap-1 overflow-hidden ${className}`}>
            <span className="text-base font-medium font-['Inter'] leading-6">
                {label}
            </span>
        </div>
    );
};