using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.BLL.DTO.Requests;
using VirtualExcursion.BLL.DTO.Responses;

namespace VirtualExcursion.BLL.services.interfaces
{
    public interface IExcursionService
    {
        Task<List<ExcursionResponse>> Get(bool onlyPublished);
        Task<ExcursionResponse> GetById(int id);
        /// <summary>
        /// Получить все экскурсии рабочего пространства
        /// </summary>
        Task<List<ExcursionResponse>> GetByWorkspaceId(int workspaceId);
        //Task<List<ExcursionResponse>> GetByGuideId(int guideId);
        Task<ExcursionResponse> Create(CreateExcursionRequest request, int userId);
        Task<ExcursionResponse> Update(UpdateExcursionRequest request);
        Task<bool> Delete(int id);
        Task AddSceneToExcursion(AddSceneToExcursionRequest request);
        Task RemoveSceneFromExcursion(int excursionId, int sceneId);
        Task ReorderScenes(ReorderExcursionScenesRequest request);
        Task IncrementViewCount(int id);
    }
}
