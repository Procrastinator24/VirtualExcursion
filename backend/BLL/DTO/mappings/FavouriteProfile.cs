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
    public class FavouriteProfile : Profile
    {
        public FavouriteProfile() {
            // Request → Entity
            CreateMap<CreateFavouriteRequest, Favourite>();

            // Entity → Response
            CreateMap<Favourite, FavouriteResponse>()
                .ForMember(dest => dest.WorkspaceName,
                    opt => opt.MapFrom(src => src.Excursion.Workspace.Name))
                .ForMember(dest => dest.Excursion,
                    opt => opt.MapFrom(src => src.Excursion))
                .ForMember(dest => dest.Scene,
                    opt => opt.MapFrom(src => src.Scene));

            CreateMap<Excursion, ExcursionShortResponse>();
            CreateMap<Scene, SceneShortResponse>();
        }
    }
}
