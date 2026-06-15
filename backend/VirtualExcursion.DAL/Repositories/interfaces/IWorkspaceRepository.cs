using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.DAL.models;

namespace VirtualExcursion.DAL.Repositories.interfaces
{
    public interface IWorkspaceRepository
    {
        Task<List<Workspace>> Get();
        Task<Workspace?> GetById(int id);
        Task<List<Workspace>> GetByOwnerId(int ownerId);
        Task<List<Workspace>> GetByUserId(int userId);
        Task<Workspace> Create(Workspace workspace);
        Task<Workspace> Update(Workspace workspace);
        Task<bool> Delete(int id);
        Task<bool> Exists(int id);
        Task<bool> IsOwner(int workspaceId, int userId);
        Task<bool> IsMember(int workspaceId, int userId);
    }
}
