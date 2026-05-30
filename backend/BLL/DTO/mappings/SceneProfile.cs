using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.BLL.DTO.Responses;
using VirtualExcursion.DAL.models;

namespace VirtualExcursion.BLL.DTO.mappings
{
    public class SceneProfile : Profile
    {
        public SceneProfile() {
            CreateMap<Scene, SceneResponse>()
                .ForMember(dest => dest.Author, opt => opt.MapFrom(src => src.Author.OrganizationName));
                //.ForMember(dest => dest.SceneTags,
                //    opt => opt.MapFrom(src => src.SceneTags));
        }
    }
}
