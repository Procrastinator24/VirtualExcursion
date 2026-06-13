import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { workspaceApi, WorkspaceResponse } from '@entities/workspace';
import { excursionApi, ExcursionResponse } from '@entities/excursion';
import { sceneApi, SceneResponse } from '@entities/scene';
import { WorkspaceHeader } from './WorkspaceHeader';
import { ExcursionsSection } from './ExcursionSection';
import { ExhibitsSection } from './ExhibitsSection';
import { ImageWithFallback } from '@shared/ui/imgWrapper/ImageWithFallback';

export const WorkspacePublicPage = () => {
    const { id } = useParams<{ id: string }>();
    const [workspace, setWorkspace] = useState<WorkspaceResponse | null>(null);
    const [excursions, setExcursions] = useState<ExcursionResponse[]>([]);
    const [exhibits, setExhibits] = useState<SceneResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [excursionsLimit, setExcursionsLimit] = useState(4);
    const [exhibitsLimit, setExhibitsLimit] = useState(20);
    const [showAllExcursions, setShowAllExcursions] = useState(false);
    const [showAllExhibits, setShowAllExhibits] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const workspaceId = parseInt(id);

                const workspaceRes = await workspaceApi.getById(workspaceId);
                setWorkspace(workspaceRes.data);

                const excursionsRes = await excursionApi.getByWorkspaceId(workspaceId, true);
                setExcursions(excursionsRes.data);

                const exhibitsRes = await sceneApi.getByWorkspaceId(workspaceId, true);
                setExhibits(exhibitsRes.data);
            } catch (error) {
                console.error('Failed to load workspace data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    const displayedExcursions = showAllExcursions ? excursions : excursions.slice(0, excursionsLimit);
    const displayedExhibits = showAllExhibits ? exhibits : exhibits.slice(0, exhibitsLimit);

    const handleShowMoreExcursions = () => {
        if (excursions.length > excursionsLimit && !showAllExcursions) {
            setShowAllExcursions(true);
        }
    };

    const handleShowMoreExhibits = () => {
        if (exhibits.length > exhibitsLimit && !showAllExhibits) {
            setShowAllExhibits(true);
        }
    };

    if (loading) {
        return (
            <div className="max-w-[1280px] mx-auto px-20 py-8">
                <div className="animate-pulse">
                    <div className="h-96 bg-stone-200 rounded-xl mb-6" />
                    <div className="h-32 bg-stone-200 rounded-xl mb-6" />
                    <div className="grid grid-cols-4 gap-5">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-64 bg-stone-200 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!workspace) {
        return (
            <div className="text-center py-20">
                <p className="text-stone-500">Пространство не найдено</p>
            </div>
        );
    }

    return (
        <div className="bg-white">
            {/* Hero Image — на всю ширину экрана, без наложения */}
            <div className="w-full h-96 overflow-hidden">
                <ImageWithFallback
                    src={workspace.bannerUrl || 'https://placehold.co/1920x440'}
                    alt={workspace.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Контент — центрированный контейнер, без наложения */}
            <div className="max-w-[1280px] mx-auto px-20 py-8">
                {/* Header с информацией о пространстве */}
                <WorkspaceHeader workspace={workspace} />

                {/* Экскурсии */}
                {excursions.length > 0 && (
                    <ExcursionsSection
                        excursions={displayedExcursions}
                        totalCount={excursions.length}
                        onShowMore={handleShowMoreExcursions}
                        showMoreVisible={!showAllExcursions && excursions.length > excursionsLimit}
                    />
                )}

                {/* Экспонаты */}
                {exhibits.length > 0 && (
                    <ExhibitsSection
                        exhibits={displayedExhibits}
                        totalCount={exhibits.length}
                        onShowMore={handleShowMoreExhibits}
                        showMoreVisible={!showAllExhibits && exhibits.length > exhibitsLimit}
                    />
                )}
            </div>
        </div>
    );
};

export default WorkspacePublicPage;