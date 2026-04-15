using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.BLL.DTO.Requests;
using VirtualExcursion.BLL.DTO.Responses;

namespace VirtualExcursion.BLL.services.interfaces
{
    public interface IGuideProfileService
    {
        Task<List<GuideProfileResponse>> Get();
        Task<GuideProfileResponse> GetById(int id);
        Task<GuideProfileResponse> GetByUserId(int userId);
        Task<GuideProfileResponse> Create(CreateGuideProfileRequest request);
        Task<GuideProfileResponse> Update(UpdateGuideProfileRequest request);
        Task<bool> Delete(int id);
    }
}
