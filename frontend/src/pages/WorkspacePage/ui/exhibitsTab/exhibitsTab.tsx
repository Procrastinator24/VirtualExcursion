import { useEffect, useState } from 'react';
import { sceneApi } from '../../../../entities/scene';
import { ExhibitsTable } from './exhibitsTable.tsx';
import type { Scene } from '@entities/scene';

interface ExhibitsTabProps {
    workspaceId: number;
    isOwner: boolean;
}

export const ExhibitsTab = ({ workspaceId, isOwner }: ExhibitsTabProps) => {
    const [exhibits, setExhibits] = useState<Scene[]>([]);
    const [loading, setLoading] = useState(true);

    const loadExhibits = async () => {
        setLoading(true);
        try {
            const response = await sceneApi.getByWorkspaceId(workspaceId);
            setExhibits(response.data);
        } catch (error) {
            console.error('Failed to load exhibits:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (workspaceId) {
            loadExhibits();
        }
    }, [workspaceId]);

    if (loading) {
        return (
            <div className="py-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-10 bg-stone-200 rounded w-64" />
                    <div className="h-96 bg-stone-100 rounded" />
                </div>
            </div>
        );
    }

    return (
        <ExhibitsTable
            exhibits={exhibits}
            workspaceId={workspaceId}
            isOwner={isOwner}
            onRefresh={loadExhibits}
        />
    );
};