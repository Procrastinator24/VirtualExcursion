using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.BLL.DTO.Requests;
using VirtualExcursion.BLL.DTO.Responses;
using VirtualExcursion.DAL.models;

namespace VirtualExcursion.BLL.DTO.mappings
{
    public class TagProfile : Profile
    {
        public TagProfile()
        {
            // Request → Entity (для создания)
            CreateMap<CreateTagRequest, Tag>();

            // Request → Entity (для обновления)
            CreateMap<UpdateTagRequest, Tag>();

            // Entity → Response
            CreateMap<Tag, TagResponse>()
                .ForMember(dest => dest.ScenesCount,
                    opt => opt.MapFrom(src => src.SceneTags != null ? src.SceneTags.Count : 0));
        }
    }
}
