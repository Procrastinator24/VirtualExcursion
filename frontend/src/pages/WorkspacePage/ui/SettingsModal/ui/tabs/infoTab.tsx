import { useState } from 'react';
import { workspaceApi } from '@entities/workspace';
import {ImageWithFallback} from "../../../../../../shared/ui/imgWrapper/ImageWithFallback.tsx";

interface InfoTabProps {
    initialData?: {
        name: string;
        shortDescription: string;
        website: string;
        phone: string;
        address: string;
        city: string;
        country: string;
        logoUrl?: string;
        bannerUrl?: string;
    };
    onSave?: (data: any) => void;
    saving?: boolean;
}

export const InfoTab = ({ initialData, onSave, saving }: InfoTabProps) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        shortDescription: initialData?.shortDescription || '',
        website: initialData?.website || '',
        phone: initialData?.phone || '',
        address: initialData?.address || '',
        city: initialData?.city || '',
        country: initialData?.country || '',
        logoUrl: initialData?.logoUrl || '',
        bannerUrl: initialData?.bannerUrl || '',
    });

    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.logoUrl || null);
    const [coverPreview, setCoverPreview] = useState<string | null>(initialData?.bannerUrl || null);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Показываем локальное превью сразу
        const localPreview = URL.createObjectURL(file);
        setLogoPreview(localPreview);
        setUploadingLogo(true);
        console.log("tryUploadLOGO")
        try {
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);
            const response = await workspaceApi.uploadThumbnail(uploadFormData);
            const uploadedUrl = response.data.url;
            console.log(uploadedUrl)
            // Сохраняем URL от сервера в formData
            setFormData(prev => ({ ...prev, logoUrl: uploadedUrl }));
            // Обновляем превью на URL от сервера (опционально, можно оставить локальное)
            setLogoPreview(uploadedUrl);
        } catch (error) {
            console.error('Failed to upload logo:', error);
            // В случае ошибки — удаляем превью
            setLogoPreview(initialData?.logoUrl || null);
        } finally {
            setUploadingLogo(false);
        }
    };

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Показываем локальное превью сразу
        const localPreview = URL.createObjectURL(file);
        setCoverPreview(localPreview);
        setUploadingCover(true);

        try {
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);
            const response = await workspaceApi.uploadBanner(uploadFormData);
            const uploadedUrl = response.data.url;

            // Сохраняем URL от сервера в formData
            setFormData(prev => ({ ...prev, bannerUrl: uploadedUrl }));
            // Обновляем превью на URL от сервера
            setCoverPreview(uploadedUrl);
        } catch (error) {
            console.error('Failed to upload cover:', error);
            // В случае ошибки — удаляем превью
            setCoverPreview(initialData?.bannerUrl || null);
        } finally {
            setUploadingCover(false);
        }
    };

    const handleLogoRemove = () => {
        setLogoPreview(null);
        setFormData(prev => ({ ...prev, logoUrl: '' }));
    };

    const handleCoverRemove = () => {
        setCoverPreview(null);
        setFormData(prev => ({ ...prev, bannerUrl: '' }));
    };

    const handleSave = () => {
        onSave?.(formData);
    };

    return (
        <div className="inline-flex flex-col justify-start items-start gap-5">
            {/* Заголовок секции */}
            <div className="self-stretch flex flex-col justify-start items-start gap-1">
                <div className="justify-start text-zinc-900 text-xl font-semibold font-['Inter'] leading-7">
                    Основная информация
                </div>
                <div className="justify-start text-gray-500 text-base font-normal font-['Inter'] leading-6">
                    Базовые данные о вашем пространстве
                </div>
            </div>

            {/* Форма */}
            <div className="w-[640px] flex flex-col justify-start items-start gap-5">
                {/* Название */}
                <div className="w-96 flex flex-col justify-start items-start gap-2">
                    <label className="justify-start text-zinc-900 text-sm font-medium font-['Inter'] leading-5">
                        Название
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Название пространства"
                        className="self-stretch px-3 py-2 bg-white rounded-[5px] outline outline-1 outline-offset-[-1px] outline-gray-200 text-sm font-normal font-['Inter'] leading-5"
                    />
                </div>

                {/* Краткое описание */}
                <div className="flex flex-col justify-start items-start gap-2">
                    <label className="justify-start text-zinc-900 text-sm font-medium font-['Inter'] leading-5">
                        Краткое описание
                    </label>
                    <textarea
                        value={formData.shortDescription}
                        onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                        rows={3}
                        className="w-96 px-3 py-2 bg-white rounded-[5px] outline outline-1 outline-offset-[-1px] outline-gray-200 text-sm font-normal font-['Inter'] leading-6 resize-none"
                    />
                    <div className="text-gray-500 text-sm font-normal font-['Inter'] leading-5">
                        Отображается в карточке музея
                    </div>
                </div>

                {/* Веб-сайт */}
                <div className="w-96 flex flex-col justify-start items-start gap-2">
                    <label className="justify-start text-zinc-900 text-sm font-medium font-['Inter'] leading-5">
                        Веб-сайт
                    </label>
                    <input
                        type="text"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://..."
                        className="self-stretch px-3 py-2 bg-white rounded-[5px] outline outline-1 outline-offset-[-1px] outline-gray-200 text-sm font-normal font-['Inter'] leading-5"
                    />
                </div>

                {/* Телефон */}
                <div className="w-96 flex flex-col justify-start items-start gap-2">
                    <label className="justify-start text-zinc-900 text-sm font-medium font-['Inter'] leading-5">
                        Телефон
                    </label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+7 (XXX) XXX-XX-XX"
                        className="self-stretch px-3 py-2 bg-white rounded-[5px] outline outline-1 outline-offset-[-1px] outline-gray-200 text-sm font-normal font-['Inter'] leading-5"
                    />
                </div>

                {/* Адрес */}
                <div className="w-96 flex flex-col justify-start items-start gap-2">
                    <label className="justify-start text-zinc-900 text-sm font-medium font-['Inter'] leading-5">
                        Адрес
                    </label>
                    <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Улица, дом"
                        className="self-stretch px-3 py-2 bg-white rounded-[5px] outline outline-1 outline-offset-[-1px] outline-gray-200 text-sm font-normal font-['Inter'] leading-5"
                    />
                </div>

                {/* Город и страна */}
                <div className="self-stretch inline-flex justify-start items-start gap-4">
                    <div className="w-44 flex flex-col justify-start items-start gap-2">
                        <label className="justify-start text-zinc-900 text-sm font-medium font-['Inter'] leading-5">
                            Город
                        </label>
                        <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            placeholder="Город"
                            className="self-stretch px-3 py-2 bg-white rounded-[5px] outline outline-1 outline-offset-[-1px] outline-gray-200 text-sm font-normal font-['Inter'] leading-5"
                        />
                    </div>
                    <div className="w-44 flex flex-col justify-start items-start gap-2">
                        <label className="justify-start text-zinc-900 text-sm font-medium font-['Inter'] leading-5">
                            Страна
                        </label>
                        <input
                            type="text"
                            value={formData.country}
                            onChange={(e) => handleInputChange('country', e.target.value)}
                            placeholder="Страна"
                            className="self-stretch px-3 py-2 bg-white rounded-[5px] outline outline-1 outline-offset-[-1px] outline-gray-200 text-sm font-normal font-['Inter'] leading-5"
                        />
                    </div>
                </div>

                {/* Логотип */}
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <label className="justify-start text-zinc-900 text-sm font-medium font-['Inter'] leading-5">
                        Логотип пространства
                    </label>
                    <div className="self-stretch flex flex-col justify-start items-start gap-3">
                        <div className="size-28 px-3 bg-neutral-100 rounded-md outline outline-2 outline-offset-[-2px] outline-gray-200 inline-flex justify-center items-center">
                            {logoPreview ? (
                                <ImageWithFallback src={logoPreview} alt="Логотип" className="size-20 rounded-sm object-cover" />
                            ) : (
                                <div className="size-20 bg-gray-200 rounded-sm" />
                            )}
                        </div>
                        <div className="flex flex-col justify-start items-start gap-1.5">
                            <div className="h-7 inline-flex justify-start items-center gap-1.5">
                                <label className="size- px-2.5 py-[5px] bg-gray-50 rounded-[5px] outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-start items-center gap-1.5 cursor-pointer hover:bg-gray-100 transition-colors">
                                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                                    <div className="text-center justify-start text-zinc-900 text-sm font-medium font-['Inter'] leading-5">
                                        {uploadingLogo ? 'Загрузка...' : 'Загрузить'}
                                    </div>
                                </label>
                                {logoPreview && (
                                    <>
                                        <label className="w-20 h-7 px-2.5 bg-gray-50 rounded-[5px] outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-center items-center gap-1.5 cursor-pointer hover:bg-gray-100 transition-colors">
                                            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                                            <span className="text-center justify-start text-zinc-900 text-sm font-medium font-['Inter'] leading-5">
                                                Заменить
                                            </span>
                                        </label>
                                        <button
                                            onClick={handleLogoRemove}
                                            className="w-20 h-7 px-2.5 bg-gray-50 rounded-[5px] outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-center items-center gap-1.5 hover:bg-gray-100 transition-colors"
                                        >
                                            <span className="text-center justify-start text-red-600 text-sm font-medium font-['Inter'] leading-5">
                                                Удалить
                                            </span>
                                        </button>
                                    </>
                                )}
                            </div>
                            <div className="text-gray-500 text-sm font-normal font-['Inter'] leading-5">
                                Рекомендуемый размер: минимум 400 × 400 px<br />
                                Формат: JPG, PNG
                            </div>
                        </div>
                    </div>
                </div>

                {/* Обложка */}
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <label className="justify-start text-zinc-900 text-sm font-medium font-['Inter'] leading-5">
                        Обложка публичной страницы
                    </label>
                    <div className="flex flex-col justify-start items-start gap-3">
                        <div className="w-96 bg-neutral-100 rounded-md outline outline-2 outline-offset-[-2px] outline-gray-200 inline-flex justify-center items-center overflow-hidden">
                            {coverPreview ? (
                                <ImageWithFallback src={coverPreview} alt="Обложка" className="w-60 h-36 object-cover" />
                            ) : (
                                <div className="w-60 h-36 bg-gray-200" />
                            )}
                        </div>
                        <div className="h-7 inline-flex justify-start items-center gap-1.5">
                            <label className="w-24 h-7 relative bg-gray-50 rounded-[5px] outline outline-1 outline-offset-[-1px] outline-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                                <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                                <span className="text-center justify-start text-zinc-900 text-sm font-medium font-['Inter'] leading-4">
                                    {uploadingCover ? 'Загрузка...' : 'Загрузить'}
                                </span>
                            </label>
                            {coverPreview && (
                                <>
                                    <label className="w-20 h-7 px-2.5 bg-gray-50 rounded-[5px] outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-center items-center gap-1.5 cursor-pointer hover:bg-gray-100 transition-colors">
                                        <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                                        <span className="text-center justify-start text-zinc-900 text-sm font-medium font-['Inter'] leading-4">
                                            Заменить
                                        </span>
                                    </label>
                                    <button
                                        onClick={handleCoverRemove}
                                        className="w-20 h-7 px-2.5 bg-gray-50 rounded-[5px] outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-center items-center gap-1.5 hover:bg-gray-100 transition-colors"
                                    >
                                        <span className="text-center justify-start text-red-600 text-sm font-medium font-['Inter'] leading-4">
                                            Удалить
                                        </span>
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="text-gray-500 text-sm font-normal font-['Inter'] leading-5">
                            Рекомендуемый размер: минимум 1600 × 500 px<br />
                            Формат: JPG, PNG
                        </div>
                    </div>
                </div>
            </div>

            {/* Кнопки */}
            <div className="pt-5 inline-flex justify-start items-center gap-2.5">
                <button
                    onClick={() => {
                        // Сброс к исходным данным
                        setFormData({
                            name: initialData?.name || '',
                            shortDescription: initialData?.shortDescription || '',
                            website: initialData?.website || '',
                            phone: initialData?.phone || '',
                            address: initialData?.address || '',
                            city: initialData?.city || '',
                            country: initialData?.country || '',
                            logoUrl: initialData?.logoUrl || '',
                            bannerUrl: initialData?.bannerUrl || '',
                        });
                        setLogoPreview(initialData?.logoUrl || null);
                        setCoverPreview(initialData?.bannerUrl || null);
                    }}
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