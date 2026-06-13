import { MapPin, Globe } from 'lucide-react';
import { ImageWithFallback } from '@shared/ui/imgWrapper/ImageWithFallback';
import { VerificationBadge } from '@shared/ui/VerificationBadge/StatusBadge.tsx';
import type { WorkspaceResponse } from '@entities/workspace';

interface WorkspaceHeaderProps {
    workspace: WorkspaceResponse;
}

export const WorkspaceHeader = ({ workspace }: WorkspaceHeaderProps) => {
    return (
        <div className="relative pl-48 pr-10 pt-8 pb-6 bg-white rounded-xl outline outline-1 outline-stone-200 -mt-7">
            {/* Аватар */}
            <div className="absolute -top-8 left-0">
                <ImageWithFallback
                    src={workspace.logoUrl || '/workspace-placeholder.jpg'}
                    alt={workspace.name}
                    className="w-36 h-36 rounded-full object-cover border-4 border-white"
                />
            </div>

            <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-black text-3xl font-semibold">
                        {workspace.name}
                    </h1>
                    <VerificationBadge status={workspace.verificationStatus} />
                </div>

                <p className="text-black text-base leading-6 mb-4 max-w-[600px]">
                    {workspace.descriptionLong || workspace.descriptionShort || 'Описание пространства'}
                </p>

                <div className="flex items-center gap-4">
                    {workspace.address && (
                        <div className="flex items-center gap-1">
                            <MapPin className="w-5 h-5 text-black" />
                            <span className="text-black text-base font-semibold">
                                {workspace.address}
                            </span>
                        </div>
                    )}
                    {workspace.website && (
                        <div className="flex items-center gap-1">
                            <Globe className="w-5 h-5 text-black" />
                            <a
                                href={workspace.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-black text-base font-semibold hover:underline"
                            >
                                {workspace.website.replace(/^https?:\/\//, '')}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};