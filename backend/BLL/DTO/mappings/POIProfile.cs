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
    public class POIProfile : Profile
    {
       public POIProfile() {
            // Request → Entity (для создания)
            CreateMap<CreatePOIRequest, POI>();

            // Request → Entity (для обновления)
            CreateMap<UpdatePOIRequest, POI>();

            // Entity → Response
            CreateMap<POI, POIResponse>()
                .ForMember(dest => dest.ModelSceneName,
                    opt => opt.MapFrom(src => src.Scene != null ? src.Scene.Title : null));
       }
    }
}
