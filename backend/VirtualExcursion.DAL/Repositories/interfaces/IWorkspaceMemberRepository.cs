using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.DAL.models;

namespace VirtualExcursion.DAL.Repositories.interfaces
{
    public interface IWorkspaceMemberRepository
    {
        Task<List<WorkspaceMember>> GetByWorkspaceId(int workspaceId);
        Task<WorkspaceMember?> GetByWorkspaceAndUser(int workspaceId, int userId);
        Task<WorkspaceMember> Add(WorkspaceMember member);
        Task<WorkspaceMember> UpdateRole(WorkspaceMember member);
        Task<bool> Remove(int workspaceId, int userId);
        Task<bool> IsMember(int workspaceId, int userId);
        Task<WorkspaceRole?> GetUserRole(int workspaceId, int userId);
    }
}
