import { useState, useEffect } from 'react';
import { Modal } from '@shared/ui/Modal/Modal';
import {SettingsModalLayout, TabConfig} from './ui/SettingsModalLayout.tsx';
import { InfoTab } from './ui/tabs/InfoTab';
import {DisplayTab} from "./ui/tabs/DisplayTab.tsx"
import {VerificationTab} from "./ui/tabs/VerificationTab.tsx"
import { workspaceApi } from '@entities/workspace';
import type { WorkspaceResponse } from '../../../../entities/workspace';
import {useAuth} from "../../../../app/Contexts";

interface WorkspaceSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    workspace: WorkspaceResponse;
    onWorkspaceUpdate: (updatedWorkspace: WorkspaceResponse) => void;
}

export const WorkspaceSettingsModal = ({
                                           isOpen,
                                           onClose,
                                           workspace,
                                           onWorkspaceUpdate,
                                       }: WorkspaceSettingsModalProps) => {
    console.log("modal render:", isOpen)
    const [activeTab, setActiveTab] = useState('info');
    const [saving, setSaving] = useState(false);
    const {user} = useAuth()
    const {isOwner, setIsOwner} = useState<boolean>(true);
    const handleSaveInfo = async (data: any) => {
        setSaving(true);
        try {
            const response = await workspaceApi.update({
                id: workspace.id,
                name: data.name,
                descriptionShort: data.shortDescription,
                descriptionLong: workspace.descriptionLong,
                logoUrl: data.logoUrl,
                website: data.website,
                phone: data.phone,
                address: data.address,
                // TODO: добавить city, country, bannerUrl
            });
            onWorkspaceUpdate(response.data);
            onClose();
        } catch (error) {
            console.error('Failed to update workspace:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleSaveDisplay = async (settings: any) => {
        setSaving(true);
        try {
            await workspaceApi.update({
                id: workspace.id,
                ...settings,
            });
            onWorkspaceUpdate({ ...workspace, ...settings });
        } catch (error) {
            console.error('Failed to update display settings:', error);
        } finally {
            setSaving(false);
        }
    };

    const tabs: TabConfig[] = [
        {
            id: 'info',
            label: 'Информация и внешний вид',
            component: (
                <InfoTab
                    initialData={{
                        name: workspace.name,
                        shortDescription: workspace.descriptionShort || '',
                        website: workspace.website || '',
                        phone: workspace.phone || '',
                        address: workspace.address || '',
                        city: '', // TODO: добавить поле city в WorkspaceResponse
                        country: '', // TODO: добавить поле country в WorkspaceResponse
                        logoUrl: workspace.logoUrl,
                        coverUrl: workspace.bannerUrl,
                    }}
                    onSave={handleSaveInfo}
                    saving={saving}
                />
            ),
        },
        {
            id: 'display',
            label: 'Отображение',
            component: (
                <DisplayTab
                    initialSettings={{
                        showInAuthorsCatalog: workspace.showInAuthorsCatalog ?? true,
                        showExcursionsOnPage: workspace.showExcursionsOnPage ?? true,
                        showExhibitsOnPage: workspace.showExhibitsOnPage ?? true,
                        showContactInfo: workspace.showContactInfo ?? true,
                        showWebsite: workspace.showSite ?? true,
                    }}
                    verificationStatus={workspace.verificationStatus}
                    isPublished={workspace.isPublished}
                    onSave={handleSaveDisplay}
                    saving={saving}
                />
            ),
        },
        {
            id: 'verification',
            label: 'Подтверждение',
            component: (
                <VerificationTab
                    userRole="owner"
                    userEmail={user?.email || ''}
                    applicationStatus={workspace.verificationStatus}
                    applicationDate={workspace.verifiedAt ? new Date(workspace.verifiedAt).toLocaleDateString('ru-RU') : undefined}
                    workspaceType={workspace.type === 'museum' ? 'Музей' : workspace.type === 'personal' ? 'Личное' : 'Команда'}
                    organizationName={workspace.name}
                    applicantRole={user?.role === 'Guide' ? 'Гид' : 'Пользователь'}
                    applicantEmail={user?.email}
                    documentName="document.pdf"
                    documentUrl="#"
                    comment={workspace.rejectionReason || undefined}
                    onOpenApplication={() => console.log('Open application form')}
                    onEditApplication={() => console.log('Edit application')}
                    canEdit={isOwner}
                />
            ),
        },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Настройки пространства" size="xl">
            <SettingsModalLayout
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
        </Modal>
    );
};