export type WorkspaceRole = 'viewer' | 'editor' | 'admin';

export type InvitationStatus = 'pending' | 'accepted' | 'declined';

export interface WorkspaceMemberResponse {
    workspaceId: number;
    userId: number;
    userName: string;
    userEmail: string;
    userAvatarUrl?: string;
    role: WorkspaceRole;
    joinedAt: string;
    invitedById?: number;
    invitedByName?: string;
    invitationStatus?: InvitationStatus;
}

export interface AddWorkspaceMemberRequest {
    workspaceId: number;
    userId: number;
    role?: WorkspaceRole;
}

export interface UpdateWorkspaceMemberRoleRequest {
    workspaceId: number;
    userId: number;
    role: WorkspaceRole;
}