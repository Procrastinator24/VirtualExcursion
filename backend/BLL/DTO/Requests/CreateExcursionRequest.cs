using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.BLL.DTO.Requests
{
    public class CreateExcursionRequest
    {
        [Required(ErrorMessage = "Название обязательно")]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(2000)]
        public string? Description { get; set; }

        [MaxLength(500)]
        public string? ThumbnailUrl { get; set; }

        public string? Duration { get; set; }
        public int WorkspaceId {  get; set; }

        public bool IsPublished { get; set; } = false;
        public List<int> SceneIds { get; set; } = new();  
        public List<int> TagIds { get; set; } = new();
    }
}
