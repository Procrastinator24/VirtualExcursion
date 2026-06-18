using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.BLL.DTO.Requests;
using VirtualExcursion.BLL.DTO.Responses;

namespace VirtualExcursion.BLL.services.interfaces
{
    public interface ISceneService
    {
        Task<List<SceneResponse>> Get(bool onlyPublished);
        Task<SceneResponse> Create(CreateSceneRequest request);
        Task<SceneResponse> GetById(int id);
        Task<List<SceneResponse>> GetByWorkspaceId(int workspaceId, bool onlyPublished);
    }
}
