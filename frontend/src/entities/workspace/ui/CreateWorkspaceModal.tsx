import { useState } from 'react';
import { workspaceApi } from '@entities/workspace';
import { Modal } from '@shared/ui/modal/Modal';

interface WorkspaceCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface FormData {
    name: string;
    descriptionShort: string;
    city: string;
    country: string;
    logoUrl?: string;
    bannerUrl?: string;
}

export const WorkspaceCreateModal = ({ isOpen, onClose, onSuccess }: WorkspaceCreateModalProps) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        descriptionShort: '',
        city: '',
        country: '',
    });
    const [loading, setLoading] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingBanner, setUploadingBanner] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const localPreview = URL.createObjectURL(file);
        setLogoPreview(localPreview);
        setUploadingLogo(true);

        try {
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);
            const response = await workspaceApi.uploadThumbnail(uploadFormData);
            setFormData(prev => ({ ...prev, logoUrl: response.data.url }));
            setLogoPreview(response.data.url);
        } catch (error) {
            console.error('Failed to upload logo:', error);
            setLogoPreview(null);
        } finally {
            setUploadingLogo(false);
        }
    };

    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const localPreview = URL.createObjectURL(file);
        setBannerPreview(localPreview);
        setUploadingBanner(true);

        try {
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);
            const response = await workspaceApi.uploadBanner(uploadFormData);
            setFormData(prev => ({ ...prev, bannerUrl: response.data.url }));
            setBannerPreview(response.data.url);
        } catch (error) {
            console.error('Failed to upload banner:', error);
            setBannerPreview(null);
        } finally {
            setUploadingBanner(false);
        }
    };

    const handleLogoRemove = () => {
        setLogoPreview(null);
        setFormData(prev => ({ ...prev, logoUrl: undefined }));
    };

    const handleBannerRemove = () => {
        setBannerPreview(null);
        setFormData(prev => ({ ...prev, bannerUrl: undefined }));
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            alert('Введите название пространства');
            return;
        }
        if (!formData.descriptionShort.trim()) {
            alert('Введите краткое описание');
            return;
        }

        setLoading(true);
        try {
            await workspaceApi.create({
                name: formData.name,
                descriptionShort: formData.descriptionShort,
                address: formData.city && formData.country ? `${formData.city}, ${formData.country}` : undefined,
                logoUrl: formData.logoUrl,
                bannerUrl: formData.bannerUrl,
            });
            onSuccess();
            onClose();
            resetForm();
        } catch (error) {
            console.error('Failed to create workspace:', error);
            alert('Не удалось создать пространство');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            descriptionShort: '',
            city: '',
            country: '',
        });
        setLogoPreview(null);
        setBannerPreview(null);
    };

    const isValid = formData.name.trim() && formData.descriptionShort.trim();

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Создание пространства" size="xl">
            <div className="inline-flex flex-col justify-start items-start gap-5 w-full">
                {/* Основная информация */}
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                    <div className="justify-start text-zinc-900 text-xl font-semibold font-['Inter'] leading-7">
                        Основная информация
                    </div>
                    <div className="justify-start text-gray-500 text-base font-normal font-['Inter'] leading-6">
                        Базовые данные о вашем пространстве
                    </div>
                </div>

                <div className="w-full max-w-[640px] flex flex-col justify-start items-start gap-5">
                    {/* Название */}
                    <div className="w-96 flex flex-col justify-start items-start gap-2">
                        <div className="flex items-start gap-0.5">
                            <span className="text-zinc-900 text-sm font-medium">Название</span>
                            <span className="text-red-600 text-base font-medium">*</span>
                        </div>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Введите название пространства"
                            className="self-stretch px-3 py-2 bg-white rounded-[5px] outline outline-1 outline-gray-200 text-sm focus:outline-gray-400"
                        />
                    </div>

                    {/* Краткое описание */}
                    <div className="flex flex-col justify-start items-start gap-2">
                        <div className="flex items-start gap-0.5">
                            <span className="text-zinc-900 text-sm font-medium">Краткое описание</span>
                            <span className="text-red-600 text-base font-medium">*</span>
                        </div>
                        <textarea
                            value={formData.descriptionShort}
                            onChange={(e) => handleInputChange('descriptionShort', e.target.value)}
                            rows={3}
                            placeholder="Введите описание пространства"
                            className="w-96 px-3 py-2 bg-white rounded-[5px] outline outline-1 outline-gray-200 text-sm focus:outline-gray-400 resize-none"
                        />
                        <div className="text-gray-500 text-sm">Отображается в карточке музея</div>
                    </div>

                    {/* Город и страна */}
                    <div className="self-stretch flex gap-4">
                        <div className="w-44 flex flex-col gap-2">
                            <span className="text-zinc-900 text-sm font-medium">Город</span>
                            <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                placeholder="Город"
                                className="px-3 py-2 bg-white rounded-[5px] outline outline-1 outline-gray-200 text-sm"
                            />
                        </div>
                        <div className="w-44 flex flex-col gap-2">
                            <span className="text-zinc-900 text-sm font-medium">Страна</span>
                            <input
                                type="text"
                                value={formData.country}
                                onChange={(e) => handleInputChange('country', e.target.value)}
                                placeholder="Страна"
                                className="px-3 py-2 bg-white rounded-[5px] outline outline-1 outline-gray-200 text-sm"
                            />
                        </div>
                    </div>

                    {/* Логотип */}
                    <div className="self-stretch flex flex-col gap-2">
                        <span className="text-zinc-900 text-sm font-medium">Логотип пространства</span>
                        <div className="flex flex-col gap-3">
                            <div className="size-28 bg-neutral-100 rounded-md outline outline-2 outline-gray-200 flex justify-center items-center overflow-hidden">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Логотип" className="size-20 rounded-sm object-cover" />
                                ) : (
                                    <div className="size-20 bg-gray-200 rounded-sm" />
                                )}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-1.5">
                                    <label className="px-2.5 py-[5px] bg-gray-50 rounded-[5px] outline outline-1 outline-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                                        <span className="text-zinc-900 text-sm font-medium">
                                            {uploadingLogo ? 'Загрузка...' : 'Загрузить'}
                                        </span>
                                    </label>
                                    {logoPreview && (
                                        <>
                                            <label className="w-20 h-7 px-2.5 bg-gray-50 rounded-[5px] outline outline-1 outline-gray-200 flex justify-center items-center cursor-pointer hover:bg-gray-100">
                                                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                                                <span className="text-zinc-900 text-sm font-medium">Заменить</span>
                                            </label>
                                            <button
                                                onClick={handleLogoRemove}
                                                className="w-20 h-7 px-2.5 bg-gray-50 rounded-[5px] outline outline-1 outline-gray-200 flex justify-center items-center hover:bg-gray-100"
                                            >
                                                <span className="text-red-600 text-sm font-medium">Удалить</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                                <div className="text-gray-500 text-sm">
                                    Рекомендуемый размер: минимум 400 × 400 px<br />
                                    Формат: JPG, PNG
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Обложка */}
                    <div className="self-stretch flex flex-col gap-2">
                        <span className="text-zinc-900 text-sm font-medium">Обложка публичной страницы</span>
                        <div className="flex flex-col gap-3">
                            <div className="w-96 bg-neutral-100 rounded-md outline outline-2 outline-gray-200 flex justify-center items-center overflow-hidden">
                                {bannerPreview ? (
                                    <img src={bannerPreview} alt="Обложка" className="w-60 h-36 object-cover" />
                                ) : (
                                    <div className="w-60 h-36 bg-gray-200" />
                                )}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <label className="w-24 h-7 bg-gray-50 rounded-[5px] outline outline-1 outline-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-100">
                                    <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
                                    <span className="text-zinc-900 text-sm font-medium">
                                        {uploadingBanner ? 'Загрузка...' : 'Загрузить'}
                                    </span>
                                </label>
                                {bannerPreview && (
                                    <>
                                        <label className="w-20 h-7 px-2.5 bg-gray-50 rounded-[5px] outline outline-1 outline-gray-200 flex justify-center items-center cursor-pointer hover:bg-gray-100">
                                            <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
                                            <span className="text-zinc-900 text-sm font-medium">Заменить</span>
                                        </label>
                                        <button
                                            onClick={handleBannerRemove}
                                            className="w-20 h-7 px-2.5 bg-gray-50 rounded-[5px] outline outline-1 outline-gray-200 flex justify-center items-center hover:bg-gray-100"
                                        >
                                            <span className="text-red-600 text-sm font-medium">Удалить</span>
                                        </button>
                                    </>
                                )}
                            </div>
                            <div className="text-gray-500 text-sm">
                                Рекомендуемый размер: минимум 1600 × 500 px<br />
                                Формат: JPG, PNG
                            </div>
                        </div>
                    </div>
                </div>

                {/* Кнопки */}
                <div className="pt-5 flex items-center gap-2.5">
                    <button
                        onClick={onClose}
                        className="px-4 py-3 bg-gray-50 rounded-[5px] outline outline-1 outline-gray-200 hover:bg-gray-100 transition-colors"
                    >
                        <span className="text-zinc-900 text-base font-medium">Отменить</span>
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!isValid || loading}
                        className="px-4 py-3 bg-black rounded-[5px] flex items-center gap-3 hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        <span className="text-white text-base font-medium">
                            {loading ? 'Сохранение...' : 'Сохранить'}
                        </span>
                    </button>
                </div>
            </div>
        </Modal>
    );
};