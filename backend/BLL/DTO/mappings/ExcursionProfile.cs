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
             .ForMember(dest => dest.workspaceName, opt => 
             opt.MapFrom(src => src.Workspace != null ? src.Workspace.Name : null))

             

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
             
             .ForMember(dest => dest.ContentTypes,
                opt => opt.MapFrom(src => GetContentTypes(src.ExcursionScenes)))
             
             .ForMember(dest => dest.TagsNames,
                opt => opt.MapFrom(src => src.ExcursionTags.Select(et => et.Tag.Name).ToList()))
             
             .ForMember(dest => dest.FavouritesCount,
                 opt => opt.MapFrom(src => src.Favourites.Count));

        }
        private List<string> GetContentTypes(ICollection<ExcursionScene> scenes)
        {
            if (scenes == null || !scenes.Any())
                return new List<string>();

            // Собираем уникальные типы контента из сцен
            var types = scenes
                .Select(s => s.Scene.ContentType)
                .Where(t => !string.IsNullOrEmpty(t))
                .Distinct()
                .ToList();

            // Маппим типы из БД в названия для фронта
            var mappedTypes = new List<string>();

            foreach (var type in types)
            {
                if (type.Contains("vr")) mappedTypes.Add("vr");
                else if (type.Contains("3d")) mappedTypes.Add("3d");
                else if (type.Contains("360")) mappedTypes.Add("panorama");
                else if (type.Contains("video")) mappedTypes.Add("video");
                else if (type.Contains("image")) mappedTypes.Add("image");
                else mappedTypes.Add(type.ToLower());
            }

            return mappedTypes.Distinct().ToList();
        }
    }
}
