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
            // Базовый маппинг Scene -> SceneResponse
            CreateMap<Scene, SceneResponse>()
                .ForMember(dest => dest.PointsOfInterest, opt => opt.Ignore())
                .ForMember(dest => dest.ModelUrl, opt => opt.Ignore())
                .ForMember(dest => dest.ImageUrl, opt => opt.Ignore())
                .ForMember(dest => dest.VideoUrl, opt => opt.Ignore())
                .ForMember(dest => dest.PanoramaUrl, opt => opt.Ignore());

            // Маппинг ModelScene -> SceneResponse (дополняет базовый)
            CreateMap<ModelScene, SceneResponse>()
                .ForMember(dest => dest.ModelUrl, opt => opt.MapFrom(src => src.modelUrl))
                .ForMember(dest => dest.ModelFormat, opt => opt.MapFrom(src => src.ModelFormat))
                .ForMember(dest => dest.CameraStartX, opt => opt.MapFrom(src => src.CameraStartX))
                .ForMember(dest => dest.CameraStartY, opt => opt.MapFrom(src => src.CameraStartY))
                .ForMember(dest => dest.CameraStartZ, opt => opt.MapFrom(src => src.CameraStartZ))
                .ForMember(dest => dest.CameraTargetX, opt => opt.MapFrom(src => src.CameraTargetX))
                .ForMember(dest => dest.CameraTargetY, opt => opt.MapFrom(src => src.CameraTargetY))
                .ForMember(dest => dest.CameraTargetZ, opt => opt.MapFrom(src => src.CameraTargetZ))
                .ForMember(dest => dest.AmbientLightIntensity, opt => opt.MapFrom(src => src.AmbientLightIntensity))
                .ForMember(dest => dest.EnableVR, opt => opt.MapFrom(src => src.EnableVR));

            // Маппинг ImageScene -> SceneResponse
            CreateMap<ImageScene, SceneResponse>()
                .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.ImageUrl))
                .ForMember(dest => dest.ImageWidth, opt => opt.MapFrom(src => src.Width))
                .ForMember(dest => dest.ImageHeight, opt => opt.MapFrom(src => src.Height));

            // Маппинг VideoScene -> SceneResponse
            CreateMap<VideoScene, SceneResponse>()
                .ForMember(dest => dest.VideoUrl, opt => opt.MapFrom(src => src.VideoUrl))
                .ForMember(dest => dest.DurationSeconds, opt => opt.MapFrom(src => src.DurationSeconds));

            // Маппинг PanoramaScene -> SceneResponse
            CreateMap<PanoramaScene, SceneResponse>()
                .ForMember(dest => dest.PanoramaUrl, opt => opt.MapFrom(src => src.PanoramaUrl))
                .ForMember(dest => dest.PanoramaType, opt => opt.MapFrom(src => "equirectangular"));
        }
    }
}
