using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.DAL.models;

namespace VirtualExcursion.DAL.Repositories.interfaces
{
    public interface IExcursionRepository
    {
        Task<List<Excursion>> Get(bool onlyPublished);
        Task<Excursion?> GetById(int id);
        Task<List<Excursion>> GetByWorkspaceId(int workspaceId);
        //Task<List<Excursion>> GetByGuideId(int guideId); // устаревший
        Task<Excursion> Create(Excursion excursion);
        Task<Excursion> Update(Excursion excursion);
        Task<bool> Delete(int id);
        Task<bool> Exists(int id);
        Task AddSceneToExcursion(int excursionId, int sceneId, int order);
        Task AddTagToExcursion(int excursionId, int tagId);
        Task RemoveSceneFromExcursion(int excursionId, int sceneId);
        Task UpdateSceneOrder(int excursionId, int sceneId, int order);
        Task<bool> IsSceneInExcursion(int excursionId, int sceneId);
    }
}
