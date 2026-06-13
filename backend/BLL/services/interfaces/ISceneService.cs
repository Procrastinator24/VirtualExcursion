using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.BLL.DTO.Responses;

namespace VirtualExcursion.BLL.services.interfaces
{
    public interface ISceneService
    {
        Task<List<SceneResponse>> Get();
        Task<SceneResponse> GetById(int id);
        Task<List<SceneResponse>> GetByWorkspaceId(int workspaceId, bool onlyPublished);
        Task<List<SceneResponse>> GetByGuideProfileId(int guideProfileId);
    }
}
