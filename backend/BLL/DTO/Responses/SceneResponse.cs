using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.DAL.models;

namespace VirtualExcursion.BLL.DTO.Responses
{
    public class SceneResponse
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Theme { get; set; }
        public string? ThumbnailUrl { get; set; }
        public string ContentType { get; set; } = "ThreeD";
        public string Author { get; set; }
        public bool IsPublished { get; set; }
        public int ViewCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        //public List<TagResponse> SceneTags { get; set; }
    }
    public class SceneShortResponse
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? ThumbnailUrl { get; set; }
        public string? ContentType { get; set; }
    }
}
