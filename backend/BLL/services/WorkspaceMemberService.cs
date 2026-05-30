using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.BLL.DTO.Requests.workspace;
using VirtualExcursion.BLL.DTO.Responses;
using VirtualExcursion.BLL.services.interfaces;
using VirtualExcursion.DAL.models;
using VirtualExcursion.DAL.Repositories.interfaces;

namespace VirtualExcursion.BLL.services
{
    public class WorkspaceMemberService : IWorkspaceMemberService
    {
        private readonly IWorkspaceMemberRepository _memberRepository;
        private readonly IWorkspaceRepository _workspaceRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public WorkspaceMemberService(
            IWorkspaceMemberRepository memberRepository,
            IWorkspaceRepository workspaceRepository,
            IUserRepository userRepository,
            IMapper mapper)
        {
            _memberRepository = memberRepository;
            _workspaceRepository = workspaceRepository;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<List<WorkspaceMemberResponse>> GetMembers(int workspaceId)
        {
            var members = await _memberRepository.GetByWorkspaceId(workspaceId);
            return _mapper.Map<List<WorkspaceMemberResponse>>(members);
        }

        public async Task<WorkspaceMemberResponse?> GetMember(int workspaceId, int userId)
        {
            var member = await _memberRepository.GetByWorkspaceAndUser(workspaceId, userId);
            return member != null ? _mapper.Map<WorkspaceMemberResponse>(member) : null;
        }

        public async Task<WorkspaceMemberResponse> AddMember(AddWorkspaceMemberRequest request, int invitedById)
        {
            // Проверяем, существует ли workspace
            if (!await _workspaceRepository.Exists(request.WorkspaceId))
                throw new KeyNotFoundException($"Workspace с id {request.WorkspaceId} не найден");

            // Проверяем, существует ли пользователь
            //if (!await _userRepository.Exists(request.UserId))
            //    throw new KeyNotFoundException($"Пользователь с id {request.UserId} не найден");

            // Проверяем, не является ли пользователь уже участником
            if (await _memberRepository.IsMember(request.WorkspaceId, request.UserId))
                throw new InvalidOperationException("Пользователь уже является участником этого пространства");

            // Преобразуем строку роли в enum
            var role = request.Role.ToLower() switch
            {
                "admin" => WorkspaceRole.Admin,
                "editor" => WorkspaceRole.Editor,
                "viewer" => WorkspaceRole.Viewer,
                _ => WorkspaceRole.Viewer
            };

            var member = new WorkspaceMember
            {
                WorkspaceId = request.WorkspaceId,
                UserId = request.UserId,
                Role = role,
                InvitedById = invitedById,
                InvitationStatus = InvitationStatus.Accepted,
                JoinedAt = DateTime.UtcNow
            };

            var created = await _memberRepository.Add(member);
            return _mapper.Map<WorkspaceMemberResponse>(created);
        }

        public async Task<WorkspaceMemberResponse> UpdateRole(UpdateWorkspaceMemberRoleRequest request)
        {
            var role = request.Role.ToLower() switch
            {
                "admin" => WorkspaceRole.Admin,
                "editor" => WorkspaceRole.Editor,
                "viewer" => WorkspaceRole.Viewer,
                _ => throw new ArgumentException($"Некорректная роль: {request.Role}")
            };

            var member = await _memberRepository.GetByWorkspaceAndUser(request.WorkspaceId, request.UserId);
            if (member == null)
                throw new KeyNotFoundException("Участник не найден");

            member.Role = role;
            member.UpdatedAt = DateTime.UtcNow;

            var updated = await _memberRepository.UpdateRole(member);
            return _mapper.Map<WorkspaceMemberResponse>(updated);
        }

        public async Task<bool> RemoveMember(int workspaceId, int userId)
        {
            // Нельзя удалить владельца
            if (await _workspaceRepository.IsOwner(workspaceId, userId))
                throw new InvalidOperationException("Нельзя удалить владельца пространства");

            if (!await _memberRepository.IsMember(workspaceId, userId))
                return false;

            return await _memberRepository.Remove(workspaceId, userId);
        }

        public async Task<bool> IsMember(int workspaceId, int userId)
        {
            return await _memberRepository.IsMember(workspaceId, userId);
        }

        public async Task<string?> GetUserRole(int workspaceId, int userId)
        {
            var role = await _memberRepository.GetUserRole(workspaceId, userId);
            return role?.ToString().ToLower();
        }
    }
}
