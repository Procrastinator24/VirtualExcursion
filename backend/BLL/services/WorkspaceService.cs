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
    public class WorkspaceService : IWorkspaceService
    {
        private readonly IWorkspaceRepository _workspaceRepository;
        IWorkspaceMemberRepository _workspaceMemberRepository;
        private readonly IMapper _mapper;

        public WorkspaceService(IWorkspaceRepository workspaceRepository, IWorkspaceMemberRepository workspaceMemberRepository, IMapper mapper)
        {
            _workspaceRepository = workspaceRepository;
            _mapper = mapper;
            _workspaceMemberRepository = workspaceMemberRepository;
        }

        public async Task<List<WorkspaceResponse>> Get()
        {
            var workspaces = await _workspaceRepository.Get();
            return _mapper.Map<List<WorkspaceResponse>>(workspaces);
        }

        public async Task<WorkspaceResponse> GetById(int id)
        {
            var workspace = await _workspaceRepository.GetById(id);
            if (workspace == null)
                throw new KeyNotFoundException($"Workspace с id {id} не найден");

            return _mapper.Map<WorkspaceResponse>(workspace);
        }

        public async Task<List<WorkspaceResponse>> GetByOwnerId(int ownerId)
        {
            var workspaces = await _workspaceRepository.GetByOwnerId(ownerId);
            return _mapper.Map<List<WorkspaceResponse>>(workspaces);
        }

        public async Task<List<WorkspaceResponse>> GetByUserId(int userId)
        {
            var workspaces = await _workspaceRepository.GetByUserId(userId);
            return _mapper.Map<List<WorkspaceResponse>>(workspaces);
        }

        public async Task<WorkspaceResponse> Create(CreateWorkspaceRequest request, int ownerId)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            var workspace = _mapper.Map<Workspace>(request);
            workspace.OwnerId = ownerId;
            workspace.CreatedAt = DateTime.UtcNow;

            var created = await _workspaceRepository.Create(workspace);

            // Добавляем владельца как участника с ролью Admin
            var member = new WorkspaceMember
            {
                WorkspaceId = created.Id,
                UserId = ownerId,
                Role = WorkspaceRole.Admin,
                JoinedAt = DateTime.UtcNow,
                InvitationStatus = InvitationStatus.Accepted
            };
            await _workspaceMemberRepository.Add(member);

            return _mapper.Map<WorkspaceResponse>(created);
        }

        public async Task<WorkspaceResponse> Update(UpdateWorkspaceRequest request)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            if (!await _workspaceRepository.Exists(request.Id))
                throw new KeyNotFoundException($"Workspace с id {request.Id} не найден");

            var workspace = _mapper.Map<Workspace>(request);
            var updated = await _workspaceRepository.Update(workspace);
            return _mapper.Map<WorkspaceResponse>(updated);
        }

        public async Task<bool> Delete(int id)
        {
            if (!await _workspaceRepository.Exists(id))
                throw new KeyNotFoundException($"Workspace с id {id} не найден");

            return await _workspaceRepository.Delete(id);
        }

        public async Task<bool> IsOwner(int workspaceId, int userId)
        {
            return await _workspaceRepository.IsOwner(workspaceId, userId);
        }

        public async Task<bool> IsMember(int workspaceId, int userId)
        {
            return await _workspaceRepository.IsMember(workspaceId, userId);
        }
    }
}
