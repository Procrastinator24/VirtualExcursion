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
    public class GuideProfileProfile : Profile
    {
        public GuideProfileProfile()
        {
            // Request → Entity (для создания)
            CreateMap<CreateGuideProfileRequest, GuideProfile>();

            // Request → Entity (для обновления)
            CreateMap<UpdateGuideProfileRequest, GuideProfile>();

            // Entity → Response
            CreateMap<GuideProfile, GuideProfileResponse>()
               .ForMember(dest => dest.UserName,
                   opt => opt.MapFrom(src => src.User != null ? src.User.Username : null))
               .ForMember(dest => dest.UserEmail,
                   opt => opt.MapFrom(src => src.User != null ? src.User.Email : null))
               .ForMember(dest => dest.ScenesCount,
                   opt => opt.MapFrom(src => src.Scenes.Count))
               .ForMember(dest => dest.ExcursionsCount,
                   opt => opt.MapFrom(src => src.Excursions.Count))
               .ForMember(dest => dest.Rating,
                   opt => opt.MapFrom(src => (int?)null));  // пока null
        }
    }
}
