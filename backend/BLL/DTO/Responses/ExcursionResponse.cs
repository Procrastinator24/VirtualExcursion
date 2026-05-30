using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.BLL.DTO.Responses
{
    public class ExcursionResponse
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? ThumbnailUrl { get; set; }
        public string? Duration { get; set; }
        public int ViewCount { get; set; }
        public bool IsPublished { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? workspaceId { get; set; }   
        public string? workspaceName { get; set; }
        public int? GuideId { get; set; }
        public string? GuideName { get; set; }
        public List<ExcursionSceneResponse> Scenes { get; set; } = new();
        public int FavouritesCount { get; set; }
        public bool IsFavourite { get; set; }  // для текущего пользователя
        public string? ContentType { get; set; }  // "3d", "vr", "panorama", "video", "image"
        public List<string> TagsNames { get; set; } = new();  // имена тегов для отображения
    }

    public class ExcursionSceneResponse
    {
        public int SceneId { get; set; }
        public string SceneTitle { get; set; } = string.Empty;
        public string? SceneThumbnailUrl { get; set; }
        public string? SceneContentType { get; set; }
        public int Order { get; set; }
    }
    public class ExcursionShortResponse
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? ThumbnailUrl { get; set; }
        public string? Duration { get; set; }
    }
}
