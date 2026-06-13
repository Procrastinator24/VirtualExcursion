using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.DAL.models
{
    public class Excursion
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(2000)]
        public string Description { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? ThumbnailUrl { get; set; }

        public string? Duration { get; set; }  
        public string? City { get;set; }
        public string? Theme { get; set; }

        public int ViewCount { get; set; } = 0;

        public bool IsPublished { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }


        
        
        public int? WorkspaceId { get; set; }


        public virtual Workspace Workspace { get; set; }
        public virtual ICollection<ExcursionScene> ExcursionScenes { get; set; } = new List<ExcursionScene>();
        public virtual ICollection<Favourite> Favourites { get; set; } = new List<Favourite>();
        public virtual ICollection<ExcursionTag> ExcursionTags { get; set; } = new List<ExcursionTag>();
    }
}
