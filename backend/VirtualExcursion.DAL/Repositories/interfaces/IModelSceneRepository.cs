using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.DAL.models;

namespace VirtualExcursion.DAL.Repositories.interfaces
{
    public interface IModelSceneRepository
    {
        Task<List<ModelScene>> Get();
        Task<ModelScene> GetById(int id);
        Task<ModelScene> GetBySceneId(int sceneId);
        Task<ModelScene> Create(ModelScene modelScene);
        Task<ModelScene> Update(ModelScene modelScene);
        Task<bool> Delete(int id);
        Task<bool> Exists(int id);
        Task<bool> ExistsBySceneId(int sceneId, int? excludeId = null);
    }
}
