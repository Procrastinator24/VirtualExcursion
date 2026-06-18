using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.BLL.DTO.Requests
{
    public class CreateSceneRequest
    {
        // Общие поля
        public string Title { get; set; }
        public string Description { get; set; }
        public string? ThumbnailUrl { get; set; }
        public string ContentType { get; set; } // "3d", "image", "video", "panorama"
        public int WorkspaceId { get; set; }
        public bool IsPublished { get; set; }
        public string? Period { get; set; }
        public string? Region { get; set; }
        public List<int>? excursionIds { get; set; }    

        // Для 3D
        public string? ModelUrl { get; set; }
        public string? ModelFormat { get; set; }
        public float? CameraStartX { get; set; }
        public float? CameraStartY { get; set; }
        public float? CameraStartZ { get; set; }
        public float? CameraTargetX { get; set; }
        public float? CameraTargetY { get; set; }
        public float? CameraTargetZ { get; set; }
        public float? AmbientLightIntensity { get; set; }
        public bool? EnableVR { get; set; }
        public List<CreatePOIRequest>? PointsOfInterest { get; set; }

        // Для изображения/панорамы
        public string? MediaUrl { get; set; }

        // Для видео
        public int? DurationSeconds { get; set; }

        // Теги
        public List<int>? TagIds { get; set; }
    }
}
