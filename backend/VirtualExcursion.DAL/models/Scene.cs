using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.DAL.models
{
    
    public class Scene
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Theme { get; set; }
        public string? ThumbnailUrl { get; set; }
        public string ContentType { get; set; } = "threed";
        public int AuthorId { get; set; }
        public bool IsPublished { get; set; }
        public int ViewCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public ICollection<POI> PointsOfInterest { get; set; } = new List<POI>();

       // public virtual GuideProfile Author { get; set; } = null!;

        public int? WorkspaceId { get; set; }
        public virtual Workspace? Workspace { get; set; }

        public virtual ModelScene? ModelScene { get; set; }
        public virtual ImageScene? ImageScene { get; set; }
        public virtual VideoScene? VideoScene { get; set; }
        public virtual PanoramaScene? PanoramaScene { get; set; }

        public ICollection<ExcursionScene> ExcursionScenes { get; set; } = new List<ExcursionScene>();
        public ICollection<SceneTag> SceneTags { get; set; } = new List<SceneTag>();

    }
}
