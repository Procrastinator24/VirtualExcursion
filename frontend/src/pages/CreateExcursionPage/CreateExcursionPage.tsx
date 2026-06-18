import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CreateExcursionTabs } from './ui/CreateExcursionTabs';
import { BasicInfoStep } from './ui/BasicInfoStep';
import { AddScenesStep } from './ui/AddScenesStep';
import { ExcursionDetailsStep } from './ui/ExcursionDetailsStep';
import { excursionApi } from '@entities/excursion';
import type { CreateExcursionRequest, UpdateExcursionRequest } from '@entities/excursion';
import { Tag } from '@entities/tags';

export type CreateStep = 'basic' | 'scenes' | 'details';

export interface ExcursionFormData {
    title: string;
    description: string;
    thumbnailUrl?: string;
    sceneIds: number[];
    sceneOrder: number[];
    duration?: string;
    period?: string;
    region?: string;
    tags: number[];
}

export const CreateExcursionPage = () => {
    const [searchParams] = useSearchParams();
    const { id } = useParams<{ id: string }>(); // ID экскурсии для редактирования
    const workspaceId = searchParams.get('workspaceId');

    const workspaceIdNumber = workspaceId ? parseInt(workspaceId) : null;
    const excursionId = id ? parseInt(id) : null;
    const isEditMode = !!excursionId;

    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<CreateStep>('basic');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);
    const [formData, setFormData] = useState<ExcursionFormData>({
        title: '',
        description: '',
        thumbnailUrl: '',
        sceneIds: [],
        sceneOrder: [],
        duration: '',
        period: '',
        region: '',
        tags: [],
    });

    // Загрузка данных при редактировании
    useEffect(() => {
        if (!isEditMode || !excursionId) return;

        const loadExcursion = async () => {
            try {
                const response = await excursionApi.getById(excursionId);
                const excursion = response.data;

                setFormData({
                    title: excursion.title,
                    description: excursion.description || '',
                    thumbnailUrl: excursion.thumbnailUrl,
                    sceneIds: excursion.scenes?.map(s => s.sceneId) || [],
                    sceneOrder: excursion.scenes?.map(s => s.sceneId) || [],
                    duration: excursion.duration,
                    period: excursion.period || '',
                    region: excursion.region || '',
                    tags: excursion.tags?.map(t => t.id) || [],
                });
            } catch (error) {
                console.error('Failed to load excursion:', error);
                navigate(-1);
            } finally {
                setInitialLoading(false);
            }
        };

        loadExcursion();
    }, [excursionId, isEditMode, navigate]);

    const updateFormData = (data: Partial<ExcursionFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const handleNext = () => {
        if (currentStep === 'basic') setCurrentStep('scenes');
        else if (currentStep === 'scenes') setCurrentStep('details');
    };

    const handleBack = () => {
        if (currentStep === 'scenes') setCurrentStep('basic');
        else if (currentStep === 'details') setCurrentStep('scenes');
        else navigate(-1);
    };

    const handleSaveAsDraft = async () => {
        setLoading(true);
        try {
            if (isEditMode && excursionId) {
                // Обновление существующей экскурсии
                await excursionApi.update({
                    id: excursionId,
                    ...formData,
                    isPublished: false,
                } as UpdateExcursionRequest);
                navigate(`/excursion/${excursionId}`);
            } else {
                // Создание новой
                await excursionApi.create({
                    ...formData,
                    isPublished: false,
                    workspaceId: workspaceIdNumber,
                } as CreateExcursionRequest);
                navigate(`/workspace/${workspaceIdNumber}`);
        }
        } catch (error) {
            console.error('Failed to save draft:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async () => {
        setLoading(true);
        try {
            if (isEditMode && excursionId) {
                // Обновление существующей экскурсии
                await excursionApi.update({
                    id: excursionId,
                    ...formData,
                    isPublished: true,
                } as UpdateExcursionRequest);
                navigate(`/excursion/${excursionId}`);
            } else {
                // Создание новой
                await excursionApi.create({
                    ...formData,
                    isPublished: true,
                    workspaceId: workspaceIdNumber,
                } as CreateExcursionRequest);
                navigate(`/workspace/${workspaceIdNumber}`);
            }
        } catch (error) {
            console.error('Failed to publish:', error);
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                <div className="animate-pulse text-stone-500">Загрузка данных экскурсии...</div>
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
                    {isEditMode ? 'Редактировать экскурсию' : 'Создать новую экскурсию'}
                </h1>
                    </div>

            <div className="flex gap-6">
                <CreateExcursionTabs currentStep={currentStep} onStepChange={setCurrentStep} />

                <div className="flex-1">
                    {currentStep === 'basic' && (
                        <BasicInfoStep
                            data={formData}
                            onChange={updateFormData}
                            onNext={handleNext}
                            //isEditMode={isEditMode}
                                />
                                )}
                    {currentStep === 'scenes' && (
                        <AddScenesStep
                            selectedSceneIds={formData.sceneIds}
                            sceneOrder={formData.sceneOrder}
                            onChange={updateFormData}
                            onNext={handleNext}
                            onBack={handleBack}
                        />
            )}
                    {currentStep === 'details' && (
                        <ExcursionDetailsStep
                            data={formData}
                            onChange={updateFormData}
                            onSaveAsDraft={handleSaveAsDraft}
                            onPublish={handlePublish}
                            onBack={handleBack}
                            loading={loading}
                            //isEditMode={isEditMode}
                        />
                        )}
                    </div>
                </div>
        </div>
    );
};

export default CreateExcursionPage;