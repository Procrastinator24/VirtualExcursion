using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.BLL.DTO.Requests
{
    public class CreateModelSceneRequest
    {
        public int SceneId { get; set; }
        public string ModelUrl { get; set; }
        public string ModelFormat { get; set; } = "glb";
        public float CameraStartX { get; set; } = 0;
        public float CameraStartY { get; set; } = 0;
        public float CameraStartZ { get; set; } = 0;
        public float CameraTargetX { get; set; } = 0;
        public float CameraTargetY { get; set; } = 0;
        public float CameraTargetZ { get; set; } = 0;
        public float AmbientLightIntensity { get; set; } = 0.5f;
        public bool EnableVR { get; set; } = false;
    }
}
