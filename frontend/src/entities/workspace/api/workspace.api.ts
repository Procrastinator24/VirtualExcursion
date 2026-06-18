import { baseApi } from "@app/api/base.ts";
import type {
    WorkspaceResponse,
    CreateWorkspaceRequest,
    UpdateWorkspaceRequest,
} from '../types/workspace';
import type {
    WorkspaceMemberResponse,
    AddWorkspaceMemberRequest,
    UpdateWorkspaceMemberRoleRequest,
} from '../types/workspaceMember';

export const workspaceApi = {
    // ============ Workspace CRUD ============

    /**
     * Получить все рабочие пространства (только для админов)
     */
    getAll: () =>
        baseApi.get<WorkspaceResponse[]>('/Workspace'),

    /**
     * Получить рабочее пространство по ID
     */
    getById: (id: number) =>
        baseApi.get<WorkspaceResponse>(`/Workspace/${id}`),

    /**
     * Получить мои рабочие пространства (где я владелец или участник)
     */
    getMy: () =>
        baseApi.get<WorkspaceResponse[]>('/Workspace/my'),

    /**
     * Создать новое рабочее пространство
     */
    create: (data: CreateWorkspaceRequest) =>
        baseApi.post<WorkspaceResponse>('/workspace', data),

    /**
     * Обновить рабочее пространство
     */
    update: (data: UpdateWorkspaceRequest) =>
        baseApi.put<WorkspaceResponse>('/workspace', data),

    /**
     * Удалить рабочее пространство
     */
    delete: (id: number) =>
        baseApi.delete<void>(`/workspace/${id}`),

    /**
     * Проверить, является ли пользователь владельцем
     */
    isOwner: (workspaceId: number) =>
        baseApi.get<boolean>(`/workspace/${workspaceId}/is-owner`),

    /**
     * Проверить, является ли пользователь участником
     */
    isMember: (workspaceId: number) =>
        baseApi.get<boolean>(`/workspace/${workspaceId}/is-member`),

    // ============ Workspace Members ============

    /**
     * Получить всех участников пространства
     */
    getMembers: (workspaceId: number) =>
        baseApi.get<WorkspaceMemberResponse[]>(`/workspace/${workspaceId}/member`),

    /**
     * Получить участника по ID пользователя
     */
    getMember: (workspaceId: number, userId: number) =>
        baseApi.get<WorkspaceMemberResponse>(`/workspace/${workspaceId}/member/${userId}`),

    /**
     * Добавить участника в пространство
     */
    addMember: (workspaceId: number, data: AddWorkspaceMemberRequest) =>
        baseApi.post<WorkspaceMemberResponse>(`/workspace/${workspaceId}/member`, data),

    /**
     * Обновить роль участника
     */
    updateMemberRole: (workspaceId: number, userId: number, data: UpdateWorkspaceMemberRoleRequest) =>
        baseApi.put<WorkspaceMemberResponse>(`/workspace/${workspaceId}/member/${userId}/role`, data),

    /**
     * Удалить участника из пространства
     */
    removeMember: (workspaceId: number, userId: number) =>
        baseApi.delete<void>(`/workspace/${workspaceId}/member/${userId}`),

    uploadThumbnail: (formData: FormData) =>
        baseApi.post<{ url: string }>('/workspace/upload-thumbnail', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    uploadBanner: (formData: FormData) =>
        baseApi.post<{ url: string }>('/workspace/upload-banner', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
};