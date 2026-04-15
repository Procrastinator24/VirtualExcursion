using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.BLL.DTO.Requests;
using VirtualExcursion.BLL.DTO.Responses;

namespace VirtualExcursion.BLL.services.interfaces
{
    public interface IModelSceneService
    {
        Task<List<ModelSceneResponse>> Get();
        Task<ModelSceneResponse> GetById(int id);
        Task<ModelSceneResponse> GetBySceneId(int sceneId);
        Task<ModelSceneResponse> Create(CreateModelSceneRequest request);
        Task<ModelSceneResponse> Update(UpdateModelSceneRequest request);
        Task<bool> Delete(int id);


    }
}
