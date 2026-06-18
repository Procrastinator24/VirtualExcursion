using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.DAL.models;

namespace VirtualExcursion.DAL.Repositories.interfaces
{
    public interface IImageSceneRepository
    {
        Task<ImageScene?> GetById(int id);
        Task<List<ImageScene>> GetByWorkspaceId(int workspaceId, bool onlyPublished = true);
        Task<ImageScene> Create(ImageScene scene);
        Task<ImageScene> Update(ImageScene scene);
        Task<bool> Delete(int id);
    }
}
