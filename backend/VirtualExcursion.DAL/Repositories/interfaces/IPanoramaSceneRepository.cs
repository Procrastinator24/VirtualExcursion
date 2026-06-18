using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.DAL.models;

namespace VirtualExcursion.DAL.Repositories.interfaces
{
    public interface IPanoramaSceneRepository
    {
        Task<PanoramaScene?> GetById(int id);
        Task<List<PanoramaScene>> GetByWorkspaceId(int workspaceId, bool onlyPublished = true);
        Task<PanoramaScene> Create(PanoramaScene scene);
        Task<PanoramaScene> Update(PanoramaScene scene);
        Task<bool> Delete(int id);
    }
}
