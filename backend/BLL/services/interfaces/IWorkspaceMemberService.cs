using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.BLL.DTO.Requests.workspace;
using VirtualExcursion.BLL.DTO.Responses;

namespace VirtualExcursion.BLL.services.interfaces
{
    public interface IWorkspaceMemberService
    {
        Task<List<WorkspaceMemberResponse>> GetMembers(int workspaceId);
        Task<WorkspaceMemberResponse?> GetMember(int workspaceId, int userId);
        Task<WorkspaceMemberResponse> AddMember(AddWorkspaceMemberRequest request, int invitedById);
        Task<WorkspaceMemberResponse> UpdateRole(UpdateWorkspaceMemberRoleRequest request);
        Task<bool> RemoveMember(int workspaceId, int userId);
        Task<bool> IsMember(int workspaceId, int userId);
        Task<string?> GetUserRole(int workspaceId, int userId);
    }
}
