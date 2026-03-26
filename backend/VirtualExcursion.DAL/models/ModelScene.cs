using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.DAL.models
{
    public class ModelScene
    {
        public int Id { get; set; }
        public int SceneId { get; set; }
        public string modelUrl { get; set; } = string.Empty;
        public string ModelFormat { get; set; } = "glb";
        public float CameraStartX { get; set; } = 0;
        public float CameraStartY { get; set; } = 0;
        public float CameraStartZ { get; set; } = 0;
        public float CameraTargetX { get; set; } = 0;
        public float CameraTargetY { get; set; } = 0;
        public float CameraTargetZ { get; set; } = 0;
        public float AmbientLightIntensity { get; set; } = 0.5f;
        public bool EnableVR { get; set; } = false;
        public virtual Scene Scene { get; set; } = null!;
        public ICollection<POI> PointsOfInterest { get; set; } = new List<POI>();
    }
}
