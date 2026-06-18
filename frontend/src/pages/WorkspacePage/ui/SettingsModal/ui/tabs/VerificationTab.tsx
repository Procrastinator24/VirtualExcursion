import { InfoRow } from '../components/InfoRow';
import {VerificationBadge} from '../../../../../../shared/ui/VerificationBadge/StatusBadge.tsx';
import { RoleBadge } from '../components/RoleBadge';
import { DocumentLink } from '../components/DocumentLink';
import { VerificationStatus } from '@entities/workspace/index.ts';

interface VerificationTabProps {
    // Данные пользователя
    userRole: 'owner' | 'admin' | 'editor' | 'viewer';
    userEmail: string;

    // Данные заявки
    applicationStatus: VerificationStatus;
    applicationDate?: string;
    workspaceType?: string;
    organizationName?: string;
    applicantRole?: string;
    applicantEmail?: string;
    documentName?: string;
    documentUrl?: string;
    comment?: string;

    onOpenApplication?: () => void;
    onEditApplication?: () => void;
    canEdit?: boolean;
}

export const VerificationTab = ({
                                    userRole,
                                    userEmail,
                                    applicationStatus,
                                    applicationDate,
                                    workspaceType,
                                    organizationName,
                                    applicantRole,
                                    applicantEmail,
                                    documentName,
                                    documentUrl,
                                    comment,
                                    onOpenApplication,
                                    onEditApplication,
                                    canEdit = true,
                                }: VerificationTabProps) => {
    const isApplicationSubmitted = applicationStatus !== 'NotSubmitted';

    return (
        <div className="inline-flex flex-col justify-start items-start gap-5">
            {/* Заголовок секции */}
            <div className="w-[494px] flex flex-col justify-start items-start gap-1">
                <div className="justify-start text-zinc-900 text-base font-semibold font-['Inter'] leading-6">
                    Данные о статусе пространства
                </div>
                <div className="self-stretch justify-start text-gray-500 text-base font-normal font-['Inter'] leading-6">
                    Здесь отображаются данные, связанные с правом управления пространством и заявкой на подтверждение.
                </div>
            </div>

            {/* Данные участника */}
            <div className="self-stretch px-5 py-3 bg-white rounded-md outline outline-1 outline-gray-200 flex flex-col justify-start items-start gap-3.5">
                <div className="justify-start text-zinc-900 text-base font-semibold font-['Inter'] leading-6">
                    Данные участника
                </div>
                <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="self-stretch pt-1 pb-2 border-b border-gray-200 flex justify-between items-center">
                        <span className="text-gray-500 text-base font-normal font-['Inter'] leading-6">
                            Роль в пространстве
                        </span>
                        <RoleBadge role={userRole} />
                    </div>
                    <div className="self-stretch pt-2 pb-3 border-b border-gray-200 flex justify-between items-center">
                        <span className="text-gray-500 text-base font-normal font-['Inter'] leading-6">
                            Email
                        </span>
                        <span className="text-zinc-900 text-base font-medium font-['Inter'] leading-6">
                            {userEmail}
                        </span>
                    </div>
                </div>
            </div>

            {/* Заявка на подтверждение */}
            <div className="self-stretch px-5 pt-3 pb-5 bg-white rounded-md outline outline-1 outline-gray-200 flex flex-col justify-start items-start gap-3.5">
                <div className="justify-start text-zinc-900 text-base font-semibold font-['Inter'] leading-6">
                    Заявка на подтверждение
                </div>

                <div className="self-stretch flex flex-col justify-start items-start">
                    {/* Статус заявки */}
                    <div className="w-full pb-4 border-b border-black flex justify-start items-center">
                        <div className="w-80 flex justify-start items-center gap-2.5">
                            <span className="text-gray-500 text-base font-normal font-['Inter'] leading-6">
                                Статус заявки
                            </span>
                        </div>
                        <VerificationBadge status={applicationStatus} />
                    </div>

                    {/* Дата отправки */}
                    {applicationDate && (
                        <InfoRow label="Дата отправки" value={applicationDate} />
                    )}

                    {/* Тип пространства */}
                    <InfoRow label="Тип пространства" value={workspaceType || '—'} />

                    {/* Название организации */}
                    <InfoRow label="Название организации" value={organizationName || '—'} />

                    {/* Роль заявителя */}
                    <InfoRow label="Роль заявителя" value={applicantRole || '—'} />

                    {/* Email заявителя */}
                    <InfoRow label="Email заявителя" value={applicantEmail || '—'} />

                    {/* Документ для подтверждения */}
                    <InfoRow
                        label="Документ для подтверждения"
                        value={
                            documentName && documentUrl ? (
                                <DocumentLink fileName={documentName} url={documentUrl} />
                            ) : (
                                '—'
                            )
                        }
                    />

                    {/* Комментарий к заявке */}
                    <InfoRow label="Комментарий к заявке" value={comment || '—'} isLast />
                </div>

                {/* Кнопки действий */}
                {(applicationStatus === 'NotSubmitted' || applicationStatus === 'Rejected') && canEdit && (
                    <div className="self-stretch inline-flex justify-start items-center gap-3">
                        <button
                            onClick={onOpenApplication}
                            className="px-4 py-2 bg-gray-50 rounded-[5px] outline outline-1 outline-gray-200 flex justify-start items-center gap-2 hover:bg-gray-100 transition-colors"
                        >
                            <span className="text-zinc-900 text-base font-medium font-['Inter'] leading-6">
                                Подать заявку
                            </span>
                        </button>
                    </div>
                )}

                {(applicationStatus === 'Pending') && canEdit && (
                    <div className="self-stretch inline-flex justify-start items-center gap-3">
                        <button
                            onClick={onEditApplication}
                            className="px-4 py-2 bg-gray-50 rounded-[5px] outline outline-1 outline-gray-200 flex justify-center items-center gap-2 hover:bg-gray-100 transition-colors"
                        >
                            <span className="text-zinc-900 text-base font-medium font-['Inter'] leading-6">
                                Редактировать заявку
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};