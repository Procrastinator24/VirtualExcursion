import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CreateExhibitTabs } from './ui/CreateExhibitTabs';
import { BasicInfoStep } from './ui/BasicInfoStep';
import { UploadMaterialStep } from './ui/UploadMaterialStep';
import { ExhibitDetailsStep } from './ui/ExhibitDetailsStep';
import { sceneApi } from '@entities/scene';
import type { CreateSceneRequest, ContentType } from '../../entities/scene/types/scene';

export type CreateStep = 'basic' | 'upload' | 'details';

export const CreateExhibitPage = () => {
    const [searchParams] = useSearchParams();
    const workspaceId = searchParams.get('workspaceId');
    const workspaceIdNumber = workspaceId ? parseInt(workspaceId) : null;

    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<CreateStep>('basic');
    const [loading, setLoading] = useState(false);

    // Инициализируем formData с пустыми значениями
    const [formData, setFormData] = useState<CreateSceneRequest>({
        title: '',
        description: '',
        thumbnailUrl: '',
        contentType: '3d',
        workspaceId: workspaceIdNumber || 0,
        isPublished: false,
        period: '',
        region: '',
        tagIds: [],
        // 3D
        modelUrl: '',
        modelFormat: 'glb',
        cameraStartX: 0,
        cameraStartY: 0,
        cameraStartZ: 5,
        cameraTargetX: 0,
        cameraTargetY: 0,
        cameraTargetZ: 0,
        ambientLightIntensity: 0.7,
        enableVR: false,
        pointsOfInterest: [],
        // Media
        mediaUrl: '',
        durationSeconds: 0,
        // Excursions
        excursionIds: [],
    });

    const updateFormData = (data: Partial<CreateSceneRequest>) => {
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
        if (!workspaceIdNumber) {
            alert('Не указано рабочее пространство');
            return;
        }

        setLoading(true);
        try {
            const request: CreateSceneRequest = {
                ...formData,
                workspaceId: workspaceIdNumber,
                isPublished: false,
            };

            await sceneApi.create(request);
            navigate(`/workspace/${workspaceIdNumber}`);
        } catch (error) {
            console.error('Failed to save draft:', error);
            alert('Не удалось сохранить черновик');
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async () => {
        if (!workspaceIdNumber) {
            alert('Не указано рабочее пространство');
            return;
        }

        setLoading(true);
        try {
            const request: CreateSceneRequest = {
                title: formData.title,
                description: formData.description,
                thumbnailUrl: formData.thumbnailUrl,
                contentType: formData.contentType,
                workspaceId: workspaceIdNumber,
                isPublished: true,
                period: formData.period,
                region: formData.region,
                tagIds: formData.tagIds,
                excursionIds: formData.excursionIds,

                // Для 3D
                modelUrl: formData.modelUrl,
                modelFormat: formData.modelFormat,
                cameraStartX: formData.cameraStartX,
                cameraStartY: formData.cameraStartY,
                cameraStartZ: formData.cameraStartZ,
                cameraTargetX: formData.cameraTargetX,
                cameraTargetY: formData.cameraTargetY,
                cameraTargetZ: formData.cameraTargetZ,
                ambientLightIntensity: formData.ambientLightIntensity,
                enableVR: formData.enableVR,
                pointsOfInterest: formData.pointsOfInterest?.map(poi => ({
                    title: poi.title,
                    description: poi.description,
                    x: poi.x,
                    y: poi.y,
                    z: poi.z,
                    imageUrl: poi.imageUrl,
                })),

                // Для Image/Video/Panorama
                mediaUrl: formData.mediaUrl,

                // Для Video
                durationSeconds: formData.durationSeconds,
            };

            const response = await sceneApi.create(request);
            console.log('Scene created:', response.data);
            navigate(`/workspace/${workspaceIdNumber}`);
        } catch (error) {
            console.error('Failed to create scene:', error);
            alert('Не удалось создать экспонат');
        } finally {
            setLoading(false);
        }
    };

    // Если нет workspaceId — показываем ошибку
    if (!workspaceIdNumber) {
        return (
            <div className="max-w-[1280px] mx-auto px-20 py-20 text-center">
                <p className="text-stone-500">Не указано рабочее пространство</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 text-stone-600 underline"
                >
                    Вернуться назад
                </button>
            </div>
        );
    }

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