import { useState } from 'react';
import { ToggleItem } from '../components/ToggleItem';
import { PublicationStatus } from '../components/PublicationStatus';

interface DisplayTabProps {
    initialSettings?: {
        showInAuthorsCatalog: boolean;
        showExcursionsOnPage: boolean;
        showExhibitsOnPage: boolean;
        showContactInfo: boolean;
        showWebsite: boolean;
    };
    verificationStatus?: string;
    isPublished?: boolean;
    onSave?: (settings: any) => void;
    saving?: boolean;
}

export const DisplayTab = ({
                               initialSettings,
                               verificationStatus,
                               isPublished = false,
                               onSave,
                               saving = false,
                           }: DisplayTabProps) => {
    const [settings, setSettings] = useState({
        showInAuthorsCatalog: initialSettings?.showInAuthorsCatalog ?? true,
        showExcursionsOnPage: initialSettings?.showExcursionsOnPage ?? true,
        showExhibitsOnPage: initialSettings?.showExhibitsOnPage ?? true,
        showContactInfo: initialSettings?.showContactInfo ?? true,
        showWebsite: initialSettings?.showWebsite ?? true,
    });

    const handleToggle = (key: keyof typeof settings, value: boolean) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        onSave?.(settings);
    };

    const handleCancel = () => {
        // Вернуть исходные значения
        if (initialSettings) {
            setSettings({
                showInAuthorsCatalog: initialSettings.showInAuthorsCatalog ?? true,
                showExcursionsOnPage: initialSettings.showExcursionsOnPage ?? true,
                showExhibitsOnPage: initialSettings.showExhibitsOnPage ?? true,
                showContactInfo: initialSettings.showContactInfo ?? true,
                showWebsite: initialSettings.showWebsite ?? true,
            });
        }
    };

    const isVerified = verificationStatus === 'approved';
    const canPublish = isVerified; // для примера, может быть своя логика

    return (
        <div className="inline-flex flex-col justify-start items-start gap-5">
            {/* Заголовок секции */}
            <div className="self-stretch flex flex-col justify-start items-start gap-1">
                <div className="justify-start text-zinc-900 text-xl font-semibold font-['Inter'] leading-7">
                    Видимость страницы
                </div>
                <div className="justify-start text-gray-500 text-base font-normal font-['Inter'] leading-6">
                    Управление отображением информации на публичной странице
                </div>
            </div>

            {/* Настройки видимости */}
            <div className="w-[509px] flex flex-col justify-start items-start gap-3.5">
                <ToggleItem
                    title="Показывать страницу в разделе «Авторы и музеи»"
                    description="Ваш музей будет виден в общем каталоге"
                    checked={settings.showInAuthorsCatalog}
                    onChange={(val) => handleToggle('showInAuthorsCatalog', val)}
                />
                <ToggleItem
                    title="Показывать экскурсии на странице музея"
                    description="Список ваших экскурсий будет отображаться на странице"
                    checked={settings.showExcursionsOnPage}
                    onChange={(val) => handleToggle('showExcursionsOnPage', val)}
                />
                <ToggleItem
                    title="Показывать экспонаты на странице музея"
                    description="Коллекция экспонатов будет доступна посетителям"
                    checked={settings.showExhibitsOnPage}
                    onChange={(val) => handleToggle('showExhibitsOnPage', val)}
                />
                <ToggleItem
                    title="Показывать контактную информацию"
                    description="Email, телефон и адрес будут видны на странице"
                    checked={settings.showContactInfo}
                    onChange={(val) => handleToggle('showContactInfo', val)}
                />
                <ToggleItem
                    title="Показывать ссылку на сайт"
                    description="Веб-сайт музея будет отображаться в карточке"
                    checked={settings.showWebsite}
                    onChange={(val) => handleToggle('showWebsite', val)}
                />
            </div>

            {/* Блок статуса публикации */}
            <PublicationStatus
                isVerified={isVerified}
                isPublished={canPublish}
                message={
                    isVerified
                        ? 'Ваша страница успешно прошла модерацию и доступна для просмотра'
                        : 'Пройдите верификацию, чтобы опубликовать страницу'
                }
            />

            {/* Кнопки */}
            <div className="pt-5 inline-flex justify-start items-center gap-2.5">
                <button
                    onClick={handleCancel}
                    className="px-4 py-3 bg-gray-50 rounded-[5px] outline outline-1 outline-gray-200 flex justify-center items-center gap-3 hover:bg-gray-100 transition-colors"
                >
                    <span className="text-center justify-start text-zinc-900 text-base font-medium font-['Inter'] leading-6">
                        Отменить
                    </span>
                </button>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-3 bg-black rounded-[5px] flex justify-center items-center gap-3 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="text-center justify-start text-white text-base font-medium font-['Inter'] leading-6">
                        {saving ? 'Сохранение...' : 'Сохранить изменения'}
                    </span>
                </button>
            </div>
        </div>
    );
};