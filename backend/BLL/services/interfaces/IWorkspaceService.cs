using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.BLL.DTO.Requests.workspace;
using VirtualExcursion.BLL.DTO.Responses;

namespace VirtualExcursion.BLL.services.interfaces
{
    public interface IWorkspaceService
    {
        Task<List<WorkspaceResponse>> Get();
        Task<WorkspaceResponse> GetById(int id);
        Task<List<WorkspaceResponse>> GetByOwnerId(int ownerId);
        Task<List<WorkspaceResponse>> GetByUserId(int userId);
        Task<WorkspaceResponse> Create(CreateWorkspaceRequest request, int ownerId);
        Task<WorkspaceResponse> Update(UpdateWorkspaceRequest request);
        Task<bool> Delete(int id);
        Task<bool> IsOwner(int workspaceId, int userId);
        Task<bool> IsMember(int workspaceId, int userId);
    }
}
