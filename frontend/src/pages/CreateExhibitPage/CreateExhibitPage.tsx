import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CreateExhibitTabs } from './ui/CreateExhibitTabs';
import { BasicInfoStep } from './ui/BasicInfoStep';
import { UploadMaterialStep } from './ui/UploadMaterialStep';
import { ExhibitDetailsStep } from './ui/ExhibitDetailsStep';
import { sceneApi } from '@entities/scene';

export type CreateStep = 'basic' | 'upload' | 'details';
export type ContentType = 'image' | 'video' | 'panorama' | '3d';

export interface ExhibitFormData {
    title: string;
    description: string;
    thumbnailUrl?: string;
    contentType: ContentType;
    // Для 3D модели
    modelUrl?: string;
    modelFormat?: string;
    // Для изображения/видео/панорамы
    mediaUrl?: string;
    cameraStartX?: number;
    cameraStartY?: number;
    cameraStartZ?: number;
    cameraTargetX?: number;
    cameraTargetY?: number;
    cameraTargetZ?: number;
    ambientLightIntensity?: number;
    enableVR?: boolean;
    // Общие поля
    period?: string;
    region?: string;
}

export const CreateExhibitPage = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<CreateStep>('basic');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<ExhibitFormData>({
        title: '',
        description: '',
        thumbnailUrl: '',
        contentType: '3d',
        period: '',
        region: '',
    });

    const updateFormData = (data: Partial<ExhibitFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const handleNext = () => {
        if (currentStep === 'basic') setCurrentStep('upload');
        else if (currentStep === 'upload') setCurrentStep('details');
    };

    const handleBack = () => {
        if (currentStep === 'upload') setCurrentStep('basic');
        else if (currentStep === 'details') setCurrentStep('upload');
        else navigate(-1);
    };

    const handleSaveAsDraft = async () => {
        setLoading(true);
        try {
            // TODO: сохранить как черновик
            await sceneApi.create({
                ...formData,
                isPublished: false,
            });
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to save draft:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async () => {
        setLoading(true);
        try {
            await sceneApi.create({
                ...formData,
                isPublished: true,
            });
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to publish:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-[1280px] mx-auto px-20 py-8">
            {/* Header with back button */}
            <div className="flex items-center gap-3 mb-8">
                <button
                    onClick={handleBack}
                    className="p-1 hover:bg-stone-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-stone-500" />
                </button>
                <h1 className="text-stone-900 text-2xl font-semibold">
                    Создать экспонат
                </h1>
            </div>

            <div className="flex gap-6">
                <CreateExhibitTabs currentStep={currentStep} onStepChange={setCurrentStep} />

                <div className="flex-1">
                    {currentStep === 'basic' && (
                        <BasicInfoStep
                            data={formData}
                            onChange={updateFormData}
                            onNext={handleNext}
                        />
                    )}
                    {currentStep === 'upload' && (
                        <UploadMaterialStep
                            data={formData}
                            onChange={updateFormData}
                            onNext={handleNext}
                            onBack={handleBack}
                        />
                    )}
                    {currentStep === 'details' && (
                        <ExhibitDetailsStep
                            data={formData}
                            onChange={updateFormData}
                            onSaveAsDraft={handleSaveAsDraft}
                            onPublish={handlePublish}
                            onBack={handleBack}
                            loading={loading}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateExhibitPage;