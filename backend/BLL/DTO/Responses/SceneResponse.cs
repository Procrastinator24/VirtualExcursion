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
        // Базовые поля
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Theme { get; set; }
        public string? ThumbnailUrl { get; set; }
        public string ContentType { get; set; } = "threed";
        public int AuthorId { get; set; }
        public string? AuthorName { get; set; } // Если есть автор
        public bool IsPublished { get; set; }
        public int ViewCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Связи
        public int? WorkspaceId { get; set; }
        public List<ExcursionResponse>? Excursions { get; set; }
        public List<TagResponse>? Tags { get; set; }

        // ===== ПОЛЯ ДЛЯ 3D =====
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

        // ===== ПОЛЯ ДЛЯ ИЗОБРАЖЕНИЯ =====
        public string? ImageUrl { get; set; }
        public int? ImageWidth { get; set; }
        public int? ImageHeight { get; set; }

        // ===== ПОЛЯ ДЛЯ ВИДЕО =====
        public string? VideoUrl { get; set; }
        public int? DurationSeconds { get; set; }

        // ===== ПОЛЯ ДЛЯ ПАНОРАМЫ =====
        public string? PanoramaUrl { get; set; }
        public string? PanoramaType { get; set; }

        // ===== ТОЧКИ ИНТЕРЕСА (только для 3D) =====
        public List<POIResponse>? PointsOfInterest { get; set; }
    }
    public class SceneShortResponse
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? ThumbnailUrl { get; set; }
        public string? ContentType { get; set; }
    }
}
