using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.BLL.DTO.Requests;
using VirtualExcursion.BLL.DTO.Responses;

namespace VirtualExcursion.BLL.services.interfaces
{
    public interface ITagService
    {
        Task<List<TagResponse>> Get();
        Task<TagResponse> GetById(int id);
        Task<TagResponse> GetBySlug(string slug);
        Task<TagResponse> Create(CreateTagRequest request);
        Task<TagResponse> Update(UpdateTagRequest request);
        Task<bool> Delete(int id);
    }
}
