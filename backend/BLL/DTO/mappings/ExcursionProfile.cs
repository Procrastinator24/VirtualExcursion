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
    public class ExcursionProfile : Profile
    {
        public ExcursionProfile() { 
            CreateMap<CreateExcursionRequest, Excursion>();
            CreateMap<UpdateExcursionRequest, Excursion>();

            CreateMap<Excursion, ExcursionResponse>()
             .ForMember(dest => dest.workspaceName, opt => opt.MapFrom(src => src.Workspace != null ? src.Workspace.Name : null))

             .ForMember(dest => dest.GuideName,
                 opt => opt.MapFrom(src => src.GuideProfile != null ? src.GuideProfile.OrganizationName : null))
             
             .ForMember(dest => dest.Scenes,
                 opt => opt.MapFrom(src => src.ExcursionScenes
                     .OrderBy(es => es.Order)
                     .Select(es => new ExcursionSceneResponse
                     {
                         SceneId = es.Scene.Id,
                         SceneTitle = es.Scene.Title,
                         SceneThumbnailUrl = es.Scene.ThumbnailUrl,
                         SceneContentType = es.Scene.ContentType,
                         Order = es.Order
                     })))
             
             .ForMember(dest => dest.ContentType,
                opt => opt.MapFrom(src => DetermineContentType(src.ExcursionScenes)))
             
             .ForMember(dest => dest.TagsNames,
                opt => opt.MapFrom(src => src.ExcursionTags.Select(et => et.Tag.Name).ToList()))
             
             .ForMember(dest => dest.FavouritesCount,
                 opt => opt.MapFrom(src => src.Favourites.Count));

        }
        private string DetermineContentType(ICollection<ExcursionScene> scenes)
        {
            if (scenes == null || !scenes.Any()) return "unknown";

            // Приоритет: VR > 3D > 360 > video > image
            var types = scenes.Select(s => s.Scene.ContentType);

            if (types.Contains("vr")) return "vr";
            if (types.Contains("3d")) return "3d";
            if (types.Contains("360")) return "panorama";
            if (types.Contains("video")) return "video";
            if (types.Contains("image")) return "image";

            return "mixed";
        }
    }
}
