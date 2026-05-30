using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.DAL.models;

namespace VirtualExcursion.DAL.Repositories.interfaces
{
    public interface ISceneRepository
    {
        Task<List<Scene>> Get();
        Task<Scene> GetById(int id);
        Task<List<Scene>> GetByWorkspaceId(int workspaceId);
        Task<List<Scene>> GetByGuideProfileId(int guideProfileId);
        //Task<ModelScene> Create(ModelScene modelScene);
        //Task<ModelScene> Update(ModelScene modelScene);
        //Task<bool> Delete(int id);
        //Task<bool> Exists(int id);
        //Task<bool> ExistsBySceneId(int sceneId, int? excludeId = null);
    }
}
