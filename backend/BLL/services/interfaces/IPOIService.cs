using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.BLL.DTO.Requests;
using VirtualExcursion.BLL.DTO.Responses;

namespace VirtualExcursion.BLL.services.interfaces
{
    public interface IPOIService
    {
        Task<List<POIResponse>> Get();
        Task<List<POIResponse>> GetBySceneId(int sceneId);
        Task<POIResponse> GetById(int id);
        Task<POIResponse> Create(CreatePOIRequest request);
        Task<POIResponse> Update(UpdatePOIRequest request);
        Task<bool> Delete(int id);
    }
}
