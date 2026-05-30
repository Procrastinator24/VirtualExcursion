using AutoMapper;
using VirtualExcursion.BLL.DTO.Requests;
using VirtualExcursion.BLL.DTO.Responses;
using VirtualExcursion.DAL.models;

namespace VirtualExcursion.BLL.DTO.mappings
{
    public class ModelSceneProfile : Profile
    {
        public ModelSceneProfile()
        {
            // Request → Entity (для создания)
            CreateMap<CreateModelSceneRequest, ModelScene>();

            // Request → Entity (для обновления)
            CreateMap<UpdateModelSceneRequest, ModelScene>();

            // Entity → Response
            CreateMap<ModelScene, ModelSceneResponse>()
                .ForMember(dest => dest.SceneName,
                    opt => opt.MapFrom(src => src.Scene != null ? src.Scene.Title : null))
                .ForMember(dest => dest.PointsOfInterestCount,
                    opt => opt.MapFrom(src => src.PointsOfInterest != null ? src.PointsOfInterest.Count : 0))
                .ForMember(dest => dest.Author, opt => opt.MapFrom(src => src.Scene.Author.OrganizationName))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Scene.Description))
                .ForMember(dest => dest.PointsOfInterest,
                    opt => opt.MapFrom(src => src.PointsOfInterest));
        }
    }
}
