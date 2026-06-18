using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.DAL.models;

namespace VirtualExcursion.DAL.Repositories.interfaces
{
    public interface IThreeDSceneRepository
    {
        Task<ModelScene?> GetById(int id);
        Task<List<ModelScene>> GetByWorkspaceId(int workspaceId, bool onlyPublished = true);
        Task<ModelScene> Create(ModelScene scene);
        Task<ModelScene> Update(ModelScene scene);
        Task<bool> Delete(int id);
    }
}
