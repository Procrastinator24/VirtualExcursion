import { useEffect, useState } from 'react';
import { excursionApi } from '../../../../entities/excursion';
import { ExcursionsTable } from './excursionTable.tsx';
import type { ExcursionResponse } from '@entities/excursion/types/excursion';

interface ExcursionsTabProps {
    workspaceId: number;
    isOwner: boolean;
}

export const ExcursionsTab = ({ workspaceId, isOwner }: ExcursionsTabProps) => {
    const [excursions, setExcursions] = useState<ExcursionResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const loadExcursions = async () => {
        setLoading(true);
        try {
            const response = await excursionApi.getByWorkspaceId(workspaceId);
            setExcursions(response.data);
        } catch (error) {
            console.error('Failed to load excursions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (workspaceId) {
            loadExcursions();
        }
    }, [workspaceId]);

    if (loading) {
        return (
            <div className="py-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-10 bg-stone-200 rounded w-64" />
                    <div className="h-64 bg-stone-100 rounded" />
                </div>
            </div>
        );
    }

    return (
        <ExcursionsTable
            excursions={excursions}
            workspaceId={workspaceId}
            isOwner={isOwner}
            onRefresh={loadExcursions}
        />
    );
};