using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.DAL.models;

namespace VirtualExcursion.DAL.Repositories.interfaces
{
    public interface IVideoSceneRepository
    {
        Task<VideoScene?> GetById(int id);
        Task<List<VideoScene>> GetByWorkspaceId(int workspaceId, bool onlyPublished = true);
        Task<VideoScene> Create(VideoScene scene);
        Task<VideoScene> Update(VideoScene scene);
        Task<bool> Delete(int id);
    }
}
